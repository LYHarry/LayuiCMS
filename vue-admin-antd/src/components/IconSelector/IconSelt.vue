<template>
  <div class="iconlibrary-wrap">
    <a-button icon="search" title="图标库" @click="showIconModal" />
    <a-modal
      width="620px"
      :visible="this.showModal"
      @cancel="handleCancelModal"
      :footer="null"
    >
      <template slot="title">
        <span><a-icon type="appstore" /> 选择图标</span>
        <a-input
          allowClear
          class="icon-serach"
          placeholder="请输入图标名称"
          @change="handleSearchChange"
        />
      </template>
      <ul class="anticons-list">
        <li
          v-for="(icon, index) in serarchedIcons"
          :key="`${icon}_${index}`"
          @click="handleSelectedIcon(icon)"
        >
          <a-icon :type="icon" :title="icon" />
        </li>
      </ul>
    </a-modal>
  </div>
</template>

<script>
import icons from "./icons";

export default {
  name: "IconSelectList",
  props: {
    value: {
      type: String,
    },
  },
  data() {
    return {
      showModal: false,
      allIcons: [],
      seltIcon: null,
      serarchedIcons: [],
    };
  },
  model: { prop: "value", event: "change" },
  watch: {
    //监听数据变化，及时提交给父组件
    seltIcon: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        if (!newVal && !oldVal) return false;
        this.$emit("change", newVal);
      },
    },
  },
  created() {
    const allIcons = [];
    icons.forEach((item) => allIcons.push(...item.icons));
    this.serarchedIcons = this.allIcons = allIcons;
  },
  methods: {
    showIconModal() {
      this.showModal = true;
    },
    handleCancelModal() {
      this.showModal = false;
    },
    handleSelectedIcon(icon) {
      this.seltIcon = icon;
      this.handleCancelModal();
    },
    handleSearchChange(e) {
      this.serarchedIcons = this.allIcons.filter(
        (x) => x.indexOf(e.target.value) > -1
      );
    },
  },
};
</script>

<style lang="less" scoped>
.iconlibrary-wrap {
  clear: both;
  margin-right: -12px;
}
.anticons-list {
  height: 480px;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0;
  padding: 0;

  li {
    margin: 5px;
    display: inline-block;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 36px;
    background-color: #e1e1e1;
    border-radius: 5px;
    cursor: pointer;
  }
  li:hover {
    background-color: #1890ff;
    color: #fff;
    transform: scale(1.2);
    -webkit-transform: scale(1.2);
  }
}

.icon-serach {
  width: 200px;
  float: right;
  margin-right: 50px;
}

/deep/ .ant-modal-body {
  padding: 0;
}
</style>
