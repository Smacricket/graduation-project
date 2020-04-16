<template>
  <div class="pwd">
    <Title :title="title" />
    <el-form
      :model="formTable"
      :rules="rules"
      ref="formTable"
      label-width="100px"
      class="container"
    >
      <el-form-item label="原密码" prop="initPassword">
        <el-input
          type="text"
          v-model="formTable.initPassword"
          size="medium"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input :type="pwdType" v-model="formTable.password" size="medium">
          <i slot="suffix" class="el-icon-view" @click="handleShowPwd"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="formTable.checkPass"
          size="medium"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formTable')" size="small"
          >提交</el-button
        >
        <el-button @click="resetForm('formTable')" size="small">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from "element-ui";
import {
  validatePass,
  strongRegex,
  mediumRegex,
  enoughRegex
} from "@/util/reg.js";
import Title from "@/components/Title.vue";

export default {
  name: "ChangePwd",
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value !== this.formTable.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      title: "修改密码",
      flag: "",
      pwdType: "password",
      user: JSON.parse(localStorage.getItem("userInfo")),
      formTable: {
        initPassword: "",
        password: "",
        checkPass: ""
      },
      rules: {
        initPassword: [{ required: true, message: "请输入原始密码" }],
        password: [
          { required: true, message: "请输入密码" },
          { validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, message: "请再次输入密码" },
          { validator: validatePass2, trigger: "blur" }
        ]
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
            .post("/api/user/update_pass", {
              id: this.user.id,
              newPassword: this.formTable.password,
              initPassword: this.formTable.initPassword
            })
            .then(res => {
              if (res.data.code === 0) {
                localStorage.removeItem("userINfo");
                Message.success("请重新登录");
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
    }
  },
  components: {
    Title
  }
};
</script>

<style scoped lang="scss">
.container {
  width: 300px;
  margin: 1em auto;
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

.strong {
  color: red;
}
.medium {
  color: green;
}
.enough {
  color: blue;
}
</style>
