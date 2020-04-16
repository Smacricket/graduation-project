<template>
  <div class="order_cart">
    <el-card
      class="box_card"
      shadow="never"
      v-for="(order, index) in allOrders"
      :key="index"
    >
      <div slot="header" class="card_hd" v-if="order.is_cancel == 1 || timeOut">
        <span>订单已取消</span>
      </div>
      <div slot="header" class="card_hd" v-else>
        <span>{{ order.create_time }}</span>
        <span>{{ order.u_name }}</span>
        <span v-if="order.is_pay == 1"
          >订单号：<span>{{ order.id }}</span></span
        >
        <span v-else>
          待支付金额：<span>{{ order.price }}元</span>
        </span>
        <span v-if="order.is_pay == 1">
          实付金额：<span>{{ order.price }}元</span>
        </span>
        <span v-else>
          剩余支付时间：<span class="show_time">{{ countDown }}</span>
        </span>
        <el-button
          title="删除订单"
          type="text"
          @click="handleDeleteOrder(order.id)"
          ><i class="el-icon-delete"></i
        ></el-button>
      </div>
      <el-row
        class="card_ct"
        v-for="(goods, i) in orderGoods[index]"
        :key="i"
        :gutter="20"
      >
        <el-col :span="4"><el-image :src="goods.img_path"></el-image></el-col>
        <el-col :span="4" class="info"
          ><p>{{ goods.g_name }}</p>
          <p>{{ goods.param }}</p>
          <p>{{ goods.price }} x {{ goods.count }}</p></el-col
        >
      </el-row>
      <el-row class="btn_container" v-if="order.is_cancel == 0">
        <el-col :span="6" v-if="order.is_pay == 0">
          <el-button @click="handleGoto('order', index, order.price)"
            >去支付</el-button
          >
          <el-button @click="handleCancelOrder(order.id)">取消订单</el-button>
        </el-col>
        <el-col :span="4" v-else>
          <el-button>订单详情</el-button>
          <el-button @click="$router.push('/comment')">评价晒单</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  name: "OrderCart",
  props: {
    allOrders: Array,
    orderGoods: Array,
    activeName: String
  },
  data() {
    return {
      countDown: "",
      timer: null,
      timeOut: false
    };
  },
  created() {
    this.handleCountTimeDown();
  },
  methods: {
    handleDeleteOrder(id) {
      this.$axios
        .post("/api/order/soft_delete", { id: id })
        .then(res => {
          if (res.data.code === 0) {
            Message.success("删除成功");
            return;
          }
          Message.error("删除失败");
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGoto(path, index, price) {
      this.$router.push({
        name: path,
        params: {
          selectedGoods: this.orderGoods[index],
          price: price
        }
      });
    },
    handleCountTimeDown() {
      let curTime = new Date().getTime();
      let endTime = localStorage.getItem("payTime");
      // 60秒测试用例
      // if (endTime > curTime) {
      //   let time = parseInt((endTime - curTime) / 1000);

      //   let second = parseInt(time % 60);

      //   this.timer = setInterval(() => {
      //     second--;

      //     if (second == "00") {
      //       this.countDown = "订单已超时";
      //       clearInterval(this.timer);
      //       this.timeOut = true;
      //       return;
      //     }

      //     if (second < 10) {
      //       second = "0" + second;
      //     }

      //     this.countDown = second;
      //   }, 1000);
      //   return;
      // }

      if (endTime > curTime) {
        let time = parseInt((endTime - curTime) / 1000);
        let hour = parseInt(time / 3600);
        let minute = parseInt((time / 60) % 60);
        let second = parseInt(time % 60);

        this.timer = setInterval(() => {
          second--;

          if (second == "00" && minute == "00" && hour == "00") {
            this.countDown = "订单已超时";
            clearInterval(this.timer);
            this.timeOut = true;
            return;
          }

          if (second == "00") {
            second = 59;
            minute--;
          }

          if (minute == "00") {
            minute = 59;
            hour--;
          }

          if (second < 10) {
            second = "0" + second;
          }

          if (minute < 10) {
            minute = "0" + minute;
          }

          if (hour < 10) {
            hour = "0" + hour;
          }

          this.countDown = hour + ":" + minute + ":" + second;
        }, 1000);
        return;
      }
      this.timeOut = true;
    },
    handleCancelOrder(id) {
      this.$axios
        .post("/api/order/cancel", { id: id })
        .then(res => {
          if (res.data.code === 0) {
            Message.success("取消成功");
            return;
          }
          Message.error("取消失败");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped lang="scss">
.order_cart {
  margin-bottom: 2em;
}
.box_card {
  margin: 0 2em;
  position: relative;
}
.box_card + .box_card {
  margin-top: 1em;
}

.card_hd {
  span {
    padding-right: 1em;
  }
  .el-button {
    float: right;
    padding: 3px 0;
  }
  .show_time {
    color: #ff6700;
    font-size: 18px;
  }
}

.card_ct {
  display: flex;
  align-items: center;
  .el-image {
    width: 100px;
    height: 100px;
  }
  .info {
    font-size: 14px;
    color: #757575;
    p {
      padding-top: 5px;
    }
  }
}
.btn_container {
  position: absolute;
  top: 90px;
  right: 0;
  .el-button {
    width: 100px;
    margin: 5px 0;
  }
}
// .pay {
//   position: absolute;
//   top: 90px;
//   right: 110px;
// }
</style>
