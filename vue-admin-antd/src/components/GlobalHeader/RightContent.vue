<template>
  <div :class="wrpCls">
    <avatar-dropdown
      :menu="showMenu"
      :current-user="currentUser"
      :class="prefixCls"
    />
    <select-lang :class="prefixCls" />
  </div>
</template>

<script>
import AvatarDropdown from "./AvatarDropdown";
import SelectLang from "../SelectLang";

export default {
  name: "RightContent",
  components: {
    AvatarDropdown,
    SelectLang,
  },
  props: {
    prefixCls: {
      type: String,
      default: "ant-pro-global-header-index-action",
    },
    isMobile: {
      type: Boolean,
      default: () => false,
    },
    topMenu: {
      type: Boolean,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showMenu: true,
      currentUser: {},
    };
  },
  computed: {
    wrpCls() {
      return {
        "ant-pro-global-header-index-right": true,
        [`ant-pro-global-header-index-${
          (this.topMenu && this.isMobile && this.theme) || "light"
        }`]: true,
      };
    },
  },
  mounted() {
    setTimeout(() => {
      const curUser = this.$store.getters.userInfo || {};
      this.currentUser = {
        name: curUser.userName || "Serati Ma",
        avatar:
          curUser.headPhoto ||
          "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
      };
    }, 1500);
  },
};
</script>
