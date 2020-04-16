<template>
  <div class="order">
    <div class="order_hd">
      <h1>确认订单</h1>
      <div class="line"></div>
    </div>
    <div class="container">
      <div class="order_main">
        <h1>收货地址</h1>
        <Profile @handleReturnProfile="handleGetProfile" />
        <h1>商品</h1>
        <CutLine />
        <div v-for="(good, index) in goods" :key="index">
          <div class="goods_list">
            <el-image :src="good.img_path"></el-image>
            <p>{{ good.g_name }}</p>
            <p>{{ good.param }}</p>
            <p>{{ good.price }}元 x {{ good.count }}</p>
            <p>{{ good.sub_total }}元</p>
          </div>
          <CutLine />
        </div>
        <div class="details">
          <p>
            商品件数：<span>{{ totalCount }}件</span>
          </p>
          <p>
            商品总价：<span>{{ totalPrice }}元</span>
          </p>
        </div>
        <div class="btn_container">
          <el-button class="goback" @click="$router.push('/cart')"
            >返回购物车</el-button
          >
          <el-button @click="confirmDialog = true">去支付</el-button>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="confirmDialog" width="30%" center>
      <h1 class="dialog_title">确认支付</h1>
      <span slot="footer" class="dialog-footer">
        <!-- 取消应该是生成未支付订单 -->
        <el-button class="btn_cancel" @click="handleAddOrder(0)"
          >取 消</el-button
        >
        <el-button class="btn_confirm" @click="handleAddOrder(1)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CutLine from "@/components/CutLine.vue";
import Profile from "@/components/Profile.vue";
import { Message } from "element-ui";

export default {
  name: "Order",
  props: {
    showSearchInput: Boolean,
  },
  data() {
    return {
      profiles: null,
      goods: [],
      user: JSON.parse(localStorage.getItem("userInfo")),
      totalPrice: 0,
      totalCount: 0,
      isPay: 0,
      confirmDialog: false,
    };
  },
  created() {
    this.handleGetGoods();
    this.$emit("handleHideSearch", false);
    // console.log(this.goods);
  },
  methods: {
    handleGetGoods() {
      let selectedGoods = this.$route.params.selectedGoods;

      this.goods =
        selectedGoods || JSON.parse(localStorage.getItem("selectedGoods"));
      if (selectedGoods) {
        localStorage.setItem("selectedGoods", JSON.stringify(selectedGoods));
      }

      for (let good of this.goods) {
        if (good.sub_total) {
          this.totalPrice += good.sub_total;
        } else {
          let total_price = this.$route.params.price;

          this.totalPrice = total_price || localStorage.getItem("totalPrice");
          if (total_price) {
            localStorage.setItem("totalPrice", total_price);
          }
        }

        this.totalCount += good.count;
      }
    },
    handleAddOrder(is_pay) {
      // 判断是去支付还是生成新的订单
      let result = this.goods.some((item) => {
        if (item.o_id) {
          return true;
        }
      });

      if (result) {
        // 已下单，更新支付
        this.handelUpdateOrder(is_pay);
      } else {
        this.handelGenerateOrder(is_pay);
      }
    },
    handelGenerateOrder(is_pay) {
      this.confirmDialog = false;
      this.isPay = is_pay;

      if (this.profiles) {
        this.$axios
          .post("/api/order/add", {
            u_id: this.user.id,
            goods_list: this.goods,
            price: this.totalPrice,
            count: this.totalCount,
            u_name: this.profiles.name,
            phone: this.profiles.phone,
            address: this.profiles.address,
            is_pay: this.isPay,
          })
          .then((res) => {
            if (res.data.code === 0) {
              if (is_pay === 0) {
                let date = new Date().getTime() + 12 * 60 * 60 * 1000;
                // 60秒测试
                // let date = new Date().getTime() + 60 * 1000;
                localStorage.setItem("payTime", date);
                Message.success("订单未支付");
              } else {
                Message.success("下单成功");
              }
              this.$store.dispatch("setCarts", null);
              this.$router.push("/my_order");
              return;
            }
            Message.error("下单失败，请稍后再试");
          });
      } else {
        Message.warning("请选择收货地址");
      }
    },
    handelUpdateOrder(is_pay) {
      this.confirmDialog = false;
      this.isPay = is_pay;

      if (this.profiles) {
        this.$axios
          .post("/api/order/update", {
            id: this.goods[0].o_id,
            is_pay: this.isPay,
          })
          .then((res) => {
            if (res.data.code === 0) {
              if (is_pay === 0) {
                Message.success("订单未支付");
              } else {
                Message.success("下单成功");
              }
              this.$router.push("/my_order");
              return;
            }
            Message.error("下单失败，请稍后再试");
          });
      } else {
        Message.warning("请选择收货地址");
      }
    },
    handleGetProfile(profile) {
      this.profiles = profile;
    },
  },
  components: {
    CutLine,
    Profile,
  },
};
</script>

<style scoped lang="scss">
.order_hd h1 {
  font-size: 30px;
  font-weight: 100;
  margin: 2rem 0 2rem 5rem;
}
.line {
  width: 100%;
  background: #ff6700;
  height: 2px;
}

.container {
  background: #f5f5f5;
  padding: 2em 0;
}
.order_main {
  background: #fff;
  width: 80%;
  margin: auto;
  padding: 0 2em;
  h1 {
    font-size: 18px;
    padding: 2em 0 1em;
  }
}

.goods_list {
  line-height: 60px;
  display: flex;
  p {
    font-size: 14px;
    line-height: 60px;
    vertical-align: middle;
  }
  p:nth-child(2) {
    margin-left: 1em;
    margin-right: auto;
  }
  p + p {
    width: 200px;
    text-align: center;
  }
  p:last-child {
    color: #ff6700;
  }
  .el-image {
    width: 50px;
    height: 50px;
    margin: auto 0;
  }
}

.details {
  p {
    direction: rtl;
    margin: 1em;
  }
  span {
    color: #ff6700;
  }
}

.btn_container {
  display: flex;
  .el-button {
    width: 150px;
    margin: 1em 1em;
  }
  .goback {
    margin-left: auto;
  }
  .el-button:last-child {
    background: #ff6700;
    color: #fff;
  }
}

.dialog_title {
  font-size: 20px;
  font-weight: bold;
  width: 120px;
  margin: auto;
}
.btn_cancel {
  background: #b0b0b0;
  color: #fff;
}
.btn_confirm {
  background: #ff6700;
  color: #fff;
}
</style>
