<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin"
      style="min-width:1000px; max-width:1400px; min-height:650px; height:800px; ">
      <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">イメージの追加</div>
          <q-space />
          <q-btn icon="sync" flat round dense @click="reloadDirList"/>
        </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-pa-md">
          <div class="row">
            <div class="col-4">
              <div class="q-pa-md">
                <div class="row">
                  <div class="text-h6" v-if="selecturl === ''">Please Select</div>
                  <div class="text-h6" v-else>{{selecturl}}</div>
                  <q-space />
                  <q-btn icon="sync" flat round dense @click="reloadDirList"/>
                </div>
                <div class="row">
                  <q-scroll-area style="min-height: 450px;" class="col-12">
                    <q-tree
                      :nodes="dirlist"
                      node-key="label"
                      :expanded.sync="expanded"
                    />
                  </q-scroll-area>
                </div>
              </div>
            </div>
            <q-scroll-area style="min-height: 450px;" class="col-8">
              <div class="row">
                <q-img
                  v-for="(item, index) in filelist"
                  :key="index"
                  :src="item"
                  spinner-color="white"
                  style="height: 140px; max-width: 150px"
                  @click="switchSelect(item)"
                >
                  <div class="absolute-bottom text-subtitle1 text-center" v-if="selectlist.indexOf(item) >= 0">
                    Select
                  </div>
                </q-img>
              </div>
            </q-scroll-area>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
          <div class="row">
            <q-scroll-area style="min-height: 100px; display: inline-block;" class="col-10">
                <q-img
                  v-for="(item, index) in selectlist"
                  :key="index"
                  :src="item"
                  spinner-color="white"
                  style="height: 80px; max-width: 150px"
                  @click="switchSelect(item)"
                />
            </q-scroll-area>
            <div class="col-2">
              <q-btn color="primary" icon="add" label="追加" @click="addImage" />
            </div>
          </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { request } from '../../../../api/request'
import { ImageManagerActionType } from '../MonacoEditor/utils'
import { QImg } from 'quasar'

export default {
  components: {
    QImg
  },
  data () {
    return {
      opened: false,
      dirlist: [],
      filelist: [],
      selecturl: '',
      selectlist: [],
      expanded: ['assets']
    }
  },
  props: {
    bus: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 以下方法是必需的
    // (不要改变它的名称 --> "show")
    show () {
      this.reloadDirList()
      this.dirlist = []
      this.filelist = []
      this.selectlist = []
      this.selecturl = ''
      this.$refs.dialog.show()
    },

    // 以下方法是必需的
    // (不要改变它的名称 --> "hide")
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit('hide')
    },
    addImage () {
      let md = ''
      let i
      for (i = 0; i < this.selectlist.length; i++) {
        md += `![${this.selectlist[i].match(/([^/]*)\./)[1]}](${this.selectlist[i]})\n`
      }
      this.bus.$emit(ImageManagerActionType.IMAGEMANAGER_INSERT_IMAGE, md)
      this.hide()
    },
    switchSelect (url) {
      const index = this.selectlist.indexOf(url)
      if (index >= 0) {
        this.selectlist.splice(index, 1)
      } else {
        this.selectlist.push(url)
      }
    },
    loadFileList (url) {
      const self = this
      this.selecturl = url.replace(/\/$/, '').split('/')[0]
      request.get('/imagemgr/list/' + url)
        .then(function (response) {
          self.filelist = response.map((file) => '/imagemgr/data/' + url + file)
        })
    },
    reloadDirList () {
      const self = this
      request.get('/imagemgr/dirlist')
        .then(function (response) {
          // [4] フロントエンドに対してレスポンスを返す
          self.dirlist = []
          const root = {
            label: 'assets',
            children: []
          }
          response.forEach((item) => {
            const tree = item.replace(/\/$/, '').split('/')
            let e = root
            let i, j, notfindChildren
            for (i = 0; i < tree.length; i++) {
              notfindChildren = 1
              for (j = 0; j < e.children.length; j++) {
                if (e.children[j].label === tree[i]) {
                  e = e.children[j]
                  notfindChildren = 0
                  break
                }
              }
              if (notfindChildren) {
                e.children.push({
                  label: tree[i],
                  children: [],
                  url: item,
                  self: self,
                  handler () {
                    self.loadFileList(this.url)
                  }
                })
              }
            }
          })
          self.dirlist = [
            root
          ]
        })
    }
  },
  mounted () {
    this.bus.$on(ImageManagerActionType.IMAGEMANAGER_OPEN, () => {
      this.show()
    })
  }
}
</script>
