<template>
  <div class="home">
    <div class="container">
      <!-- 轮播图 -->
      <div class="swiper">
        <el-carousel trigger="click">
          <el-carousel-item v-for="(item, key) in swiper" :key="key">
            <el-image
              :src="item.img_path"
              fit="contain"
              @click="handleGoto('goods', item.g_id)"
            ></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- 商品 -->
      <div class="good_list">
        <keep-alive>
          <GoodList :category="category" />
        </keep-alive>
      </div>
      <!-- 右侧图标 -->
      <ul class="r_icon">
        <li @click="handleToUser">
          <i title="个人中心" class="el-icon-user"></i>
        </li>
        <li @click="drawer = true">
          <i title="在线客服" class="el-icon-service"></i>
        </li>
        <li @click="handleLogout">
          <i title="退出登录" class="iconfont icon-tuichudenglu"></i>
        </li>
        <li v-if="btnFlag" @click="backTop">
          <i title="返回顶部" class="el-icon-caret-top"></i>
        </li>
      </ul>

      <!-- 在线客服 -->
      <el-drawer title="在线客服" :visible.sync="drawer">
        <ul class="list_group" ref="list">
          <!-- 提示 -->
          <li class="list_item left">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
            <div>
              <span>温馨提示</span>
              <p class="content">
                客服在线时间为09:00-18:00，其余时间客服均不会回复
              </p>
            </div>
          </li>

          <!-- 渲染历史记录 -->
          <li
            class="list_item"
            :class="h.from_id == user.id ? 'right' : 'left'"
            v-for="(h, i) in history"
            :key="i"
          >
            <el-avatar
              src="http://imgku.smacricketcvm.com/images/2020/03/23/avatar.jpg"
              v-if="h.from_id == user.id"
            ></el-avatar>
            <el-avatar
              src="http://imgku.smacricketcvm.com/images/2020/03/27/f7e539d4_E827406_99aed233.png"
              v-else
            ></el-avatar>

            <div>
              <span v-if="h.from_id == user.id">客户</span>
              <span v-else>客服</span>
              <p class="content">
                {{ h.content }}
              </p>
            </div>
          </li>
          <p class="tip" v-if="history.length">
            <span>{{ handleFormatTime() }}</span>
          </p>

          <!-- 渲染新记录 -->
          <li
            class="list_item left"
            v-for="(ct, index) in contents"
            :key="index"
          >
            <el-avatar
              src="http://imgku.smacricketcvm.com/images/2020/03/27/f7e539d4_E827406_99aed233.png"
            ></el-avatar>
            <div>
              <span>客服</span>
              <p class="content">{{ ct }}</p>
            </div>
          </li>
        </ul>
        <div class="draw_footer">
          <el-input
            v-model="message"
            type="textarea"
            :rows="2"
            placeholder="请输入聊天内容"
            v-on:keyup.enter="handleSendMessage"
          ></el-input>
          <el-button @click="handleSendMessage">发送</el-button>
        </div>
      </el-drawer>
    </div>

    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Footer.vue";
import GoodList from "@/views/Goods/GoodList.vue";
import { Message } from "element-ui";

export default {
  name: "Home",
  props: {
    isLogin: Boolean
  },
  data() {
    return {
      user: JSON.parse(localStorage.getItem("userInfo")),
      swiper: [],
      category: [],
      drawer: false,
      message: "",
      contents: [],
      // 这里指定传给一个客服
      toId: "cf06a80fd07c4b84af20c38d3aa30793",
      avatar: "http://imgku.smacricketcvm.com/images/2020/03/23/avatar.jpg",
      showTip: false,
      history: [],
      btnFlag: false,
      scrollTop: 0
    };
  },
  sockets: {
    connect() {},
    serviceChat(msg) {
      this.$forceUpdate();
      this.contents.push(msg.content);
    }
  },
  created() {
    this.getSwiper();
    this.getCategory();
    if (this.isLogin) {
      this.handleGetHistoryMsg();
    }
  },
  mounted() {
    window.addEventListener("scroll", this.scrollToTop, true);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop);
  },
  methods: {
    handleLogout() {
      if (this.isLogin) {
        this.$axios.get("/api/user/logout").then(res => {
          if (res.data.code === 0) {
            localStorage.removeItem("loginToken");
            localStorage.removeItem("userInfo");
            Message.success("退出登录成功");
            this.$emit("handleLogout", false);
          }
        });
      } else {
        Message.warning("未登录");
      }
    },
    handleToUser() {
      this.$router.push("/me");
    },
    // 获取轮播图
    getSwiper() {
      this.$axios.get("/api/get_swiper").then(res => {
        if (res.data.code === 0) {
          this.swiper = res.data.swiper;
          return;
        }
        Message.warning(res.data.msg);
      });
    },
    // 获取分类
    getCategory() {
      this.$axios.get("/api/get_category").then(res => {
        if (res.data.code === 0) {
          this.category = res.data.category;
          return;
        }
        Message.warning(res.data.msg);
      });
    },
    // 获取聊天记录
    handleGetHistoryMsg() {
      this.$axios
        .post("/api/history/fromUser", {
          id: this.user.id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.history = res.data.history;
            return;
          }
          this.history = [];
        });
    },
    // 发送信息
    handleSendMessage(event) {
      if (this.isLogin) {
        let list = this.$refs.list;
        // console.log(list);
        event.preventDefault();

        if (this.message.length) {
          // 发送信息到服务端
          this.$socket.emit("chat", {
            from: this.user.id,
            to: this.toId,
            msg: this.message
          });

          // 接收服务端返回信息
          this.sockets.subscribe("chat", data => {
            // 判断发送信息时间
            if (data.tip && !this.showTip) {
              this.showTip = true;
              let p = document.createElement("p");
              p.className = "tip";
              p.innerHTML = `<span>客服离线，留言成功</span>`;
              list.append(p);
            }

            let li = document.createElement("li");
            li.className = `list_item ${data.position}`;
            li.innerHTML = `
            <span class="el-avatar">
              <img src="${this.avatar}" style="object-fit: cover;">
            </span>
            <div>
              <span>客户</span>
              <p class="content">
                ${data.content}
              </p>
            </div>`;
            list.append(li);
            // 将聊天区域的滚动条设置到最新内容的位置
            list.scrollTop = list.scrollHeight;
          });
          this.message = "";

          // 删除监听器，不然会反复监听，而且这里不能同步删除
          setTimeout(() => {
            this.sockets.unsubscribe("chat");
          }, 0);
        } else {
          Message.warning("请输入聊天内容");
        }
        return;
      }

      Message.warning("未登录");
    },
    handleFormatTime() {
      let date = new Date();
      let Y = date.getFullYear() + "-",
        M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-",
        D = date.getDate() + " ",
        h = date.getHours() + ":",
        m = date.getMinutes();
      let time = Y + M + D + h + m;

      return time;
    },
    handleGoto(path, id) {
      this.$router.push({
        name: path,
        params: {
          id: id
        }
      });
    },
    backTop() {
      const that = this;
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    scrollToTop() {
      const that = this;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop > 200) {
        that.btnFlag = true;
      } else {
        that.btnFlag = false;
      }
    }
  },
  components: {
    Footer,
    GoodList
  }
};
</script>

<style scoped lang="scss">
.container {
  width: 1244px;
  margin: 0 auto;
}

.swiper {
  margin-top: 1em;
  .el-image {
    width: 100%;
    height: 100%;
  }
}
::v-deep .el-carousel__container {
  height: 500px;
}

.r_icon {
  font-size: 18px;
  position: fixed;
  top: 70%;
  right: 40px;
  li {
    background: #f5f5f5;
    border: 1px solid #fff;
    padding: 10px 5px;
  }
}

.el-drawer {
  position: relative;
}
::v-deep .el-drawer__header {
  margin-bottom: 0;
}

.list_group {
  margin: 2em 1em;
  height: 500px;
  overflow: auto;
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #f90;
    background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
  }
}
::v-deep .list_item {
  width: 100%;
  margin-bottom: 10px;
  float: left;
  .el-avatar {
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    color: #fff;
    background: #c0c4cc;
    line-height: 40px;
    overflow: hidden;
    border-radius: 50%;
  }
  .el-avatar > img {
    display: block;
    height: 100%;
    vertical-align: middle;
  }
  .content {
    color: #000;
    max-width: 200px;
    height: auto;
    padding: 10px;
    margin-top: 5px;
    word-wrap: break-word;
    border-radius: 5px;
  }
  span {
    font-size: 12px;
    font-weight: 100;
    display: block;
  }
}
::v-deep .right .el-avatar,
::v-deep .right div {
  float: right;
  margin-right: 8px;
}
::v-deep .left .el-avatar,
::v-deep .left div {
  float: left;
  margin-left: 8px;
}
::v-deep .right span {
  text-align: right;
}
::v-deep .right .content {
  background: #86bdf8;
}
::v-deep .left .content {
  background: #d5d3d3;
}

::v-deep .tip {
  color: #888;
  text-align: center;
  margin: 5px;
  font-size: 14px;
  span {
    background-color: #eee;
    border-radius: 9px;
    padding: 1px 5px;
    margin-bottom: 7px;
  }
}

.draw_footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  margin: 1em 1em;
  .el-textarea {
    width: 70%;
  }
  .el-button {
    background: #ff6700;
    color: #fff;
    margin-left: 1em;
  }
}
</style>
