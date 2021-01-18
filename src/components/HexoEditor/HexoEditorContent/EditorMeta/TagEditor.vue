<template>
  <div>
    <q-item
      clickable
      dense
      style="padding-top:5px;padding-bottom:5px"
    >
      <q-item-section avatar>
        ラベル
      </q-item-section>
      <q-item-section>
        <q-item-label>
          {{tags&&tags.length?'':'なし'}}
          <q-badge
            v-for="(item,key) in tags"
            :key="key"
            color="primary"
            text-color="white"
            class="q-mr-xs"
            :label="item"
          />
        </q-item-label>
      </q-item-section>
      <q-menu fit>
        <tag-selector
          @on-update="e=>$emit('on-update',e)"
          :tags="tags"
        ></tag-selector>
      </q-menu>
    </q-item>
  </div>
</template>
<script>
import TagSelector from './TagSelector'
export default {
  name: 'TagEditor',
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  components: {
    TagSelector
  },
  data () {
    return {
      showTagsMenu: false
    }
  }
}
</script>
