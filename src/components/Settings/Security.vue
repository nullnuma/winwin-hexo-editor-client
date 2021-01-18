<template>
  <div class="q-pa-lg fit">
    <div style="max-width:400px">
      <q-input
        stack-label
        class="q-mb-md"
        type="text"
        label="暗号化に使用されるキー(JWT_SECRET)"
        hint="提案: ランダムな値"
        v-model="JWT_SECRET"
        filled
      />
      <q-input
        stack-label
        class="q-mb-md"
        v-model.number="JWT_EXPIRE"
        type="number"
        label="キーの有効期限(時間)"
        hint="提案: 1-3 デフォルト: 1"
        @change="onJWT_EXPIREChange(JWT_EXPIRE)"
        filled
      />
      <q-input
        stack-label
        class="q-mb-md"
        v-model.number="JWT_REFRESH"
        type="number"
        label="キーが完全に有効期限切れになる時間(日)"
        hint="提案: 5-7 デフォルト: 7"
        @change="onJWT_REFRESHChange(JWT_REFRESH)"
        filled
      />
      <q-input
        stack-label
        class="q-mb-md"
        v-model="APIKEY_SECRET"
        type="text"
        label="デバイスの認証に使用されるキー"
        hint="提案: ランダムな値"
        filled
      />
      <q-btn
        color="primary"
        icon="save"
        label="保存"
        stretch
        :disable="!changed"
        @click="onSubmit"
      />
    </div>
  </div>
</template>
<script>
import DispatcherService from 'src/service/dispatcher_service'
import { DialogService, DialogType } from 'src/service/dialog_service'
import message from 'src/utils/message'
export default {
  name: 'SettingsSecurity',
  data () {
    return {
      JWT_SECRET: '',
      JWT_EXPIRE: '',
      JWT_REFRESH: '',
      APIKEY_SECRET: ''
    }
  },
  computed: {
    changed () {
      return this.JWT_SECRET || this.JWT_EXPIRE || this.JWT_REFRESH || this.APIKEY_SECRET
    }
  },
  methods: {
    onJWT_EXPIREChange (v) {
      this.JWT_EXPIRE = v > 0 ? v : ''
    },
    onJWT_REFRESHChange (v) {
      this.JWT_REFRESH = v > 0 ? v : ''
    },
    async onSubmit () {
      if (this.changed) {
        const { type } = await DialogService.create(DialogType.ConfirmDialog, {
          title: '保存の確認',
          message: '再度ログインする必要があるかもしれませんが続行しますか?'
        })
        if (type !== 'ok') return
        try {
          await this.$apis.settings.security.setSecurity({
            JWT_SECRET: this.JWT_SECRET,
            JWT_EXPIRE: this.JWT_EXPIRE,
            JWT_REFRESH: this.JWT_REFRESH,
            APIKEY_SECRET: this.APIKEY_SECRET
          })
        } catch (err) {
          message.error({ message: '保存失敗', caption: err.message })
        }
        await DispatcherService.destory()
        this.JWT_SECRET = ''
        this.JWT_EXPIRE = ''
        this.JWT_REFRESH = ''
        this.APIKEY_SECRET = ''
        this.$router.push('/')
      }
    }
  }
}
</script>
