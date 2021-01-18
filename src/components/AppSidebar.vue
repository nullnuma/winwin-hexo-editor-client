<template>
  <div class="fit overflow-hidden relative-position">
    <q-list class="q-pt-xl">
      <img
        class="bgimg"
        src="~/assets/hexo-editor-logo.png"
        alt="logo"
      >
      <div class="absolute fit"></div>
      <EssentialLink
        v-for="link in essentialLinks"
        :key="link.title"
        v-bind="link"
      />
      <q-item>
        <q-item-section avatar="">
        </q-item-section>
        <q-item-section>
          <q-item-label>記事を右にドラッグして編集します</q-item-label>
          <q-item-label caption lines="2">更多功能请自行探索</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-chip
              square
              size="10px"
              class="q-ml-none no-border-radius"
              color="primary"
              text-color="white"
              style="font-family:consolas"
            >
              <q-avatar
                color="grey-8"
                style="width:auto;"
                class="no-border-radius"
              >
                <span style="padding: 0 6px;">
                  winwin-hexo-editor
                </span>
              </q-avatar>
              <span style="padding-left:3px;">
                {{currentVersion}}
              </span>
            </q-chip>
          </q-item-label>
          <q-item-label
            caption
            lines="2"
          >プログラムリビジョン</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script>
import EssentialLink from 'components/EssentialLink'
import apis from 'src/api'
export default {
  name: 'AppSidebar',
  components: {
    EssentialLink
  },
  async beforeMount () {
    try {
      this.currentVersion = 'v' + await apis.info.version()
    } catch (err) {
      this.currentVersion = '取得失敗'
    }
  },
  data () {
    return {
      currentVersion: '読込中',
      essentialLinks: [
        {
          title: 'プロジェクトホームページ',
          caption: '@winwin',
          icon: 'home',
          link: 'https://winwin_2011.gitee.io/winwin-hexo-editor/'
        },
        {
          title: 'ソースコード',
          caption: '@winwin',
          icon: 'code',
          link: 'https://gitee.com/winwin_2011/winwin-hexo-editor'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.bgimg {
  position: absolute;
  bottom: 68px;
  left: 70px;
  width: 400px;
  opacity: 0.1;
  transform: translate(-50%, 50%);
}
</style>
