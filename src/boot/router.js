let isFirst = true
import { Loading } from 'quasar'
import * as actionTypes from 'src/store/dispatcher/action-types'

export default async ({ router, app, store }) => {
  router.afterEach(() => {
    Loading.hide()
    if (isFirst) {
      const loading = document.getElementById('app-loading')
      loading.style.opacity = 0
      window.setTimeout(() => {
        loading.style.display = 'none'
      }, 500)
      isFirst = false
    }
  })
  router.beforeEach(async (to, from, next) => {
    if (!isFirst) {
      Loading.show()
    }
    if (!app.store.state.globalUser.inited) {
      app.store.commit('globalUser/init')
    }
    const isLoggedIn = app.store.state.globalUser.isLoggedIn
    const toLogin = to.path === '/login'
    // 真值表干的漂亮啊！
    //                     toLogin
    //                   true    false
    // isLoggedIn true   /home   next
    //            false  next    /login
    if (isLoggedIn ^ toLogin) {
      if (isFirst) await store.dispatch(actionTypes.init)
      if (to.query.id && ['edit', 'view'].includes(to.query.mode) && // 前提：确实要查看或编辑文章
        (!store.state.editorCore.data.article || // 文章没打开
          to.query.id !== store.state.editorCore.data.article._id) // 打开的文章不是需要的文章
      ) {
        if (to.query.mode === 'edit') store.dispatch(actionTypes.editPostById, { _id: to.query.id })
        if (to.query.mode === 'view') store.dispatch(actionTypes.viewPostById, { _id: to.query.id })
      }
      next()
    } else if (isLoggedIn && toLogin) {
      next('/home')
      Loading.hide()
    } else {
      next('/login')
    }
  })
}
