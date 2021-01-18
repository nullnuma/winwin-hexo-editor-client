<template>
  <q-menu v-model="open" touch-position context-menu transition-hide="none" transition-show="none">
    <q-list
      dense
      style="width:210px;user-select:none"
    >
      <context-menu-item name="保存" :keybind="getKey('Ctrl + S','⌘S')" @on-click="bus.$emit(EditorActionType.WINWIN_SAVE)"/>
      <q-separator inset/>
      <context-menu-item name="カット" :keybind="getKey('Ctrl + X','⌘X')" @on-click="bus.$emit(EditorActionType.EDITOR_ACTION_CLIPBOARDCUTACTION)"/>
      <context-menu-item name="コピー" :keybind="getKey('Ctrl + C','⌘C')" @on-click="bus.$emit(EditorActionType.EDITOR_ACTION_CLIPBOARDCOPYACTION)"/>
      <q-separator inset/>
      <context-menu-item name="段落レベル上げ" :keybind="getKey('Win + Shift + ]','⌃⇧]')" @on-click="bus.$emit(EditorActionType.MARKDOWN_EXTENSION_EDITING_TOGGLEHEADINGUP)"/>
      <context-menu-item name="段落レベル下げ" :keybind="getKey('Win + Shift + [','⌃⇧[')" @on-click="bus.$emit(EditorActionType.MARKDOWN_EXTENSION_EDITING_TOGGLEHEADINGDOWN)"/>
      <q-separator inset/>
      <context-menu-item name="太字" :keybind="getKey('Ctrl + B','⌘B')" @on-click="bus.$emit(EditorActionType.MARKDOWN_EXTENSION_EDITING_TOGGLEBOLD)"/>
      <context-menu-item name="斜体" :keybind="getKey('Ctrl + I','⌘I')" @on-click="bus.$emit(EditorActionType.MARKDOWN_EXTENSION_EDITING_TOGGLEITALIC)"/>
      <context-menu-item name="打消し線" :keybind="getKey('Alt + S','⌥S')" @on-click="bus.$emit(EditorActionType.MARKDOWN_EXTENSION_EDITING_TOGGLESTRIKETHROUGH)"/>
      <context-menu-item name="リスト" :keybind="getKey('Ctrl + L','⌘L')" @on-click="bus.$emit(EditorActionType.MARKDOWN_EXTENSION_EDITING_TOGGLELIST)"/>
      <q-separator inset/>
      <context-menu-item name="インラインコード" :keybind="getKey('Ctrl + `','⌘`')" @on-click="bus.$emit(EditorActionType.MARKDOWN_EXTENSION_EDITING_TOGGLECODESPAN)"/>
      <context-menu-item name="インライン式" :keybind="getKey('Ctrl + M','⌘M')" @on-click="bus.$emit(EditorActionType.MARKDOWN_EXTENSION_EDITING_TOGGLEMATH)"/>
    </q-list>
  </q-menu>
</template>
<script>
import ContextMenuItem from './ContextMenuItem'
import { EditorActionType } from '../MonacoEditor/utils'
export default {
  name: 'ActionSidebarHelper',
  components: {
    ContextMenuItem
  },
  props: ['bus', 'value'],
  data () {
    return {
      EditorActionType,
      open: this.value
    }
  },
  watch: {
    value (v) {
      this.open = v
    },
    open (v) {
      this.$emit('input', v)
    }
  },
  methods: {
    getKey (win, mac) {
      return this.$q.platform.is.mac ? mac : win
    }
  }
}
</script>
