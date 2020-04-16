<template>
  <div class="login">
    <el-form
      :model="formTable"
      :rules="rules"
      ref="formTable"
      label-width="70px"
      class="container"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formTable.username" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="formTable.password"
          size="medium"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code" class="verify_form">
        <el-input type="text" v-model="formTable.code" size="medium">
        </el-input>
        <a href="#" @click="handleEditCaptcha">
          <img src="/api/user/getCaptcha" alt="验证码" ref="imgYzm" />
        </a>
      </el-form-item>
      <el-form-item class="btn_container">
        <el-button @click="$router.push('/register')" size="medium"
          >注册账号</el-button
        >
        <el-button type="primary" @click="handleLogin" size="medium"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Message } from "element-ui";

export default {
  name: "Login",
  props: {
    showSearchInput: Boolean
  },
  data() {
    return {
      formTable: {
        username: "",
        password: "",
        code: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入验证码" }]
      }
    };
  },
  created() {
    this.$emit("handleHideSearch", false);
  },
  methods: {
    handleLogin() {
      this.$axios
        .post("/api/user/login", this.formTable)
        .then(res => {
          if (res.data.code === 0) {
            localStorage.setItem("loginToken", res.data.token);
            // this.$store.dispatch("setUserInfo", res.data.user);
            localStorage.setItem("userInfo", JSON.stringify(res.data.user));
            this.$socket.emit("userLogin", res.data.user.id);
            this.$router.push("/");
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleEditCaptcha() {
      this.$refs.imgYzm.src = "/api/user/getCaptcha?d=" + Math.random();
    }
  }
};
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("http://imgku.smacricketcvm.com/images/2020/03/30/ChMlWlXC-ZGIN7nmAAeh8mp0IEQAAITtgKfdoQAB6IK892.jpg");
}

.container {
  background-color: rgba($color: #ffffff, $alpha: 0.5);
  width: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 1em;
  box-shadow: 0 0 3px 3px rgba($color: #ffffff, $alpha: 0.5);
}

.container .el-input {
  width: 80%;
}
.btn_container {
  margin-left: 40px;
}

.verify_form {
  .el-input {
    width: 50%;
  }
  img {
    vertical-align: middle;
  }
}
</style>
