<template>
  <div class="me">
    <div class="top">
      <el-image :src="a_url"></el-image>
      <div class="top_info">
        <div class="top_right">
          <p>{{ user.u_name }}</p>
          <p>
            <span @click="dialogFormVisible = true"
              >修改个人信息<i class="el-icon-arrow-right"></i
            ></span>
          </p>
        </div>
      </div>
      <div class="top_left">
        <p>
          *绑定手机：<span v-if="user.phone">{{
            user.phone.substr(0, 3) + "****" + user.phone.substr(9)
          }}</span>
          <span v-else>未绑定</span>
        </p>
        <p>
          *绑定邮箱：<span v-if="user.email">{{ user.email }}</span>
          <span v-else>未绑定</span>
        </p>
      </div>
    </div>
    <CutLine />
    <div class="bottom">
      <div class="left">
        <el-image :src="p_url"></el-image>
        <div class="info">
          <p>
            待支付的订单：<span>{{ unpaidOrder.length }}</span>
          </p>
          <p @click="$route.push('/my_order')">
            查看待支付订单<i class="el-icon-arrow-right"></i>
          </p>
        </div>
      </div>
      <div class="right">
        <el-image :src="c_url"></el-image>
        <div class="info">
          <p>
            待评价商品数：<span>{{ unCommentGoods.length }}</span>
          </p>
          <p @click="$route.push('/comment')">
            查看待评价商品<i class="el-icon-arrow-right"></i>
          </p>
        </div>
      </div>
    </div>

    <!-- 修改个人信息 -->
    <el-dialog title="修改个人信息" :visible.sync="dialogFormVisible">
      <el-form :model="user" :rules="rules" ref="userInfo">
        <el-form-item prop="u_name" label="账号名">
          <el-input v-model="user.u_name"></el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="user.sex" @change="handleChangeSex">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="phone" label="绑定电话">
          <el-input v-model="user.phone"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="绑定邮箱">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('userInfo')">取 消</el-button>
        <el-button type="primary" @click="handleUpdateOwnInfo('userInfo')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CutLine from "@/components/CutLine.vue";
import { Message } from "element-ui";
import { validateName, validatePhone, validateEMail } from "@/util/reg.js";

export default {
  name: "Me",
  data() {
    return {
      unpaidOrder: [],
      unCommentGoods: [],
      user: JSON.parse(localStorage.getItem("userInfo")),
      dialogFormVisible: false,
      a_url: "http://imgku.smacricketcvm.com/images/2020/03/23/avatar.jpg",
      p_url:
        "http://imgku.smacricketcvm.com/images/2020/03/23/portal-icon-1.png",
      c_url:
        "http://imgku.smacricketcvm.com/images/2020/03/23/portal-icon-3.png",
      rules: {
        u_name: [
          { required: true, message: "请输入账号名", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入绑定电话" },
          { validator: validatePhone, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入绑定邮箱", trigger: "blur" },
          { validator: validateEMail, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.handleGetUnpaidOrders();
    this.handleGetUnCommentGoods();
  },
  methods: {
    handleGetUnpaidOrders() {
      this.$axios
        .post("/api/order/getUserNotPayOrder", { u_id: this.user.id })
        .then(res => {
          if (res.data.code === 0) {
            this.unpaidOrder = res.data.unpaidOrder;
            return;
          }
          this.unpaidOrder = [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetUnCommentGoods() {
      this.$axios
        .post("/api/user/getUnComment", { u_id: this.user.id })
        .then(res => {
          if (res.data.code === 0) {
            this.unCommentGoods = res.data.goods;
            return;
          }
          this.unCommentGoods = [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleChangeSex(val) {
      this.user.sex = val;
    },
    handleUpdateOwnInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/user/update", this.user)
            .then(res => {
              if (res.data.code === 0) {
                localStorage.setItem("userInfo", JSON.stringify(this.user));
                Message.success("修改成功");
                this.dialogFormVisible = false;
                return;
              }
              Message.error("修改失败");
              this.dialogFormVisible = false;
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
      this.dialogFormVisible = false;
    }
  },
  components: {
    CutLine
  }
};
</script>

<style scoped lang="scss">
.me {
  color: #757575;
}
.top {
  display: flex;
  align-items: center;
  margin: 2em 2em;
  .el-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 1em;
  }
}
.top_info {
  display: flex;
}
.top_right p {
  margin: 1em 0;
}
.top_right :first-child {
  font-size: 24px;
}
.top_right :last-child {
  font-size: 14px;
  color: #ff6700;
  &:hover {
    color: #ff3c00;
  }
}
.top_left {
  font-size: 14px;
  margin: auto;
  p {
    margin: 1em 0;
  }
}

.bottom {
  display: flex;
  align-items: center;
  margin: 2em 2em;
}
.left,
.right {
  display: flex;
  align-items: center;
  .el-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 1em;
  }
  .info :first-child {
    font-size: 18px;
    span {
      color: #ff6700;
    }
  }
  .info :last-child {
    font-size: 14px;
    margin-top: 5px;
  }
}
.right {
  margin-left: 5em;
}
</style>
