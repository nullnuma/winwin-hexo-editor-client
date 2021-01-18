<template>
  <div class="bg-primary fixed installer flex flex-center">
    <div
      class="wrapper full-width q-px-lg column"
      style="max-width:1200px"
    >
      <q-banner class="bg-primary text-white">
        <span class="text-h5"> winwin-hexo-editor </span>
      </q-banner>
      <q-stepper
        v-if="!finished"
        class="col"
        v-model="step"
        ref="stepper"
        color="primary"
        header-nav
        animated
        flat
        :contracted="$q.screen.lt.sm"
      >
        <q-step
          :name="1"
          title="ようこそ"
          icon="flag"
          :done="step > 1"
        >
          <q-markdown
            :src="welcomemd"
            class="q-py-xl"
          ></q-markdown>
        </q-step>

        <q-step
          :name="2"
          title="ユーザ"
          icon="person"
          :error="!isValid(step2) && step > 2"
          :done="step > 2"
        >
          <div class="input-wrapper">
            <q-input
              v-for="item in step2"
              :key="item.key"
              v-model="item.value"
              class="stepper-input"
              type="text"
              :label="item.label"
              :rules="item.rules"
              stack-label
              filled
            />
            <q-markdown
              class="col"
              :src="usermd"
            ></q-markdown>
          </div>
        </q-step>

        <q-step
          :name="3"
          title="ブログ"
          icon="book"
          :error="!isValid(step3) && step > 3"
          :done="step > 2"
        >
          <div class="input-wrapper">
            <q-input
              v-for="item in step3"
              :key="item.key"
              class="stepper-input"
              v-model="item.value"
              type="text"
              :label="item.label"
              :rules="item.rules"
              stack-label
              filled
            />
            <q-markdown
              class="col"
              :src="hexomd"
            ></q-markdown>
          </div>
        </q-step>

        <q-step
          :name="4"
          title="セキュリティ"
          icon="security"
        >
          <div class="input-wrapper">
            <q-input
              v-for="item in step4"
              :key="item.key"
              class="stepper-input"
              v-model="item.value"
              type="text"
              :label="item.label"
              :rules="item.rules"
              stack-label
              filled
            />
            <q-markdown
              class="col"
              :src="securitymd"
            ></q-markdown>
          </div>
        </q-step>
        <q-step
          :name="5"
          title="確認"
          icon="done"
        >
          <template v-if="!isAllValid">
            <div class="q-py-xl text-red text-bold">
              <q-icon
                name="close"
                size="xx-large"
                class="q-mr-sm"
              />
              <span>検証に失敗</span>
            </div>
          </template>
          <template v-else>
            <div class="input-wrapper">
              <div class="text-h6 q-mb-lg">設定の確認</div>
              <q-input
                v-for="item in checkInfo"
                :key="item.key"
                class="stepper-input"
                v-model="item.value"
                type="text"
                :label="item.label"
                stack-label
                filled
                disable
              />
            </div>
          </template>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              stretch
              @click="step === 5 ?doInstall():$refs.stepper.next()"
              color="primary"
              :label="step === 5 ? '完了' : '次へ'"
              :disable="step === 5 && !isAllValid"
            />
            <q-btn
              stretch
              v-if="step > 1"
              flat
              color="primary"
              @click="$refs.stepper.previous()"
              label="前へ"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </template>
        <template v-slot:message>
          <q-banner
            v-if="step === 2"
            class="bg-blue text-white q-px-lg"
          >
            <template v-slot:avatar>
              <q-icon
                name="security"
                color="white"
              />
            </template>
            セキュリティ上の理由から，他のアプリとは異なるパスワードを使用してください!
          </q-banner>
          <q-banner
            v-else-if="step === 5&&!isAllValid"
            class="bg-red text-white q-px-lg"
          >
            <template v-slot:avatar>
              <q-icon
                name="warning"
                color="white"
              />
            </template>
            いくつかの問題が検出されました．変更して再試行してください
          </q-banner>
        </template>
      </q-stepper>
      <div
        class="col bg-white q-pa-lg"
        color="primary"
        flat
        v-else
      >
        <q-markdown
          :src="finishedmd"
          class="q-py-xl"
        ></q-markdown>
        <q-btn
          stretch
          color="primary"
          @click="onFinished"
          label="使い始める"
        />
      </div>
    </div>
  </div>
</template>
<script>
import welcomemd from '../markdown/install/welcome.md'
import finishedmd from '../markdown/install/finished.md'
import usermd from '../markdown/install/user.md'
import hexomd from '../markdown/install/hexo.md'
import securitymd from '../markdown/install/security.md'
import message from 'src/utils/message'
import { DialogService, DialogType } from 'src/service/dialog_service'
import { Loading } from 'quasar'
export default {
  name: 'Install',
  data () {
    return {
      finished: false,
      finishedmd,
      welcomemd,
      usermd,
      hexomd,
      securitymd,
      step: 1,
      validHexoRoot: true,
      serverHexoRoot: '',
      step2: [
        {
          key: 'username',
          label: 'ユーザ名(必須)',
          value: '',
          rules: [val => !!val || '必須']
        },
        {
          key: 'password',
          label: 'パスワード(必須)',
          value: '',
          rules: [val => !!val || '必須']
        }
      ],
      step3: [{
        key: 'HEXO_ROOT',
        label: '相対的なブログディレクトリパス(必須)',
        value: '',
        rules: [val => !!val || '必須']
      }],
      step4: [
        {
          key: 'JWT_SECRET',
          label: 'JWT_SECRET',
          value: ''
        },
        {
          key: 'APIKEY_SECRET',
          label: 'APIKEY_SECRET',
          value: ''
        }
        // {
        //   key: 'JW_EXPIRE',
        //   label: 'JW_EXPIRE',
        //   value: ''
        // },
        // {
        //   key: 'JW_REFRESH',
        //   label: 'JW_REFRESH',
        //   value: ''
        // },
      ]
    }
  },
  computed: {
    allConfig () {
      return this.step2.concat(this.step3).concat(this.step4)
    },
    checkInfo () {
      return this.allConfig.filter(item => item.value)
    },
    isAllValid () {
      return this.isValid(this.allConfig)
    }
  },
  methods: {
    isValid (config) {
      return config.filter(item => item.rules && item.rules.length).filter(item => item.rules[0](item.value) !== true).length === 0
    },
    onFinished () {
      this.$router.push('/')
    },
    async doInstall () {
      const data = {}
      this.allConfig.filter(item => !!item.value).map(item => {
        data[item.key] = item.value
      })
      try {
        Loading.show({
          message: 'インストール'
        })
        await this.$apis.install.do(data)
        Loading.hide()
        this.finished = true
      } catch (err) {
        Loading.hide()
        if (err.response && err.response.status === 400) {
          if (err.response.data.data.path) {
            this.serverHexoRoot = err.response.data.data.path
            DialogService.create(DialogType.ConfirmDialog, {
              title: 'インストールに失敗しました',
              message: `HEXO_ROOTを変更してください\n ${this.serverHexoRoot}は有効なhexoブログではありません`,
              okLabel: 'OK'
            })
          }
        } else {
          message.error({ message: 'インストールに失敗しました', caption: err.message })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.installer {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  .input-wrapper {
    padding: 50px 0;
    max-width: 500px;
    max-height: 400px;
    overflow-y: auto;
    margin: 0 auto;
  }
  .stepper-input {
    margin-bottom: 10px;
  }
}
</style>
