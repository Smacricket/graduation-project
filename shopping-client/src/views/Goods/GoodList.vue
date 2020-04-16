<template>
  <div class="goodlist">
    <div class="container" v-for="(item, index) in category" :key="index">
      <div class="header">
        <ul class="hd_nav">
          <li class="title">{{ item.cate_name }}</li>
          <li @click="handleGoto('singleCate', item.id)">
            <span>查看全部 <i class="iconfont icon-you"></i></span>
          </li>
        </ul>
      </div>
      <div class="main" v-if="filterGoods && filterGoods.length">
        <ul
          class="m_nav"
          v-for="(good, i) in filterGoods[index]"
          :key="i"
          @click="handleGoto('goods', good.id)"
        >
          <el-image :src="good.g_img_path" fit="contain"></el-image>
          <li class="m_name">{{ good.g_name }}</li>
          <li class="m_title">{{ good.g_title }}</li>
          <li class="m_price">{{ good.g_price }}元</li>
        </ul>
      </div>
      <div
        v-else
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodList",
  props: {
    category: Array,
  },
  data() {
    return {
      goods: [],
      loading: true,
      message: "",
    };
  },
  computed: {
    filterGoods() {
      return this.goods.map((item) => {
        return item.slice(0, 5);
      });
    },
  },
  created() {
    this.handleGetGoods();
  },
  methods: {
    handleGetGoods() {
      this.$axios.get("/api/goods/getAllCategoryGoods").then((res) => {
        if (res.data.code === 0) {
          this.goods = res.data.goods;
          this.loading = false;
        } else {
          this.loading = false;
          this.message = "数据获取失败";
          this.goods = [];
        }
      });
    },
    handleGoto(path, id) {
      this.$router.push({
        name: path,
        params: {
          id: id,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  .hd_nav {
    width: 100%;
    height: 50px;
    display: flex;
    padding: 0;
    line-height: 50px;
    vertical-align: middle;
    li {
      display: inline-block;
    }
  }
  .title {
    font-size: 20px;
    margin-right: auto;
  }
}
li + li {
  & :hover {
    color: #ff6700;
  }
}
.main {
  background: #f5f5f5;
  margin: 0;
  display: flex;
  justify-content: space-evenly;
  & :hover {
    box-shadow: 0 0 10px 5px rgb(168, 168, 168);
    transform: translateY(-10px);
    -webkit-transform: translateY(-10px);
    -moz-transform: translateY(-10px);
  }
}
.m_nav {
  background: #fff;
  width: 200px;
  height: 280px;
  margin: 20px 0;
  padding-left: 0;
  text-align: center;
  :hover {
    box-shadow: none;
    transform: translateY(0px);
    -webkit-transform: translateY(0px);
    -moz-transform: translateY(0px);
  }
  .el-image {
    width: 160px;
    height: 160px;
    margin-top: 10px;
  }
  li {
    margin-top: 5px;
  }
}
.m_title {
  width: 160px;
  height: 2em;
  font-size: 12px;
  color: #6e6e6e;
  padding: 0 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.m_nav .m_price {
  margin-top: 10px;
  color: #ff6700;
}
</style>
