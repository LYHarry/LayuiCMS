<template>
  <div :class="prefixCls">
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
    ></quill-editor>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { Quill, quillEditor } from "vue-quill-editor";
import quillConfig from "./quill-config";
import { addQuillTitle } from "./quill-title";

// extend plugins
import ImageResize from "quill-image-resize-module"; //缩放
import { ImageDrop } from "quill-image-drop-module"; //拖动
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);

export default {
  name: "myQuillEditor",
  components: { quillEditor },
  props: {
    prefixCls: {
      type: String,
      default: "ant-editor-quill",
    },
    // 表单校验用字段
    value: {
      type: String,
    },
  },
  data() {
    return {
      content: null,
      editorOption: quillConfig,
    };
  },
  mounted() {
    addQuillTitle(); // 添加工具栏提示
    this.$refs.myQuillEditor.quill.focus();
  },
  watch: {
    value(val) {
      this.content = val;
    },
  },
  methods: {
    // 准备富文本编辑器
    onEditorReady(quill) {
      // console.log("editor ready!", quill);
    },
    // 失去焦点事件
    onEditorBlur(quill) {
      // console.log("editor blur!", quill);
    },
    // 获得焦点事件
    onEditorFocus(quill) {
      // console.log("editor focus!", quill);
    },
    // 内容改变事件
    onEditorChange({ quill, html, text }) {
      // console.log("editor change!", quill, html, text);
      this.$emit("change", html);
    },
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("../../index.less");

/* 覆盖 quill 默认边框, ant 默认圆角，用于统一 ant 组件风格 */
.ant-editor-quill {
  /deep/ .ql-toolbar.ql-snow {
    border-radius: @border-radius-base @border-radius-base 0 0;
  }
  /deep/ .ql-container.ql-snow {
    border-radius: 0 0 @border-radius-base @border-radius-base;
  }
  /deep/ .ql-container .ql-editor {
    min-height: 400px;
  }
}
</style>
