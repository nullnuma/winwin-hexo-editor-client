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
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-pa-md">
          <div class="row">
            <div class="col-4">
              <div class="q-pa-md">
                <div class="row">
                  <div class="text-h6">{{selecturl}}</div>
                  <q-space />
                  <q-btn icon="sync" flat round dense @click="reload"/>
                </div>
                <div class="row">
                  <q-scroll-area style="min-height: 350px;" class="col-12">
                    <q-tree
                      :nodes="dirlist"
                      node-key="label"
                      :expanded.sync="expanded"
                      selected-color="primary"
                      :selected.sync="selected"
                    />
                  </q-scroll-area>
                </div>
                <div class="row">
                  <q-uploader
                    url="http://localhost:5777/imagemgr/upload"
                    label="画像のアップロード"
                    color="teal"
                    square
                    flat
                    bordered
                    multiple
                    accept=".jpg, image/*, .heic"
                    :headers="[{name: 'slug', value: selecturl}]"
                    @uploaded="reload"
                    class="col-12"
                  />
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
                    選択
                  </div>
                  <q-icon class="absolute all-pointer-events" size="32px" name="info" color="white" style="top: 8px; left: 8px" @click.stop="showInfo(item)">
                    <q-tooltip>
                      クリックして編集
                      <br>
                      {{item.match(/([^/]*)\./)[1] + '.' + item.match(/\.(\w+)?/)[1]}}
                    </q-tooltip>
                  </q-icon>
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-negative text-white">
                      読み込みエラー
                    </div>
                  </template>
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
                  @click="switchSelect(item)" >
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-negative text-white">
                      読み込みエラー
                    </div>
                  </template>
                </q-img>
            </q-scroll-area>
            <div class="col-2">
              <q-btn color="primary" icon="add" label="追加" @click="addImage" />
            </div>
          </div>
      </q-card-section>
    </q-card>
    <image-edit-dialog
      :bus="bus">
    </image-edit-dialog>
  </q-dialog>
</template>

<script>
import { request } from '../../../../api/request'
import { ImageManagerActionType } from '../MonacoEditor/utils'
import { QImg } from 'quasar'
import ImageEditDialog from './ImageEditDialog'

export default {
  components: {
    QImg,
    ImageEditDialog
  },
  data () {
    return {
      opened: false,
      dirlist: [],
      filelist: [],
      selecturl: '',
      selectfile: '',
      selectlist: [],
      selected: '',
      expanded: ['assets']
    }
  },
  props: {
    bus: {
      type: Object,
      required: true
    },
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    show () {
      this.dirlist = []
      this.filelist = []
      this.selectlist = []
      this.reloadDirList()
      this.loadFileList(this.article.slug + '/')
      this.selected = this.article.slug
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      this.$emit('hide')
    },

    showInfo (url) {
      this.bus.$emit(ImageManagerActionType.IMAGEMANAGER_IMAGE_EDIT, url)
    },

    addImage () {
      let md = ''
      let i
      for (i = 0; i < this.selectlist.length; i++) {
        md += `![${this.selectlist[i].match(/([^/]*)\./)[1]}](${this.selectlist[i].replace(/^\/imagemgr\/data/, '/assets')})\n`
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

    reload () {
      this.bus.$emit(ImageManagerActionType.IMAGEMANAGER_LIST_RELOAD)
    },

    loadFileList (url) {
      const self = this
      this.selecturl = url
      request.get('/imagemgr/list/' + url)
        .then(function (response) {
          self.filelist = response.map((file) => '/imagemgr/data/' + url + file)
        })
    },

    async reloadDirList () {
      const response = await request.get('/imagemgr/dirlist')
      this.dirlist = []
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
              self: this,
              handler () {
                this.self.loadFileList(this.url)
              }
            })
          }
        }
      })
      this.dirlist = [root]
    }
  },
  mounted () {
    this.bus.$on(ImageManagerActionType.IMAGEMANAGER_OPEN, () => {
      this.show()
    })
    this.bus.$on(ImageManagerActionType.IMAGEMANAGER_LIST_RELOAD, () => {
      this.dirlist = []
      this.filelist = []
      this.reloadDirList()
      this.loadFileList(this.selecturl)
    })
  }
}
</script>
