<template>
  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">名前の変更/削除</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          dense v-model="newname"
          autofocus
          @keyup.enter="prompt = false"
          :hint="newname + '.' + filename.match(/[^.]+$/)"
          :disable="disabled" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="キャンセル" v-close-popup :disabled="disabled" />
        <q-btn flat color="secondary" icon="replay" label="名前の変更" @click="rename" :disabled="disabled" />
      </q-card-actions>

      <q-card-actions align="left" class="text-primary">
        <q-btn flat color="red" icon="remove_circle" label="削除" @click="remove" :disabled="disabled" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

import { request } from '../../../../api/request'
import { ImageManagerActionType } from '../MonacoEditor/utils'

export default {
  data () {
    return {
      filename: '',
      newname: '',
      prompt: false,
      disabled: false
    }
  },
  props: {
    bus: {
      type: Object,
      required: true
    }
  },
  methods: {
    show () {
      this.prompt = true
    },
    hide () {
      this.prompt = false
    },
    onDialogHide () {
      this.prompt = false
    },
    async rename () {
      const filename = this.filename
      const newname = this.filename.split('/').reverse().slice(1).reverse().join('/') + '/' + this.newname + '.' + this.filename.match(/[^.]+$/)
      this.disabled = true
      await request.post('/imagemgr/rename', {
        old: filename,
        new: newname
      })
      this.hide()
      this.bus.$emit(ImageManagerActionType.IMAGEMANAGER_LIST_RELOAD)
    },
    async remove () {
      this.$q.dialog({
        message: '本当に削除しますか?',
        cancel: true
      }).onOk(async () => {
        this.disabled = true
        await request.get('/imagemgr/remove' + this.filename)
        this.hide()
        this.bus.$emit(ImageManagerActionType.IMAGEMANAGER_LIST_RELOAD)
      })
    }
  },
  mounted () {
    this.bus.$on(ImageManagerActionType.IMAGEMANAGER_IMAGE_EDIT, (filename) => {
      this.disabled = false
      this.filename = filename.replace(/^\/imagemgr\/data/, '')
      this.newname = filename.match(/([^/]*)\./)[1]
      this.show()
    })
  }
}
</script>
