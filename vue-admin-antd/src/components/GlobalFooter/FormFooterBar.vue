<template>
  <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
    <span class="popover-wrapper">
      <a-popover
        title="表单校验信息"
        overlayClassName="antd-pro-pages-forms-style-errorPopover"
        trigger="click"
        :getPopupContainer="trigger => trigger.parentNode"
      >
        <template slot="content">
          <li
            v-for="item in formVerifyErrors"
            :key="item.key"
            @click="scrollToField(item.key)"
            class="antd-pro-pages-forms-style-errorListItem"
          >
            <a-icon type="cross-circle-o" class="antd-pro-pages-forms-style-errorIcon" />
            <div class>{{ item.message }}</div>
            <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
          </li>
        </template>
        <span class="antd-pro-pages-forms-style-errorIcon" v-if="formVerifyErrors.length > 0">
          <a-icon type="exclamation-circle" />
          {{ formVerifyErrors.length }}
        </span>
      </a-popover>
    </span>
    <!-- <slot></slot> -->
    <a-button type="primary" @click="handleFormSubmit">提交</a-button>
  </footer-tool-bar>
</template>

<script>
import { baseMixin } from "@/store/mixin/app-mixin";
import FooterToolBar from "../FooterToolBar";

export default {
  name: "FormFooterBar",
  mixins: [baseMixin],
  components: {
    FooterToolBar
  },
  props: {
    title: {
      type: String,
      default: "表单校验信息"
    },
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formVerifyErrors: []
    };
  },
  methods: {
    //表单提交事件
    handleFormSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (err) {
          this.getFormVerifyError(err);
          return false;
        }
        this.$emit("formSubmit", values);
      });
    },
    //得到表单验证错误
    getFormVerifyError(errs) {
      this.formVerifyErrors = Object.keys(errs)
        .filter(key => errs[key].errors && errs[key].errors.length > 0)
        .map(key => ({
          key: key,
          message: errs[key].errors[0].message,
          fieldLabel: errs[key].errors[0].field
        }));
    },
    //滚动到表单验证错误字段
    scrollToField(fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.popover-wrapper {
  /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
    min-width: 256px;
    max-height: 290px;
    padding: 0;
    overflow: auto;
  }
}
.antd-pro-pages-forms-style-errorIcon {
  user-select: none;
  margin-right: 24px;
  color: #f5222d;
  cursor: pointer;
  i {
    margin-right: 4px;
  }
}
.antd-pro-pages-forms-style-errorListItem {
  padding: 8px 16px;
  list-style: none;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
  }
  .antd-pro-pages-forms-style-errorIcon {
    float: left;
    margin-top: 4px;
    margin-right: 12px;
    padding-bottom: 22px;
    color: #f5222d;
  }
  .antd-pro-pages-forms-style-errorField {
    margin-top: 2px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
}
</style>
