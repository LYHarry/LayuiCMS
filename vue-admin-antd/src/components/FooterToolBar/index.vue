<template>
  <div :class="prefixCls" :style="{ width: barWidth, transition: '0.3s all' }">
    <div style="float: left">
      <slot name="extra">{{ extra }}</slot>
    </div>
    <div style="float: right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterToolBar",
  props: {
    prefixCls: {
      type: String,
      default: "ant-pro-footer-toolbar"
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    siderWidth: {
      type: Number,
      default: undefined
    },
    extra: {
      type: [String, Object],
      default: ""
    }
  },
  computed: {
    barWidth() {
      return this.isMobile
        ? undefined
        : `calc(100% - ${this.collapsed ? 80 : this.siderWidth || 256}px)`;
    }
  }
};
</script>

<style lang="less">
@import "../index";

@footer-toolbar-prefix-cls: ~"@{ant-pro-prefix}-footer-toolbar";

.@{footer-toolbar-prefix-cls} {
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
  height: 56px;
  line-height: 56px;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.03);
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 0 24px;
  z-index: 9;

  &:after {
    content: "";
    display: block;
    clear: both;
  }
}
</style>
