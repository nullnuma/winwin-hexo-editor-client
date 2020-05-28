/*
export function someAction (context) {
}
*/

import stringRandom from 'string-random'
import { Logger } from 'src/utils/logger'
import * as hexoService from 'src/service/hexo'
import { replaceErrorMessage } from 'src/utils/common'
const logger = new Logger({ prefix: 'EditorCore/Actions' })

/**
 * 初始化数据
 */
export async function init ({ commit, dispatch }) {
  commit('closePost')
  await dispatch('loadAll')
}

/**
 * 销毁数据
 */
export async function destroy ({ commit }) {
  commit('closePost')
  commit('resetAll')
}

/**
 * 刷新数据
 * @param {Boolean} [force] 是否强制载入（暂时未启用）
 */
export async function reload ({ dispatch }, force) {
  await dispatch('loadAll')
}

/**
 * 从参数新建文章
 * @param {Object} payload 参数
 * @param {Boolean} [payload.force=false] 是否放弃当前未保存的更改
 * @param {Object} [payload.options={}] 新文章的选项
 */
export async function addPostBase ({ state, commit, dispatch }, payload = {}) {
  if (!payload.force && !state.status.saved) throw new Error('Unsaved file, use force=true to override')
  let post = null
  try {
    const defaultOpt = {
      title: '新文章',
      slug: stringRandom(16)
    }
    post = await hexoService.addPost(Object.assign(defaultOpt, payload.options))
  } catch (err) {
    throw replaceErrorMessage(err, '新建文章失败，请稍后再试')
  }
  try {
    await dispatch('loadPosts')
    if (post.categories) await dispatch('loadCategories')
    if (post.tags) await dispatch('loadTags')
    commit('loadPost', post)
    commit('markSaved')
  } catch (err) {
    throw replaceErrorMessage(err, '新文章创建成功，但数据更新失败，请手动刷新')
  }
}

/**
 * 从id载入文章
 * @param {Object} payload 参数
 * @param {String} [payload._id] 需要加载的文章id，默认未当前已打开文章
 * @param {Boolean} [payload.force] 是否放弃当前未保存的更改
 */
export async function loadPostById ({ state, commit }, payload = {}) {
  const _id = payload._id || null
  const force = payload.force || false
  if (!state.data.post && !_id) throw new Error('No post opened, _id is required!')
  const trueID = _id || state.data.post._id
  if (trueID && !state.data.posts[trueID]) throw new Error('Invalid post id ' + trueID)
  if (state.data.post && state.data.post._id === trueID) {
    logger.log('Same post', trueID)
    return
  }
  if (!state.status.saved && !force) throw new Error('Unsaved change, use force=true to override.')
  try {
    const post = await hexoService.getPostById(trueID)
    commit('loadPost', post)
  } catch (err) {
    throw replaceErrorMessage(err, '文章获取失败，请稍后再试')
  }
}

/**
 * 载入所有数据
 */
export async function loadAll ({ dispatch }) {
  await Promise.all([
    dispatch('loadPosts'),
    dispatch('loadCategories'),
    dispatch('loadTags')
  ])
}

/**
 * 载入文章列表
 */
export async function loadPosts ({ commit }) {
  try {
    const posts = await hexoService.getPosts()
    commit('loadPostsByList', posts)
  } catch (err) {
    throw replaceErrorMessage(err, '文章列表获取失败，请稍后再试')
  }
}

/**
 * 载入分类列表
 */
export async function loadCategories ({ commit }) {
  try {
    const categories = await hexoService.getCategories()
    commit('loadCategoriesByList', categories)
  } catch (err) {
    throw replaceErrorMessage(err, '分类获取失败，请稍后再试')
  }
}

/**
 * 载入标签列表
 */
export async function loadTags ({ commit }) {
  try {
    const tags = await hexoService.getTags()
    commit('loadTagsByList', tags)
  } catch (err) {
    throw replaceErrorMessage(err, '标签获取失败，请稍后再试')
  }
}

/**
 * 从id删除文章
 * @param {Object} payload 参数
 * @param {String} [payload._id] 需要删除的文章id，默认未当前已打开文章
 * @param {Boolean} [payload.force] 是否放弃当前未保存的更改
 */
export async function deletePostById ({ state, commit, dispatch }, payload = {}) {
  const _id = payload._id || null
  const force = payload.force || false
  if (!state.data.post && !_id) throw new Error('No post opened, _id is required!')
  const trueID = _id || state.data.post._id
  if (trueID && !state.data.posts[trueID]) throw new Error('Invalid post id ' + trueID)
  if (!state.status.saved && !force) throw new Error('Unsaved change, use force=true to override.')
  try {
    await hexoService.deletePostById(trueID)
  } catch (err) {
    throw replaceErrorMessage(err, '删除失败，请稍后再试')
  }
  try {
    if (!_id || (state.data.post && state.data.post._id === _id)) { commit('closePost') }
    await dispatch('loadAll')
  } catch (err) {
    throw replaceErrorMessage(err, '文章已删除，但数据更新失败，请手动刷新')
  }
}

export async function savePost ({ state, dispatch, commit }) {
  try {
    await hexoService.savePost(state.data.post)
    commit('savePost')
  } catch (err) {
    throw replaceErrorMessage(err, '保存失败，请稍后再试')
  }
  try {
    await dispatch('loadAll')
  } catch (err) {
    throw replaceErrorMessage(err, '文章已保存，但数据更新失败，请手动刷新')
  }
}

export async function publishPostById ({ state, commit, dispatch }, { _id, force }) {
  if (!state.data.post && !_id) throw new Error('No post opened, _id is required!')
  if (_id && !state.data.posts[_id]) throw new Error('Invalid post id ' + _id)
  if (state.data.post && state.data.post._id === _id) {
    logger.log('Same post', _id)
    return
  }
  if (!state.status.saved && !force) throw new Error('Unsaved change, use force=true to override.')
  try {
    const post = await hexoService.publishPost(_id || state.data.post._id)
    commit('loadPost', post)
  } catch (err) {
    throw replaceErrorMessage(err, '文章发布失败，请稍后再试')
  }
  try {
    await dispatch('loadPosts')
  } catch (err) {
    throw replaceErrorMessage(err, '文章已发布，但数据更新失败，请手动刷新')
  }
}

export async function unpublishPostById ({ state, commit, dispatch }, { _id, force }) {
  if (!state.data.post && !_id) throw new Error('No post opened, _id is required!')
  if (_id && !state.data.posts[_id]) throw new Error('Invalid post id ' + _id)
  if (state.data.post && state.data.post._id === _id) {
    logger.log('Same post', _id)
    return
  }
  if (!state.status.saved && !force) throw new Error('Unsaved change, use force=true to override.')
  try {
    const post = await hexoService.unpublishPost(_id || state.data.post._id)
    commit('loadPost', post)
  } catch (err) {
    throw replaceErrorMessage(err, '取消发布失败，请稍后再试')
  }
  try {
    await dispatch('loadPosts')
  } catch (err) {
    throw replaceErrorMessage(err, '已取消发布，但数据更新失败，请手动刷新')
  }
}

// TODO：需要测试
export async function saveGit () {
  try {
    await hexoService.saveGit()
  } catch (err) {
    throw replaceErrorMessage(err, '保存到git失败，请稍后再试')
  }
}

// TODO：需要测试
export async function syncGit ({ dispatch }) {
  try {
    await hexoService.syncGit()
  } catch (err) {
    throw replaceErrorMessage(err, '从git同步失败，请稍后再试')
  }
  try {
    await dispatch('init')
  } catch (err) {
    throw replaceErrorMessage(err, '同步成功，但数据更新失败，请手动刷新')
  }
}

// TODO：需要测试
export async function deploy () {
  try {
    await hexoService.deploy()
  } catch (err) {
    throw replaceErrorMessage(err, '部署失败，请稍后再试')
  }
}
