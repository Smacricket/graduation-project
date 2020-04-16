<template>
  <div class="good">
    <div class="header" v-if="good">
      <h2>{{ good.g_name }}</h2>
      <ul class="navbar">
        <li :title="title" @click="handleOpenComment"><span>用户评价</span></li>
      </ul>
    </div>
    <div class="main" v-if="good">
      <el-carousel trigger="click">
        <el-carousel-item v-for="(image, index) in images" :key="index">
          <!-- <el-image :src="image.img_paths" fit="contain"></el-image> -->
          <pic-zoom :url="image.img_paths" :scale="2"></pic-zoom>
        </el-carousel-item>
      </el-carousel>
      <div class="content">
        <h1>{{ good.g_name }}</h1>
        <h2>{{ good.g_title }}</h2>
        <p class="c_desc">{{ good.g_desc }}</p>
        <p class="c_price">{{ good.g_price }}元</p>

        <div v-if="!attrValues">
          <p>选择版本</p>
          <div>
            <ul class="nav">
              <li @click="handleSelectParam(good.g_params)">
                <el-button :class="{ active: params !== '' }">{{
                  good.g_params
                }}</el-button>
              </li>
            </ul>
          </div>
        </div>

        <div v-for="(a, index) in attribute" :key="index" v-else>
          <p>选择{{ a.a_name }}</p>
          <div>
            <ul class="nav">
              <li
                v-for="(attr, i) in attrValues[index]"
                :key="i"
                @click="handleSelect(index, i)"
              >
                <el-button
                  :class="{ active: sel[index] == i }"
                  :disabled="attr.sku == 0"
                >
                  {{ attr.val }}
                </el-button>
              </li>
            </ul>
          </div>
        </div>
        <p>数量</p>
        <p>
          <el-input-number v-model="count" :min="1" :max="10"></el-input-number>
        </p>

        <div>
          <el-button
            class="c_btn"
            @click="handleAddCart"
            v-if="good.is_delete == '0'"
            >加入购物车
          </el-button>
          <el-button class="c_btn" disabled v-else>
            商品已下架
          </el-button>
        </div>
      </div>
    </div>
    <GoodsComment v-show="isShow" />
  </div>
</template>

<script>
import GoodsComment from "@/views/Goods/GoodsComment.vue";
import { Message } from "element-ui";
import PicZoom from "vue-piczoom";

export default {
  name: "Good",
  data() {
    return {
      images: [],
      good: null,
      attribute: null,
      attrValues: null,
      selectedVersion: "",
      selectedColor: "",
      sel: [],
      params: "",
      count: 1,
      user: JSON.parse(localStorage.getItem("userInfo")),
      isShow: false,
      title: "查看评论"
    };
  },
  created() {
    this.handleGetImgs(this.$route.params.id);
    this.getSingleGoods(this.$route.params.id).then(result => {
      // 电子产品分类才获取
      if (result.g_cate_id == "2") {
        this.handleGetAttribute(result);
        this.handleGetAttrValue(result);
      }
    });
  },
  methods: {
    getSingleGoods(id) {
      return new Promise((resolve, reject) => {
        this.$axios
          .post("/api/goods/search_gid", {
            id: id
          })
          .then(res => {
            if (res.data.code === 0) {
              this.good = res.data.good;
              // this.params = this.good.g_params;
              resolve(this.good);
              return;
            }
            Message.error(res.data.msg);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    handleAddCart() {
      let param = "";
      if (this.params === "") {
        param = this.selectedVersion + " " + this.selectedColor;
      } else {
        param = this.params;
      }

      this.$axios
        .post("/api/cart/add", {
          g_id: this.good.id,
          u_id: this.user.id,
          g_name: this.good.g_name,
          img_path: this.good.g_img_path,
          price: this.good.g_price,
          count: this.count,
          param: param
        })
        .then(res => {
          if (res.data.code === 0) {
            Message.success("加入购物车成功");
            this.$nextTick(() => {
              this.$router.push("/cart");
            });
            return;
          }
          Message.success(res.data.msg);
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleOpenComment() {
      this.isShow = !this.isShow;
      if (this.title === "查看评论") {
        this.title = "收起评论";
        return;
      }
      this.title = "查看评论";
    },
    handleGetImgs(id) {
      this.$axios
        .post("/api/goods/getMoreImgs", {
          id: id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.images = res.data.images;
            return;
          }
          this.images = [];
        });
    },
    handleGetAttribute(result) {
      this.$axios
        .post("/api/goods/getAttribute", {
          c_id: result.g_cate_id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.attribute = res.data.attribute;
          } else {
            this.attribute = null;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetAttrValue(result) {
      this.$axios
        .post("/api/goods/getAttrValue", {
          g_id: result.id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.attrValues = res.data.attrValues;
          } else {
            this.attrValues = null;
          }
        })
        .catch(err => {
          console(err);
        });
    },
    handleSelect(index, i) {
      if (this.attribute[index].id === 1) {
        this.selectedVersion = this.attrValues[index][i].val;
        this.good.g_price = this.attrValues[index][i].price;
      }
      if (this.attribute[index].id === 2) {
        this.selectedColor = this.attrValues[index][i].val;
      }
      this.sel[index] = i;
      this.$set(this.sel, index, i);
    },
    handleSelectParam(val) {
      this.params = val;
    }
  },
  components: {
    GoodsComment,
    PicZoom
  }
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  padding: 0 5em;
  border: 1px solid rgb(207, 207, 207);
  box-shadow: 0 5px 5px 0 rgb(177, 177, 177), 0 -1px 1px 0 rgb(240, 240, 240);
  line-height: 60px;
  h2 {
    font-size: 18px;
    line-height: inherit;
    vertical-align: middle;
  }
}
.navbar {
  margin-left: auto;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
  color: rgb(87, 87, 87);
  li {
    line-height: inherit;
    vertical-align: middle;
    & :hover {
      color: #ff6700;
    }
  }
}

.main {
  display: flex;
  height: 500px;
  padding: 2em 0;
  justify-content: space-between;
  .el-carousel {
    width: 400px;
    height: 400px;
    margin: 0 8em;
  }
  ::v-deep.el-carousel__container {
    height: 400px;
  }

  ::v-deep .el-carousel__button {
    background-color: #757575;
  }
}
.content {
  width: 600px;
  height: 400px;
  padding: 0 2em;
  h1 {
    font-size: 22px;
  }
  h2 {
    font-weight: 10;
  }
  p {
    margin-top: 10px;
  }
  .c_desc {
    font-size: 14px;
    color: #ff6700;
  }
  .c_price {
    font-size: 18px;
    color: #ff6700;
  }
}
.nav {
  display: flex;
  margin-top: 1em;
  li + li {
    margin-left: 1em;
  }
  .active {
    background: rgba($color: #ff6700, $alpha: 0.9);
    color: #fff;
  }
}

.c_btn {
  background: #ff6700;
  color: #fff;
  margin-top: 2em;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
