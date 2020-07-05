<template>
  <div v-if="visible" class="global-search global-search-wrapper">
    <div class="global-search-box">
      <Select
        size="large"
        showSearch
        placeholder="Input search text.."
        :style="{ width: '100%' }"
        :defaultActiveFirstOption="false"
        :showArrow="false"
        :filterOption="false"
        :onSearch="handleSearch"
        :onchange="handleChange"
        :notFoundContent="null"
      ></Select>
      <div class="global-search-tips">Open with Ctrl/⌘ + K</div>
    </div>
  </div>
</template>

<script>
import { Select } from "ant-design-vue";

export default {
  name: "GlobalSearch",
  data() {
    return {
      visible: false
    };
  },
  mounted() {
    document.addEventListener("keydown", this.keyboardHandle);
  },
  methods: {
    handleSearch(e) {
      this.$emit("search", e);
    },
    handleChange(e) {
      this.$emit("change", e);
    },
    keyboardHandle(e) {
      e.preventDefault();
      e.stopPropagation();
      const { ctrlKey, shiftKey, altKey, keyCode } = e;
      if (keyCode === 75 && ctrlKey && !shiftKey && !altKey) {
        this.visible = !this.visible;
      }
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>