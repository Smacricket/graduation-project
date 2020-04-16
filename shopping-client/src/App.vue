<template>
  <div id="app">
    <Header :isLogin="isLogin" />

    <!-- 搜索 -->
    <div class="search" v-if="showSearchInput">
      <el-input v-model="search_content" placeholder="请商品名称"></el-input>
      <div class="search_btn">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleSearchGoods"
        ></el-button>
      </div>
    </div>
    <div class="search_list" v-show="showList">
      <ul>
        <li title="收起列表" class="show" @click="showList = false">
          <i class="el-icon-arrow-up"></i>
        </li>
        <li v-if="!result.length">暂无数据</li>
        <li
          v-for="(item, index) in result"
          :key="index"
          v-else
          @click="handleGoto('goods', item.id)"
        >
          <p>{{ item.g_name }}</p>
        </li>
      </ul>
    </div>

    <keep-alive>
      <!-- 需要缓存 -->
      <router-view
        :showSearchInput="showSearchInput"
        @handleHideSearch="handleHideSearch"
        :isLogin="isLogin"
        @handleLogout="logout"
        v-if="$route.meta.keepAlive"
      />
    </keep-alive>
    <!-- 不需要缓存 -->
    <router-view
      :showSearchInput="showSearchInput"
      @handleHideSearch="handleHideSearch"
      v-if="!$route.meta.keepAlive"
    />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import { Message } from "element-ui";

export default {
  data() {
    return {
      isLogin: localStorage.getItem("loginToken") ? true : false,
      user: JSON.parse(localStorage.getItem("userInfo")),
      search_content: "",
      result: [],
      cacheData: "",
      showSearchInput: true,
      showList: false
    };
  },
  created() {
    if (this.isLogin) {
      this.$socket.emit("userLogin", this.user.id);
    }
  },
  watch: {
    $route(to) {
      if (to.path === "/") {
        this.isLogin = localStorage.getItem("loginToken") ? true : false;
        this.showSearchInput = true;
      }
    },
    search_content(newVal) {
      if (newVal === "") {
        this.showList = false;
      }
    }
  },
  methods: {
    logout(param) {
      this.isLogin = param;
    },
    handleSearchGoods() {
      if (this.search_content) {
        this.$axios
          .post("/api/goods/fuzzy_search", {
            keyword: this.search_content
          })
          .then(res => {
            if (res.data.code === 0) {
              this.result = res.data.result;
              this.showList = true;
              return;
            }
            this.result = [];
            this.showList = true;
          });
      } else {
        Message.warning("请输入搜索关键字");
      }
    },
    handleHideSearch(val) {
      this.showSearchInput = val;
    },
    handleGoto(path, id) {
      this.showList = false;
      this.search_content = "";
      this.$router.push({
        name: path,
        params: {
          id: id
        }
      });
    }
  },
  components: {
    Header
  }
};
</script>

<style scoped lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.search {
  margin: 1em;
  display: flex;
  justify-content: center;
  .el-input {
    width: 30%;
  }
  .search_btn {
    display: inline-block;
  }
}

.search_list {
  margin-top: -10px;
  z-index: 99;
  ul {
    color: #ff6700;
    width: 29%;
    margin: auto;
    transform: translateX(-28px);
    border-radius: 5px;
    padding: 5px 0;
    box-shadow: 0 0 5px 5px #f5f5f5;
    border: 1px solid #f5f5f5;
    li {
      margin: 5px 1em;
    }
    .show {
      float: right;
      :hover {
        color: red;
      }
    }
  }
}
</style>
