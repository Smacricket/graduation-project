<template>
  <div class="single_goods">
    <div class="container">
      <h1 class="title">{{ title }}</h1>

      <div class="main" v-if="goods && goods.length">
        <ul
          class="m_nav"
          v-for="(good, index) in goods"
          :key="index"
          @click="handleGoto('goods', good.id)"
        >
          <el-image :src="good.g_img_path"></el-image>
          <div class="m_footer">
            <li class="m_name">{{ good.g_name }}</li>
            <li class="m_title">{{ good.g_title }}</li>
            <li class="m_price">{{ good.g_price }}元</li>
          </div>
        </ul>
        <ul class="o_nav" v-if="goods.length % 2 !== 0">
          <li>
            <p>已无更多商品</p>
            <span @click="$router.push('/')"
              >返回主页，浏览更多商品<i class="iconfont icon-you"></i
            ></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  name: "SingleGoods",
  data() {
    return {
      title: "",
      goods: null
    };
  },
  created() {
    this.hanldeGetCateName(this.$route.params.id);
    this.handleGetSingleCateGoods(this.$route.params.id);
  },
  methods: {
    hanldeGetCateName(id) {
      this.$axios
        .post("/api/goods/getCateName", { id: id })
        .then(res => {
          if (res.data.code === 0) {
            this.title = res.data.category.cate_name;
            return;
          }
          Message.error(res.data.msg);
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetSingleCateGoods(id) {
      this.$axios
        .post("/api/goods/search_cid", { id: id })
        .then(res => {
          if (res.data.code === 0) {
            this.goods = res.data.goods;
            return;
          }

          this.goods = null;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGoto(path, id) {
      this.$router.push({
        name: path,
        params: {
          id: id
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  background: rgb(246, 171, 46);
  padding: 2em 5em;
}
.title {
  color: #fff;
  font-size: 30px;
  font-weight: 400;
  text-align: center;
}
.main {
  display: flex;
  flex-flow: row wrap;
  & :hover {
    box-shadow: 0 0 10px 5px rgb(168, 168, 168);
    transform: translateY(-10px);
    -webkit-transform: translateY(-10px);
    -moz-transform: translateY(-10px);
  }

  .m_nav {
    box-sizing: border-box;
    width: 40%;
    margin: 2em auto;
    text-align: center;
    overflow: hidden;
    :hover {
      box-shadow: none;
      transform: translateY(0px);
      -webkit-transform: translateY(0px);
      -moz-transform: translateY(0px);
    }
    .el-image {
      width: 350px;
      height: 350px;
      border-right: 4em solid #fff;
      border-left: 4em solid #fff;
    }
    li + li {
      margin-top: 5px;
    }
  }
}

.m_footer {
  background: #f5f5f5;
}
.m_title {
  width: 60%;
  height: 2em;
  margin: 0 auto;
  font-size: 14px;
  color: #6e6e6e;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.m_nav .m_price {
  margin-top: 10px;
  color: #ff6700;
}

.o_nav {
  box-sizing: border-box;
  background: #fff;
  width: 40%;
  margin: 2em auto;
  display: flex;
  flex-direction: column;
  :hover {
    box-shadow: none;
    transform: translateY(0px);
    -webkit-transform: translateY(0px);
    -moz-transform: translateY(0px);
  }
  li {
    margin: auto;
  }
  p {
    color: #757575;
    font-size: 40px;
    font-weight: 100;
  }
  span {
    color: #ff6700;
    float: right;
    margin-top: 1em;
    &:hover {
      color: red;
    }
  }
}
</style>
