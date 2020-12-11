<template>
  <div class="tinymce-editor">
    <editor v-model="content" :init="editorOption"></editor>
  </div>
</template>
 
<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import tinymceConfig from "./tinymce-config";
//编辑器主题
import "tinymce/themes/silver/theme";

export default {
  name: "TinyMCEEditor",
  components: { Editor },
  props: {
    value: {
      type: String,
    },
  },
  model: { prop: "value", event: "change" },
  data() {
    return {
      content: null,
      editorOption: tinymceConfig,
    };
  },
  mounted() {
    tinymce.init({});
  },
  watch: {
    value(newVal) {
      this.content = newVal;
    },
    content(newVal) {
      this.$emit("change", newVal);
    },
  },
  methods: {
    //自定义事件，清空内容
    clear() {
      this.content = null;
    },
  },
};
</script>

<style scoped>
</style>