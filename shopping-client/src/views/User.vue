<template>
  <div class="user">
    <el-row class="container">
      <!-- 侧边栏 -->
      <el-col :span="5" class="navbar">
        <el-menu
          text-color="#757575"
          :default-active="activeIndex"
          active-text-color="#ff6700"
          @select="handleActive"
        >
          <el-menu-item index="1" @click="handleGoto('/me')">
            <i class="el-icon-user"></i>
            <span slot="title">个人中心</span>
          </el-menu-item>
          <el-menu-item index="2" @click="handleGoto('/my_profile')">
            <i class="el-icon-map-location"></i>
            <span slot="title">收货地址</span>
          </el-menu-item>
          <el-menu-item index="3" @click="handleGoto('/my_order')">
            <i class="el-icon-s-order"></i>
            <span slot="title">我的订单</span>
          </el-menu-item>
          <el-menu-item index="4" @click="handleGoto('/comment')">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">评价晒单</span>
          </el-menu-item>
          <el-menu-item index="5" @click="handleGoto('/change_pwd')">
            <i class="el-icon-setting"></i>
            <span slot="title">修改密码</span>
          </el-menu-item>
          <el-menu-item index="6" @click="handleGoto('/my_message')">
            <i class="el-icon-message"></i>
            <span slot="title">消息通知</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <!-- 内容 -->
      <el-col :span="17" class="main">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
        <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      activeIndex: localStorage.getItem("activeIndex") || "1"
    };
  },
  beforeRouteLeave(to, from, next) {
    localStorage.removeItem("activeIndex");
    next();
  },
  methods: {
    handleGoto(path) {
      this.$router.push(path);
    },
    handleActive(index) {
      localStorage.setItem("activeIndex", index);
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  background: #f5f5f5;
}
.navbar {
  background: #fff;
  text-align: center;
  border-top: 2em solid #f5f5f5;
  border-right: 1em solid #f5f5f5;
  border-bottom: 2em solid #f5f5f5;
  border-left: 5em solid #f5f5f5;
  li a {
    color: #757575;
  }
}
.main {
  background: #fff;
  margin: 2em 5em 2em 0;
}
</style>
