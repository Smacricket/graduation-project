<template>
  <div class="header">
    <ul class="header_navbar">
      <li class="nav_title" @click="handleGoHome"><span>淘淘购物</span></li>
      <li class="nav_user" v-if="isLogin" @click="handleToUser">
        <span>{{ userInfo.u_name }}</span>
      </li>
      <li class="login" v-else>
        <span @click="$router.push('/login')">登录 </span>|<span
          @click="$router.push('/register')"
        >
          注册</span
        >
      </li>
      <li class="nav_message"><span>消息通知</span></li>
      <el-popover
        placement="bottom"
        :visible-arrow="false"
        trigger="hover"
        width="500px"
      >
        <p v-if="!carts.length">购物车中没有商品，赶紧选购吧</p>
        <div v-else>
          <ul v-for="(cart, index) in carts" :key="index" class="cart_list">
            <li>{{ cart.g_name }}</li>
            <li>{{ cart.price }}元</li>
          </ul>
          <el-button size="small" @click="handleGoCart">去购物车结算</el-button>
        </div>
        <li
          :class="{ nav_cart: true, have_carts: carts.length }"
          slot="reference"
        >
          <span
            >购物车 <i class="iconfont icon-ziyuan"></i>
            <span v-if="carts">（{{ carts.length }}）</span>
            <span v-else>（0）</span>
          </span>
        </li>
      </el-popover>
    </ul>
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  name: "Header",
  props: {
    isLogin: Boolean
  },
  data() {
    return {
      carts: []
    };
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem("userInfo"));
    }
  },
  watch: {
    $route(to) {
      if (to.path === "/my_order") {
        this.handleGetCart();
      }
    },
    isLogin(newVal) {
      if (newVal) {
        this.handleGetCart();
      } else {
        this.carts = [];
      }
    }
  },
  created() {
    if (this.isLogin) {
      this.handleGetCart();
    } else {
      this.carts = [];
    }
  },
  methods: {
    handleToUser() {
      this.$router.push("/me");
    },
    handleGoHome() {
      this.$router.push("/");
    },
    handleGoCart() {
      this.$router.push("/cart");
    },
    handleGetCart() {
      this.$axios
        .post("/api/cart/getUserCart", { u_id: this.userInfo.id })
        .then(res => {
          if (res.data.code === 0) {
            this.carts = res.data.validCart;
            this.$store.dispatch("setCarts", res.data.validCart);
          } else if (res.data.code === 1003) {
            this.carts = [];
          } else {
            Message.error("购物车获取失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss">
.header_navbar {
  width: 100%;
  height: 40px;
  background: #333;
  display: flex;
  color: rgb(168, 167, 167);
  li {
    line-height: 40px;
    text-align: center;
    vertical-align: middle;
  }
  .nav_title {
    padding-left: 5em;
    margin-right: auto;
    & :hover {
      color: #fff;
    }
  }
}
.nav_user,
.nav_message,
.login {
  margin-right: 2em;
  & :hover {
    color: #fff;
  }
}
.nav_cart {
  background: #424242;
  margin-right: 3em;
  padding: 0 1em;
}
.have_carts {
  background: #ff6700;
  color: #fff;
}
.nav_message + span {
  & :hover {
    background: #fff;
    color: #ff6700;
  }
}

.el-popover.el-popover {
  padding: 12px 0;
}
.el-popover {
  background: #333;
  padding: 0;
  .nav_sub {
    margin: 0;
    padding: 10px 0;
    color: rgb(168, 167, 167);
    padding-left: 3em;
    li {
      & :hover {
        color: #ff6700;
      }
    }
    .logout {
      margin-top: 10px;
    }
  }
  .el-button {
    background: #ff6700;
    color: #fff;
    float: right;
    margin-top: 12px;
  }
}

.cart_list {
  display: flex;
  justify-content: space-between;
  background: #f5f5f5;
  color: #ff6700;
  line-height: 2em;
  vertical-align: middle;
  padding: 0 5px;
}
</style>
