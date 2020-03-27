import { hexoEditorCore } from './editorStore'
import { Dialog } from 'quasar'

// TODO 添加dispatcher，避免代码分散
export const editorUiStore = {
  state: {
    post: 'unselect',
    preview: false,
    full: false,
    get unselect () {
      return this.post === 'unselect'
    },
    get editing () {
      return this.post === 'editing'
    },
    get viewing () {
      return this.post === 'viewing' || this.preview
    }
  },
  init () {
    this.state.post = 'unselect'
    this.full = false
  },
  destory () {
    this.state.post = 'unselect'
    this.full = false
  },
  editPost () {
    if (process.env.DEV)console.log('set editor ui post editing')
    this.state.post = 'editing'
    this.state.preview = true
  },
  viewPost () {
    if (process.env.DEV)console.log('set editor ui post viewing')
    this.state.post = 'viewing'
  },
  closePost () {
    if (process.env.DEV)console.log('set editor ui post unselect')
    this.state.post = 'unselect'
    this.state.preview = false
  },
  deletePost (_id) {
    if (!_id) this.closePost()
    if (hexoEditorCore.state.post && hexoEditorCore.state.post._id === _id) { this.closePost() }
  },
  toggleFull (full) {
    if (typeof full === 'undefined') this.state.full = !this.state.full
    else this.state.full = !!full
  },
  togglePreview (preview) {
    if (typeof preview === 'undefined') this.state.preview = !this.state.preview
    else this.state.preview = !!preview
  },
  confirm (title, message, okLabel, okColor, cancelLabel, cancelColor, focus = 'ok', onOk, onCancel, onDismiss) {
    if (!message) throw new Error('message is required')
    return new Promise(resolve => {
      Dialog.create({
        title: title || '确认',
        message: message,
        ok: {
          label: okLabel || '确定',
          color: okColor || 'primary',
          flat: true
        },
        cancel: {
          label: cancelLabel || '返回',
          color: cancelColor || 'grey',
          flat: true
        },
        focus
      }).onOk(async () => {
        if (onOk) { onOk(resolve) } else resolve()
      }).onCancel(() => {
        if (onCancel) { onCancel(resolve) } else resolve()
      }).onDismiss(() => {
        if (onDismiss) { onDismiss(resolve) } else resolve()
      })
    })
  }
}
