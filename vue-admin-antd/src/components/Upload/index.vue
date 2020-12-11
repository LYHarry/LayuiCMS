<template>
  <div class="clearfix">
    <!-- 上传多个文件 -->
    <template v-if="multiple">
      <a-upload
        :multiple="true"
        :fileList="fileUrl"
        :beforeUpload="handleBeforeUpload"
        :customRequest="handleCustomFileUpload"
        :listType="listType"
        @preview="handlePreview"
        :remove="handleRemove"
      >
        <template v-if="maxnum < 1 || (maxnum > 0 && fileUrl.length < maxnum)">
          <div v-if="listType === 'picture-card'">
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">{{ this.showText }}</div>
          </div>
          <a-button v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />{{ this.showText }}
          </a-button>
        </template>
      </a-upload>
      <a-modal
        :visible="previewImage.Visible"
        @cancel="handleCancelPreview"
        :footer="null"
      >
        <img style="width: 100%" :src="previewImage.image" alt="example" />
      </a-modal>
    </template>

    <!-- 上传单个文件 -->
    <template v-else>
      <a-upload
        v-model="fileUrl"
        :showUploadList="false"
        :beforeUpload="handleBeforeUpload"
        @change="handleUploadChange"
        :action="handleAction"
        :listType="listType"
      >
        <img class="thumb" v-if="fileUrl" :src="fileUrl" alt="avatar" />
        <template v-else>
          <div v-if="listType === 'picture-card'">
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">{{ this.showText }}</div>
          </div>
          <a-button v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />{{ this.showText }}
          </a-button>
        </template>
      </a-upload>
    </template>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: "AntdFileUpload",
  props: {
    // 表单校验用字段
    value: [String, Array, Object],
    multiple: { type: Boolean, default: false },
    maxnum: { type: Number, default: -1 },
    listType: { type: String, default: "text" },
    //验证文件格式
    verifyFile: { type: Boolean, default: true },
    allowMaxSize: { type: Number, default: 0 },
    allowType: { type: Array },
    showText: { type: String, default: "Upload" },
    size: { type: Object },
  },
  data() {
    return {
      loading: false,
      fileUrl: null,
      propsObj: {},
      previewImage: { Visible: false, image: "" },
      isHint: null,
    };
  },
  model: { prop: "value", event: "change" },
  created() {
    this.initParam();
  },
  watch: {
    //监听父组件传递过来的文件信息
    value: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        if (!newVal) {
          this.fileUrl = null;
          return false;
        }
        //上传单个文件赋值
        if (!this.multiple) {
          if (typeof newVal !== "string") return false;
          if (this.fileUrl && this.fileUrl === newVal) return false;
          this.fileUrl = newVal;
          return false;
        }
        //上传多个文件
        if (!Array.isArray(newVal)) {
          if (typeof newVal !== "string") return false;
          newVal = newVal.split(",");
        }
        if (!Array.isArray(this.fileUrl)) this.fileUrl = [];
        newVal.forEach((item, index) => {
          if (typeof item !== "string") return true;
          const newFileUrl = this.fileUrl.find((x) => x.url === item);
          if (newFileUrl) return true;
          let splitUrl = item.split("/");
          this.fileUrl.push({
            uid: splitUrl[splitUrl.length - 1],
            url: item,
            name: `${splitUrl[splitUrl.length - 1]}.jpg`,
            status: "done",
            type: "image/jpeg",
            size: item.length + index,
          });
        });
      },
    },

    //监听数据变化，及时提交给父组件
    fileUrl: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        if (!newVal) return false;
        //避免页面加载就启动表单验证
        if (this.multiple && this.fileUrl.length < 1) return false;
        if (Array.isArray(newVal) && newVal.length < 1) {
          newVal = null;
        }
        this.$emit("change", newVal);
      },
    },
  },
  methods: {
    //初始化参数
    initParam() {
      if (!this.$Conf.fileUploadUrl) {
        throw new Error("请先配置文件上传接口地址");
      }
      this.propsObj = {
        allowMaxSize: this.allowMaxSize || this.$Conf.uploadFileMaxSize || 0,
        allowType: this.allowType || this.$Conf.uploadFileType || [],
        verifyFile: this.verifyFile || true,
      };
      if (
        this.propsObj.verifyFile &&
        this.propsObj.allowMaxSize === 0 &&
        this.propsObj.allowType.length < 1
      ) {
        this.propsObj.verifyFile = false;
      }
      if (this.multiple && !Array.isArray(this.fileUrl)) this.fileUrl = [];
    },

    //#region 验证文件

    //文件上传前事件
    handleBeforeUpload(file, fileList) {
      return new Promise((resolve, reject) => {
        //验证上传文件
        const err = this.handleVerifyFile(file);
        if (err) {
          this.$message.error(err);
          return reject(false);
        }
        // 验证图片的宽度
        return this.checkImageWH(file)
          .then((res) => {
            if (res) {
              this.$message.error(res);
              return reject(false);
            }
            return resolve(true);
          })
          .catch((e) => {
            this.$message.error(e + "");
            return reject(false);
          });
      });
    },
    //验证上传文件
    handleVerifyFile(file) {
      // 不需要验证上传的文件
      if (!this.propsObj.verifyFile) return null;
      if (file.status) {
        if (file.status === "error") {
          if (this.loading) this.loading = false;
          return `${file.name}上传失败`;
        }
        if (file.status !== "uploading") return null;
      }
      // 验证上传文件大小
      if (file.size > this.propsObj.allowMaxSize) {
        const size = this.propsObj.allowMaxSize / 1024 / 1024;
        return `请上传${size}MB大小以内的文件`;
      }
      // 验证上传文件类型
      if (!this.propsObj.allowType.includes(file.type)) {
        return "暂不支持该类型文件";
      }
      return null;
    },
    //验证图片宽高
    checkImageWH(file) {
      return new Promise((resolve, reject) => {
        if (file.type.indexOf("image") === -1) {
          return resolve(null);
        }
        const _self = this;
        let filereader = new FileReader();
        filereader.onload = (e) => {
          const image = new Image();
          image.onload = function () {
            if (!_self.size) {
              return resolve(null);
            }
            if (_self.size.width && this.width > _self.size.width) {
              return reject(`请上传宽为${_self.size.width}的图片`);
            }
            if (_self.size.height && this.height > _self.size.height) {
              return reject(`请上传高为${_self.size.height}的图片`);
            }
            return resolve(null);
          };
          image.onerror = reject;
          image.src = e.target.result;
        };
        filereader.readAsDataURL(file);
      });
    },

    //#endregion

    //#region 上传多个文件

    //自定义文件上传事件
    handleCustomFileUpload(info) {
      //调用父类改变事件
      this.$emit("uploadChange", { file: info.file, fileList: this.fileUrl });

      //判断是否超过充许上传的文件数量
      if (this.maxnum > 0 && this.fileUrl.length >= this.maxnum) {
        if (!this.isHint) {
          this.$message.error(`最多充许上传${this.maxnum}个文件`);
          this.isHint = true;
        }
        return false;
      }
      const thisFile = {
        uid: info.file.uid,
        name: info.file.name,
        status: "uploading",
        type: info.file.type,
        size: info.file.size,
      };
      this.showUploadMultipleFile(thisFile);
      try {
        const formData = new FormData();
        formData.append(info.filename, info.file);
        axios
          .request({
            url: this.$Conf.fileUploadUrl,
            method: "POST",
            processData: false,
            data: formData,
          })
          .then((res) => {
            thisFile.status = "error";
            if (res.serveStatus === 200 && res.status === 1) {
              thisFile.status = "done";
              thisFile.url = res.data;
            }
            this.showUploadMultipleFile(thisFile);
          })
          .catch((e) => {
            thisFile.status = "error";
            this.showUploadMultipleFile(thisFile);
          });
      } catch (error) {
        thisFile.status = "error";
        this.showUploadMultipleFile(thisFile);
      }
    },
    //显示上传多个文件
    showUploadMultipleFile(file) {
      if (file.status === "error") {
        if (file.url) file.url = undefined;
        this.$message.error(`${file.name}上传失败`);
      }
      const fileList = this.fileUrl || [];
      const existFile = fileList.find((x) => x.uid === file.uid);
      if (!existFile) {
        fileList.push(file);
      } else {
        const index = fileList.findIndex((x) => x.uid === file.uid);
        if (file.status === "removed") {
          fileList.splice(index, 1);
        } else {
          existFile.status = file.status;
          fileList.splice(index, 1, existFile);
        }
      }
      this.fileUrl = fileList;
    },
    handlePreview(file) {
      this.previewImage = { image: file.url, Visible: true };
    },
    handleCancelPreview() {
      this.previewImage = { image: "", Visible: false };
    },
    //移除已上传文件
    handleRemove(file) {
      file.status = "removed";
      this.showUploadMultipleFile(file);
    },

    //#endregion

    //#region 上传单个文件

    //得到接口上传地址
    handleAction(file) {
      if (!this.$Conf.fileUploadUrl) {
        throw new Error("请先配置文件上传接口地址");
      }
      return envConfig.BASE_URL + this.$Conf.fileUploadUrl;
    },
    //文件上传改变事件
    handleUploadChange(info) {
      //调用父类改变事件
      this.$emit("uploadChange", info);

      //文件上传错误
      if (info.file.status === "error") {
        let hint = `${info.file.name}上传失败`;
        if (info.file.response && info.file.response.uiMsg) {
          hint += `, ${info.file.response.uiMsg}`;
        }
        this.$message.error(hint);
        if (this.loading) this.loading = false;
        return false;
      }
      if (info.file.status === "uploading") {
        this.loading = true;
      }
      if (info.file.status === "done") {
        const resp = info.file.response || {};
        if (resp.serveStatus === 200 && resp.status === 1) {
          this.fileUrl = resp.data;
        }
        this.loading = false;
      }
    },

    //#endregion
  },
};
</script>

<style lang="less" scoped>
.clearfix {
  display: -webkit-flex;
  display: flex;
  flex: auto;
}

.thumb {
  width: 104px;
  height: 104px;
}

/deep/ .ant-modal-close-x {
  color: red;
  line-height: 26px;
  width: 35px;
  height: initial;
}

/deep/ .ant-upload.ant-upload-select-picture-card {
  margin-bottom: 0;
}

/deep/ .ant-form-item-control {
  line-height: 0;
}
</style>
