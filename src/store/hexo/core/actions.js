import * as mutationTypes from './mutation-types'
import * as actionTypes from './action-types'

import { Logger } from 'src/utils/logger'
const logger = new Logger({ prefix: 'hexoCore/Actions' })

// services
import { PostService } from 'src/service/post_service'
import { CategoryService } from 'src/service/category_service'
import { TagService } from 'src/service/tag_service'
import { HexoService, HexoServiceError } from 'src/service/hexo_service'

import { listToObject } from 'src/utils/common'
import { HexoCoreError } from './errors'

/**
  * 验证id是否有效（无效则引发异常），是否是当前文章id
  * @param {Object} state 状态
  * @param {String} _id 需要查询的id
  */
function getValidId (state, _id) {
  if (!state.data.article && !_id) throw new Error('No article opened, _id is required!')
  const validId = _id || state.data.article._id
  if (validId && !state.data.articles[validId]) throw new HexoCoreError(HexoCoreError.INVALID_ID, 'Invalid article id ' + validId)
  return validId
}

/**
  * 验证是否试图在非强制情况下放弃更改，是则引发异常
  * @param {Object} state 状态
  * @param {Boolean} force 是否强制操作
  */
function checkSaved (state, force) {
  if (!state.status.saved && !force) throw new Error('Unsaved change, use force=true to override.')
}

const actions = {
  /**
   * 初始化数据
   */
  async [actionTypes.init] ({ commit, dispatch }) {
    commit(mutationTypes.setReady, true)
    await dispatch(actionTypes.loadAll)
    try {
      const { post, page } = await HexoService.getRestrictedKeys()
      commit(mutationTypes.setRestrictedkeys, { post, page })
      commit(mutationTypes.setLoading, true)
    } catch (_) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, 'getRestrictedKeys ,actionTypes.initfail')
    }
  },

  /**
   * 销毁数据
   */
  async [actionTypes.destroy] ({ commit }) {
    commit(mutationTypes.closeArticle)
    commit(mutationTypes.resetAll)
    commit(mutationTypes.setReady, false)
  },

  /**
  * 刷新数据
  * @param {Boolean} [force] 是否强制载入（暂时未启用）
  */
  async [actionTypes.reload] ({ dispatch }, force) {
    await dispatch(actionTypes.loadAll)
  },

  /**
  * 从参数新建文章
  * @param {Object} payload 参数
  * @param {Boolean} [payload.force=false] 是否放弃当前未保存的更改
  * @param {Object} [payload.options={}] 新文章的选项
  */
  async [actionTypes.addArticleBase] ({ state, commit, dispatch }, payload = {}) {
    if (!payload.force && !state.status.saved) throw new Error('Unsaved file, use force=true to override')
    let article = null
    try {
      const defaultOpt = {
        title: '新文章'
      }
      article = await PostService.addArticle(Object.assign(defaultOpt, payload.options), payload.options.layout === 'page')
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, '新しい記事の作成に失敗しました．しばらくしてからもう一度お試しください', actionTypes.addArticleBase)
    }
    try {
      await dispatch(actionTypes.loadArticles)
      if (article.categories) await dispatch('loadCategories')
      if (article.tags) await dispatch('loadTags')
      commit(mutationTypes.loadArticle, article)
      commit(mutationTypes.setLoading, false)
      return article._id
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.LOAD_ERROR, '新しい記事は正常に作成されましたが，データの更新に失敗しました．手動で更新してください')
    }
  },

  /**
  * 载入所有数据
  */
  async [actionTypes.loadAll] ({ dispatch }) {
    try {
      await Promise.all([
        dispatch(actionTypes.loadArticles),
        dispatch(actionTypes.loadCategories),
        dispatch(actionTypes.loadTags)
      ])
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, 'データの読み込みに失敗しました', actionTypes.loadAll)
    }
  },

  /**
  * 载入文章列表
  */
  async [actionTypes.loadArticles] ({ commit }) {
    try {
      const articles = await PostService.getArticleList()

      // TODO:如果post和page的_id重复了就会报错
      commit(mutationTypes.loadArticles, listToObject(articles))
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, '記事リストを取得できませんでした．しばらくしてからもう一度お試しください', actionTypes.loadArticles)
    }
  },
  /**
  * 载入分类列表
  */
  async [actionTypes.loadCategories] ({ commit }) {
    try {
      const categories = await CategoryService.getCategories()
      commit(mutationTypes.loadCategories, listToObject(categories))
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, 'カテゴリの取得に失敗しました．しばらくしてからもう一度お試しください', actionTypes.loadCategories)
    }
  },

  /**
  * 载入标签列表
  */
  async [actionTypes.loadTags] ({ commit }) {
    try {
      const tags = await TagService.getTags()
      commit(mutationTypes.loadTags, listToObject(tags))
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, 'タグを取得できませんでした．しばらくしてからもう一度お試しください', actionTypes.loadTags)
    }
  },

  async [actionTypes.updateArticle] ({ commit }, article) {
    commit(mutationTypes.updateArticle, article)
  },

  /**
  * 保存文章
  */
  async [actionTypes.saveArticle] ({ state, dispatch, commit }) {
    try {
      const isPage = state.data.article.layout === 'page'
      const article = Object.assign({}, state.data.article)
      await PostService.saveArticle(article, isPage)
      commit(mutationTypes.saveArticle)
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, '保存に失敗しました．しばらくしてからもう一度お試しください', actionTypes.saveArticle)
    }
  },

  async [actionTypes.closeArticle] ({ commit }) {
    commit(mutationTypes.closeArticle)
  },

  /**
  * 从id载入文章
  * @param {Object} payload 参数
  * @param {String} payload._id 需要加载的文章id，默认未当前已打开文章
  * @param {Boolean} [payload.force] 是否强制载入，放弃当前数据从服务器载入新数据
  */
  async [actionTypes.loadArticleById] ({ state, commit }, payload = {}) {
    const _id = payload._id
    if (!_id) throw new HexoCoreError(HexoCoreError.ACTION_ERROR, '_id ,actionTypes.loadArticleByIdis required')
    const force = payload.force || false
    const validId = getValidId(state, _id, force)

    let isSameArticle
    if (state.data.article &&
      state.data.article._id === validId) {
      isSameArticle = true
    } else {
      isSameArticle = false
    }
    if (!force && isSameArticle) {
      logger.log('Use opened article', validId)
      return
    }
    checkSaved(state, force)
    try {
      const isPage = state.data.articles[validId].layout === 'page'
      const article = await PostService.getArticleById(validId, isPage)
      commit(mutationTypes.loadArticle, article)
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, '記事を取得できませんでした．後でもう一度試すか，更新してください', actionTypes.loadArticleById)
    } finally {
    }
  },

  /**
  * 从id删除文章
  * @param {Object} payload 参数
  * @param {String} [payload._id] 需要删除的文章id，默认未当前已打开文章
  * @param {Boolean} [payload.force] 是否放弃当前未保存的更改
  */
  async [actionTypes.deleteArticleById] ({ state, commit, dispatch }, payload = {}) {
    const _id = payload._id || null
    const force = payload.force || false
    const validId = getValidId(state, _id, force)
    checkSaved(state, force)
    try {
      const isPage = state.data.articles[validId].layout === 'page'
      await PostService.deleteArticleById(validId, isPage)
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, '削除に失敗しました．しばらくしてからもう一度お試しください', actionTypes.deleteArticleById)
    }
    try {
      await dispatch(actionTypes.loadAll)
      return validId
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.LOAD_ERROR, '記事は削除されましたが，データの更新に失敗しました．手動で更新してください')
    }
  },

  /**
  * 从id发布文章
  * @param {Object} payload 参数
  * @param {String} [payload._id] 需要发布的文章id，默认未当前已打开文章
  * @param {Boolean} [payload.force] 是否放弃当前未保存的更改
  */
  async [actionTypes.publishPostById] ({ state, commit, dispatch }, payload = {}) {
    const _id = payload._id || null
    const force = payload.force || false
    const validId = getValidId(state, _id, force)
    checkSaved(state, force)
    let post
    try {
      post = await HexoService.publishPost(validId)
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, '記事の公開に失敗しました．しばらくしてからもう一度お試しください', actionTypes.publishPostById)
    }
    try {
      await dispatch(actionTypes.loadArticles)
      return {
        oldId: validId,
        newId: post._id
      }
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.LOAD_ERROR, '記事は公開されましたが，データの更新に失敗しました．手動で更新してください')
    }
  },

  /**
  * 从id取消发布文章
  * @param {Object} payload 参数
  * @param {String} [payload._id] 需要取消发布的文章id，默认未当前已打开文章
  * @param {Boolean} [payload.force] 是否放弃当前未保存的更改
  */
  async [actionTypes.unpublishPostById] ({ state, commit, dispatch }, payload = {}) {
    const _id = payload._id || null
    const force = payload.force || false
    const validId = getValidId(state, _id, force)
    checkSaved(state, force)
    let post
    try {
      const needReloadArticle = state.data.article && validId === state.data.article._id
      post = await HexoService.unpublishPost(validId)
      if (needReloadArticle)commit(mutationTypes.loadArticle, post)
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, '非公開に失敗しました．しばらくしてからもう一度お試しください', actionTypes.unpublishPostById)
    }
    try {
      await dispatch(actionTypes.loadArticles)
      return {
        oldId: validId,
        newId: post._id
      }
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.LOAD_ERROR, '未公開ですが，データの更新に失敗しました．手動で更新してください')
    }
  },

  async [actionTypes.saveGit] () {
    let remote
    try {
      const res = await HexoService.saveGit()
      remote = res.remote
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, 'Gitへの保存に失敗しました．後でもう一度やり直してください', actionTypes.saveGit)
    }
    return { remote }
  },

  async [actionTypes.syncGit] ({ dispatch }) {
    let remote
    try {
      const res = await HexoService.syncGit()
      remote = res.remote
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, 'Gitからの同期に失敗しました．後でもう一度やり直してください', actionTypes.syncGit)
    }
    try {
      await dispatch(actionTypes.reload)
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.LOAD_ERROR, '同期は成功しましたが，データの更新に失敗しました．手動で更新してください')
    }
    return { remote }
  },

  async [actionTypes.deploy] () {
    try {
      await HexoService.deploy()
    } catch (err) {
      let message = '展開に失敗しました．しばらくしてからもう一度お試しください'
      if (err.code === HexoServiceError.HEXO_CANT_DEPLOY) {
        message = err.message
      }
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, message, actionTypes.deploy)
    }
  },

  async [actionTypes.generate] () {
    try {
      await HexoService.generate()
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, '生成に失敗しました．しばらくしてからもう一度お試しください', actionTypes.generate)
    }
  },

  async [actionTypes.clean] () {
    try {
      await HexoService.clean()
    } catch (err) {
      throw new HexoCoreError(HexoCoreError.ACTION_ERROR, 'クリーンアップに失敗しました．しばらくしてからもう一度お試しください', actionTypes.clean)
    }
  }

}
export default actions
