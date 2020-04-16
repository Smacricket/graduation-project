<template>
  <div class="my_order">
    <Title :title="title" />
    <el-tabs v-model="activeName" @tab-click="handleGetActive">
      <el-tab-pane label="全部订单" name="all">
        <OrderCart
          :allOrders="allOrders"
          :orderGoods="orderGoods"
          :activeName="activeName"
          v-if="allOrders.length"
        />
        <p class="tip" v-else>暂无数据</p>
      </el-tab-pane>
      <el-tab-pane label="待支付" name="unpaid">
        <OrderCart
          :allOrders="unpaidOrder"
          :orderGoods="unpaidGoods"
          :activeName="activeName"
          v-if="unpaidOrder.length"
        />
        <p class="tip" v-else>
          <span>暂无数据</span>
        </p>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { Message } from "element-ui";
import Title from "@/components/Title.vue";
import OrderCart from "@/components/OrderCart.vue";

export default {
  name: "MyOrder",
  data() {
    return {
      title: "我的订单",
      allOrders: [],
      orderGoods: [],
      unpaidOrder: [],
      unpaidGoods: [],
      user: JSON.parse(localStorage.getItem("userInfo")),
      activeName: "all"
    };
  },
  created() {
    this.handleGetAllOrders();
  },
  updated() {
    this.$nextTick(() => {
      this.handleGetAllOrders();
    });
  },
  methods: {
    handleGetAllOrders() {
      this.$axios
        .post("/api/order/getUserOrder", { u_id: this.user.id })
        .then(res => {
          if (res.data.code === 0) {
            this.allOrders = res.data.orderList;
            this.orderGoods = res.data.orderGoods;
            return;
          }
          Message.error(res.data.msg);
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetUnpaidOrders() {
      this.$axios
        .post("/api/order/getUserNotPayOrder", { u_id: this.user.id })
        .then(res => {
          if (res.data.code === 0) {
            this.unpaidOrder = res.data.unpaidOrder;
            this.unpaidGoods = res.data.unpaidGoods;
            return;
          }
          Message.error(res.data.msg);
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetActive(val) {
      this.activeName = val.paneName;
      if (this.activeName === "unpaid") {
        this.handleGetUnpaidOrders();
      }
    }
  },
  components: {
    OrderCart,
    Title
  }
};
</script>

<style scoped lang="scss">
.title {
  font-size: 30px;
  font-weight: 400;
  color: #757575;
  margin: 1em 1em 0;
}
.el-tabs {
  margin-top: 1em;
  margin-left: 2em;
}
.tip {
  text-align: center;
  font-size: 18px;
  font-weight: 100;
  margin: 1em 0;
}
</style>
