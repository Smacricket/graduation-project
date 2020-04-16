<template>
  <div class="register">
    <el-form
      :model="formTable"
      :rules="rules"
      ref="formTable"
      label-width="100px"
      class="container"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formTable.username" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input :type="pwdType" v-model="formTable.password" size="medium">
          <i slot="suffix" class="el-icon-view" @click="handleShowPwd"></i>
        </el-input>
        <span
          :class="{
            strong: flag == '强',
            medium: flag == '中',
            enough: flag == '弱'
          }"
          style="margin-left:10px;"
          >{{ flag }}</span
        >
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="formTable.checkPass"
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
        <el-button type="primary" @click="submitForm('formTable')" size="small"
          >注册</el-button
        >
        <el-button @click="resetForm('formTable')" size="small">重置</el-button>
      </el-form-item>
      <p @click="$router.push('/login')">
        <span>已有账号，直接登录<i class="el-icon-d-arrow-right"></i></span>
      </p>
    </el-form>
  </div>
</template>
<script>
import { Message } from "element-ui";
import {
  validateName,
  validatePass,
  strongRegex,
  mediumRegex,
  enoughRegex
} from "@/util/reg.js";

export default {
  name: "Register",
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value !== this.formTable.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      flag: "",
      pwdType: "password",
      formTable: {
        username: "",
        password: "",
        checkPass: "",
        code: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名" },
          { validator: validateName, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码" },
          { validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, message: "请再次输入密码" },
          { validator: validatePass2, trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入验证码" }]
      }
    };
  },
  computed: {
    password() {
      return this.formTable.password;
    }
  },
  watch: {
    password(newVal) {
      if (strongRegex.test(newVal)) {
        this.flag = "强";
        return;
      }
      if (mediumRegex.test(newVal)) {
        this.flag = "中";
      } else {
        if (enoughRegex.test(newVal)) {
          this.flag = "弱";
        }
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/user/register", this.formTable)
            .then(res => {
              if (res.data.code === 0) {
                this.$router.push("/login");
                return;
              }
              Message.error(res.data.msg);
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          Message.error("请确认是否正确输入");
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleShowPwd() {
      this.pwdType === "password"
        ? (this.pwdType = "")
        : (this.pwdType = "password");
      let e = document.getElementsByClassName("el-icon-view")[0];
      this.pwdType == ""
        ? e.setAttribute("style", "color: #409EFF")
        : e.setAttribute("style", "color: #c0c4cc");
    },
    handleEditCaptcha() {
      this.$refs.imgYzm.src = "/api/user/getCaptcha?d=" + Math.random();
    }
  }
};
</script>

<style scoped lang="scss">
.register {
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
  p {
    float: right;
    color: rgb(0, 162, 255);
    font-size: 12px;
    margin-top: -20px;
    &:hover {
      color: rgb(0, 68, 255);
    }
  }
}
.container .el-input {
  width: 80%;
}
.el-form-item:last-child {
  padding-left: 1em;
}
.el-form-item {
  margin-bottom: 30px;
}
.btn_container {
  margin-left: 40px;
}

.strong {
  color: red;
}
.medium {
  color: green;
}
.enough {
  color: blue;
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
