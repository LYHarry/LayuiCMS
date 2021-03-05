<template>
  <Form
    ref="loginForm"
    :model="formInfo"
    :rules="formRules"
    @keydown.enter.native="handleSubmit"
  >
    <FormItem prop="userName">
      <Input v-model="formInfo.userName" placeholder="请输入用户名">
        <Icon :size="16" type="ios-person" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input
        type="password"
        v-model="formInfo.password"
        placeholder="请输入密码"
      >
        <Icon :size="14" type="md-lock" slot="prepend"></Icon>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>

<script>
export default {
  name: "LoginForm",
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "账号不能为空", trigger: "blur" }];
      },
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "密码不能为空", trigger: "blur" }];
      },
    },
  },
  data() {
    return {
      formInfo: {
        userName: "super",
        password: undefined,
      },
    };
  },
  computed: {
    formRules() {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
      };
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        //TODO 表单验证未生效
        if (valid) {
          this.$emit("on-success-valid", {
            userName: this.formInfo.userName,
            password: this.formInfo.password,
          });
        }
      });
    },
  },
};
</script>
