import { debounce } from 'quasar'
import * as hexoCoreActionTypes from 'src/store/hexo/core/action-types'
import * as hexoFilterMutationTypes from 'src/store/hexo/filter/mutation-types'
import * as hexoFilterByTypes from 'src/store/hexo/filter/by-types'
import * as hexoSorterMutationTypes from 'src/store/hexo/sorter/mutation-types'
import * as hexoSorterByTypes from 'src/store/hexo/sorter/by-types'
import { DialogService, DialogType } from './dialog_service'
import { Logger } from 'src/utils/logger'
import message from 'src/utils/message'
import { UserConfigActionsType, UserConfigMutationsType } from 'src/store/user_config'
import { HexoCoreError } from 'src/store/hexo/core/errors'
const logger = new Logger({ prefix: 'dispatcher_service' })

class DispatcherService {
  constructor () {
    this.ready = false
    this.message = message
    this.inited = false
  }

  // #region internal functions
  setContext (ctx) {
    this.ctx = ctx
    this.ready = true
  }

  async dispatch () {
    return this.store.dispatch(...arguments)
  }

  commit () {
    return this.store.commit(...arguments)
  }

  get store () {
    return this.ctx.$store || this.ctx.store
  }

  get state () {
    return this.store.state
  }

  get getters () {
    return this.store.getters
  }

  get router () {
    return this.ctx.$router || this.ctx.router
  }

  get route () {
    return this.ctx.$route || this.ctx.route
  }
  // #endregion

  // #region lifecycle
  async init () {
    try {
      this.commit('hexoUi/init')
      this.commit('hexoUi/showLoading')
      this.commit('user/init')
      await this.dispatch('hexoCore/' + hexoCoreActionTypes.init)
      await this.dispatch('hexoSearch/init')
      await this.dispatch('userConfig/' + UserConfigActionsType.INIT)
      this.commit('hexoFilter/' + hexoFilterMutationTypes.SET_FILTER, { by: hexoFilterByTypes.ALL })
      this.commit('hexoSorter/' + hexoSorterMutationTypes.SET_SORTER, { by: hexoSorterByTypes.DATE })
      this.inited = true
    } catch (err) {
      if (process.env.DEV)logger.warn(err)
      if (err.status === 401) return
      if (err.name === 'AsyncRaceAbort') return
      this.message.error({ message: '初始化失败' })
    } finally {
      this.commit('hexoUi/hideLoading')
    }
    this.debouncedSavePost = debounce(this.savePost, 3000)
    this.autoSavePost = _ => this.debouncedSavePost(true)
  }

  async destory () {
    this.commit('hexoUi/destroy')
    this.commit('hexoFilter/' + hexoFilterMutationTypes.SET_FILTER, { by: hexoFilterByTypes.ALL })
    await this.dispatch('hexoCore/' + hexoCoreActionTypes.destroy)
    this.inited = false
  }

  // #endregion

  // #region load

  async reload (force = false) {
    try {
      this.commit('hexoUi/showLoading')
      await this.dispatch('hexoCore/' + hexoCoreActionTypes.reload, force)
      message.success({ message: '重载成功' })
    } catch (err) {
      if (err.status === 401) return
      if (err.name === 'AsyncRaceAbort') return
      this.message.error({ message: '重载失败', caption: err.message })
    } finally {
      this.commit('hexoUi/hideLoading')
    }
  }
  // #endregion

  // #region Post
  async viewPostById (_id, force = false) {
    if (!_id) throw new Error('_id is required')
    if (force) this.cancelSave()
    // 如果不是强制且没有保存，且不是当前已经打开的文章，则请求保存
    const requestSave = !force && // 非强制
     !this.getters['hexoCore/isPostSaved'] && // 打开的文件已更改
      (_id !== this.getters['hexoCore/dataPostId']) // 新文件不是已打开的文件
    try {
      if (requestSave) {
        const { type } = await DialogService.create(DialogType.ConfirmDialog, {
          message: '終了しますか?保存されていないファイルは失われます',
          okLabel: '終了',
          okColor: 'red',
          cancelLabel: 'キャンセル',
          cancelColor: 'primary',
          focus: 'cancel'
        })
        if (type !== 'ok') return
        this.viewPostById(_id, true)
      } else {
        await this.dispatch('hexoCore/' + hexoCoreActionTypes.loadArticleById, { _id, force })
        if (this.route.name !== 'view_article' || this.route.params.id !== _id) {
          this.router.push({
            name: 'view_article',
            params: {
              id: _id
            }
          })
        }
      }
    } catch (err) {
      if (err.code === HexoCoreError.INVALID_ID) {
        this.router.push('/')
        return
      }
      if (process.env.DEV)logger.warn(err)
      throw err
    }
  }

  async addPostByDefault () {
    try {
      if (!this.getters['hexoCore/isPostSaved']) {
        const { type } = await DialogService.create(DialogType.ConfirmDialog, {
          message: '保存しますか?保存されていないファイルは失われます',
          okLabel: '保存',
          okColor: 'red',
          cancelLabel: 'キャンセル',
          cancelColor: 'primary',
          focus: 'cancel'
        })
        if (type !== 'ok') return
      }
      this.cancelSave()
      const { type, data } = await DialogService.create(DialogType.NewPostDialog)
      if (type === 'ok') {
        const newId = await this.dispatch('hexoCore/' + hexoCoreActionTypes.addArticleBase, { options: data })
        this.router.push({
          name: 'edit_article',
          params: {
            id: newId
          }
        })
      }
    } catch (err) {
      if (process.env.DEV)logger.warn(err)
      if (err.status === 401) return
      if (err.name === 'AsyncRaceAbort') return
      this.message.error({ message: '作成に失敗した', caption: err.message })
    }
  }

  async deletePostById (_id) {
    const post = this.state.hexoCore.data.articles[_id || this.state.hexoCore.data.article._id]
    const message = `《${post.title}》を削除してもいいですか?`
    // if (post.date)message += `（最后编辑于${date.formatDate(post.date, 'YYYY年MM月DD日 HH:mm:ss')}）`

    const { type } = await DialogService.create(DialogType.ConfirmDialog, {
      title: '削除の確認',
      message,
      okLabel: '削除',
      okColor: 'red',
      cancelColor: 'primary',
      focus: 'cancel'
    })
    if (type !== 'ok') return
    try {
      this.cancelSave()
      const deletedId = await this.dispatch('hexoCore/' + hexoCoreActionTypes.deleteArticleById, { _id, force: true })
      if (deletedId === this.route.params.id && this.route.path !== '/home') { this.router.push('/home') }
    } catch (err) {
      if (err.name === 'AsyncRaceAbort') return
      this.message.error({ message: '削除失敗', caption: err.message })
    }
  }

  async closePost () {
    await this.dispatch('hexoCore/' + hexoCoreActionTypes.closeArticle)
  }

  async editPostById (_id = null, force = false) {
    if (force) this.cancelSave()
    // 如果不是强制且没有保存，且不是当前已经打开的文章，则请求保存
    const requestSave = (!force && !this.getters['hexoCore/isPostSaved']) &&
      (_id && (_id !== this.getters['hexoCore/dataPostId']))
    try {
      if (requestSave) {
        const { type } = await DialogService.create(DialogType.ConfirmDialog, {
          message: '終了しますか?保存されていないファイルは失われます',
          okLabel: '終了',
          okColor: 'red',
          cancelLabel: 'キャンセル',
          cancelColor: 'primary',
          focus: 'cancel'
        })
        if (type !== 'ok') return
        await this.editPostById(_id, true)
      } else {
        await this.dispatch('hexoCore/' + hexoCoreActionTypes.loadArticleById, { _id, force })
        if (this.route.name !== 'edit_article' || this.route.params.id !== _id) {
          this.router.push({
            name: 'edit_article',
            params: {
              id: _id
            }
          })
        }
      }
    } catch (err) {
      if (err.code === HexoCoreError.INVALID_ID) {
        this.router.push('/')
        return
      }
      if (process.env.DEV)logger.warn(err)
      throw err
    }
  }

  async publishPostById (_id = null, force = false) {
    if (force) this.cancelSave()
    try {
      if (!force && !this.getters['hexoCore/isPostSaved']) {
        const { type } = await DialogService.create(DialogType.ConfirmDialog, {
          message: '終了しますか?保存されていないファイルは失われます',
          okLabel: '終了',
          okColor: 'red',
          cancelLabel: 'キャンセル',
          cancelColor: 'primary',
          focus: 'cancel'
        })
        if (type !== 'ok') return
        return this.publishPostById(_id, true)
      } else {
        const { oldId, newId } = await this.dispatch('hexoCore/' + hexoCoreActionTypes.publishPostById, { _id, force })
        if (this.route.params.id === oldId) {
          this.router.push({
            name: this.router.name,
            params: {
              id: newId
            }
          })
        }
      }
    } catch (err) {
      if (err.name === 'AsyncRaceAbort') return
      message.error({ message: '公開に失敗しました', caption: err.message })
    }
  }

  async unpublishPostById (_id = null, force = false) {
    if (force) this.cancelSave()
    try {
      if (!force && !this.getters['hexoCore/isPostSaved']) {
        const { type } = await DialogService.create(DialogType.ConfirmDialog, {
          message: '非公開にしますか?保存されていないファイルは失われます',
          okLabel: '非公開にする',
          okColor: 'red',
          cancelLabel: 'キャンセル',
          cancelColor: 'primary',
          focus: 'cancel'
        })
        if (type !== 'ok') return
        this.publishPostById(_id, true)
      } else {
        const { type } = await DialogService.create(DialogType.ConfirmDialog, {
          message: '非公開にしますか?キャンセル後は元に戻せず、再発行された記事のアドレスも変更されます',
          okLabel: '非公開にする',
          okColor: 'red',
          cancelColor: 'primary',
          focus: 'cancel'
        })
        if (type !== 'ok') return
        const { oldId, newId } = await this.dispatch('hexoCore/' + hexoCoreActionTypes.unpublishPostById, { _id, force })
        if (this.route.params.id === oldId) {
          this.router.push({
            name: this.router.name,
            params: {
              id: newId
            }
          })
        }
      }
    } catch (err) {
      if (err.name === 'AsyncRaceAbort') return
      message.error({ message: '公開に失敗', caption: err.message })
    }
  }

  async setPostByPost (article) {
    await this.dispatch('hexoCore/' + hexoCoreActionTypes.updateArticle, article)
    await this.autoSavePost()
  }

  cancelSave () {
    logger.log('auto save canceled')
    this.saveCanceled = true
  }

  async savePost (isAuto) {
    if (isAuto && this.saveCanceled) {
      this.saveCanceled = false
      return
    }
    try {
      if (!isAuto) this.commit('hexoUi/showLoading', { message: '保存', delay: 100 })
      await this.dispatch('hexoCore/' + hexoCoreActionTypes.saveArticle)
      if (!isAuto) message.success({ message: '保存成功' })
    } catch (err) {
      if (err.status === 404) {
        err.message = 'リストが更新されました．更新してください'
      }
      if (err.name === 'AsyncRaceAbort') return
      message.error({ message: '保存失敗', caption: err.message })
    } finally {
      this.commit('hexoUi/hideLoading')
    }
  }
  // #endregion

  // #region hexo actions
  async deploy () {
    const { type } = await DialogService.create(DialogType.ConfirmDialog, {
      message: 'ブログをデプロイしますか?',
      focus: 'ok'
    })
    if (type !== 'ok') return
    try {
      this.commit('hexoUi/showLoading', { message: 'デプロイ', delay: 100 })
      await this.dispatch('hexoCore/' + hexoCoreActionTypes.deploy)
      message.success({ message: 'デプロイが完了しました' })
    } catch (err) {
      if (err.name === 'AsyncRaceAbort') return
      message.error({ message: 'デプロイに失敗しました', caption: err.message })
    } finally {
      this.commit('hexoUi/hideLoading')
    }
  }

  async generate () {
    try {
      this.commit('hexoUi/showLoading', { message: '生成', delay: 100 })
      await this.dispatch('hexoCore/' + hexoCoreActionTypes.generate)
      message.success({ message: '生成しました' })
    } catch (err) {
      if (err.name === 'AsyncRaceAbort') return
      message.error({ message: '生成に失敗しました', caption: err.message })
    } finally {
      this.commit('hexoUi/hideLoading')
    }
  }

  async clean () {
    try {
      this.commit('hexoUi/showLoading', { message: 'クリーン', delay: 100 })
      await this.dispatch('hexoCore/' + hexoCoreActionTypes.clean)
      message.success({ message: 'クリーンに成功しました' })
    } catch (err) {
      if (err.name === 'AsyncRaceAbort') return
      message.error({ message: 'クリーンに失敗しました', caption: err.message })
    } finally {
      this.commit('hexoUi/hideLoading')
    }
  }
  // #endregion

  // #region git actions
  async syncGit () {
    const { type } = await DialogService.create(DialogType.ConfirmDialog, {
      message: 'Gitから同期してもいいですか? Gitに保存されていないファイルは失われます',
      okLabel: 'ファイルを破棄し同期',
      okColor: 'red',
      cancelLabel: 'キャンセル',
      cancelColor: 'primary',
      focus: 'cancel'
    })
    if (type !== 'ok') return
    try {
      this.commit('hexoUi/showLoading', { message: 'Gitから同期', delay: 100 })
      const { remote } = await this.dispatch('hexoCore/' + hexoCoreActionTypes.syncGit)
      message.success({ message: remote ? '同期が完了しました' : 'リセットが完了しました', caption: remote ? '' : 'リモートが構成されていないので同期できません' })
      const name = this.route.name
      if (name === 'view_article') {
        await this.viewPostById(this.route.params.id, true)
      } else if (name === 'edit_article') {
        await this.editPostById(this.route.params.id, true)
      }
    } catch (err) {
      if (err.name === 'AsyncRaceAbort') return
      message.error({ message: '同期失敗', caption: err.message })
    } finally {
      this.commit('hexoUi/hideLoading')
    }
  }

  async saveGit () {
    try {
      this.commit('hexoUi/showLoading', { message: 'Gitへ同期', delay: 100 })
      const { remote } = await this.dispatch('hexoCore/' + hexoCoreActionTypes.saveGit)
      message.success({ message: remote ? '同期が完了しました' : 'リモートにプッシュしました', caption: remote ? '' : 'リモートが構成されていないので同期できません' })
    } catch (err) {
      if (err.name === 'AsyncRaceAbort') return
      message.error({ message: '同期失敗', caption: err.message })
    } finally {
      this.commit('hexoUi/hideLoading')
    }
  }
  // #endregion

  // #region UI
  async toggleFull () {
    this.commit('hexoUi/toggleFull')
  }
  // #endregion

  // #region search
  async search (q = '', size = '') {
    await this.dispatch('hexoSearch/search', { q, size })
  }

  async loadUiConfig () {
    await this.dispatch('userConfig/' + UserConfigActionsType.LOAD_UI_CONFIG)
  }

  async setUiConfig (config) {
    await this.commit('userConfig/' + UserConfigMutationsType.SET_UI_CONFIG, config)
  }

  async saveUiConfig () {
    await this.dispatch('userConfig/' + UserConfigActionsType.SAVE_UI_CONFIG)
  }
}

export default new DispatcherService()
