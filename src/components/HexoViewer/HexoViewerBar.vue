<template>
  <div
    class="row"
    style="max-height:35px;flex-wrap: nowrap"
    v-if="article"
  >
    <q-btn
      flat
      stretch
      color="primary"
      :icon="isFullscreen?'fullscreen_exit':'fullscreen'"
      @click="toggleFull"
    >
      <q-tooltip
        content-style="font-size: 14px"
        transition-show="none"
        transition-hide="none"
        anchor="bottom middle"
        self="center middle"
      >
        {{isFullscreen?'全画面の終了':'全画面表示'}}
      </q-tooltip>
    </q-btn>
    <q-btn
      flat
      stretch
      :icon="published?'close':'publish'"
      :color="published?'red':'primary'"
      @click="onPublish"
      v-if="!isPage"
    >
      <q-tooltip
        content-style="font-size: 14px"
        transition-show="none"
        transition-hide="none"
        anchor="bottom middle"
        self="center middle"
      >
        {{published?'非公開':'公海'}}
      </q-tooltip>
    </q-btn>
    <q-btn
      flat
      stretch
      color="primary"
      icon="edit"
      @click="editPostById"
    >
      <q-tooltip
        content-style="font-size: 14px"
        transition-show="none"
        transition-hide="none"
        anchor="bottom middle"
        self="center middle"
      >編集
      </q-tooltip>
    </q-btn>
    <q-btn
      flat
      stretch
      color="red"
      icon="delete"
      @click="deletePostById"
    >
      <q-tooltip
        content-style="font-size: 14px"
        transition-show="none"
        transition-hide="none"
        anchor="bottom middle"
        self="center middle"
      >削除
      </q-tooltip>
    </q-btn>
    <template v-if="!isPage">
      <q-btn
        stretch
        flat
        @click="editPostById"
      >
        <span style="white-space:nowrap">
          カテゴリ：
          {{categories.length?'':'なし'}}
          <q-badge
            v-for="(item,key) in categories"
            :key="key"
            color="primary"
            text-color="white"
            :label="item"
          />
        </span>
      </q-btn>
      <q-btn
        stretch
        flat
        @click="editPostById"
      >
        <span style="white-space:nowrap">
          ラベル：
          {{tags.length?'':'なし'}}
          <q-badge
            v-for="(item,key) in tags"
            :key="key"
            color="primary"
            text-color="white"
            :label="item"
          />
        </span>
      </q-btn>
    </template>
    <template v-else>
      <q-btn
        stretch
        flat
        @click="editPostById"
      >
        <span style="white-space:nowrap">
          PATH：
          <q-badge
            color="primary"
            text-color="white"
            :label="article.path"
          />
        </span>
      </q-btn>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import DispatcherService from 'src/service/dispatcher_service'
export default {
  name: 'HexoPostViewerBar',
  computed: {
    toolbarStyle () {
      return {
        height: '35px',
        'min-height': '35px',
        'min-width': '100%'
      }
    },
    id () {
      return this.$route.query.id
    },
    isPage () {
      return this.article.layout === 'page'
    },
    // externals
    ...mapState({
      article: state => state.hexoCore.data.article,
      published: state => state.hexoCore.data.article.published,
      isFullscreen: state => state.hexoUi.full
    }),
    ...mapGetters({
      tags: 'hexoCore/dataPostTagsList',
      categories: 'hexoCore/dataPostCategoriesList'
    })
  },
  methods: {
    async editPostById () {
      DispatcherService.editPostById(this.id)
    },
    async publishPostById () {
      DispatcherService.publishPostById(this.id)
    },
    async unpublishPostById () {
      DispatcherService.unpublishPostById(this.id)
    },
    async toggleFull () {
      DispatcherService.toggleFull()
    },
    async deletePostById () {
      DispatcherService.deletePostById(this.id)
    },
    onPublish () {
      this.published ? this.unpublishPostById() : this.publishPostById()
    }
  }
}
</script>
