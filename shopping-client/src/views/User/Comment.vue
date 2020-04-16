<template>
  <div class="comment">
    <Title :title="title" />
    <div class="main">
      <el-card
        class="box_card"
        shadow="never"
        v-for="(order, index) in allOrders"
        :key="index"
      >
        <div slot="header" class="card_hd">
          <span>{{ order.create_time }}</span>
          <span>{{ order.u_name }}</span>
          订单号：<span>{{ order.id }}</span> 实付金额：<span>{{
            order.price
          }}</span>
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
            <p>共{{ goods.count }}件商品</p></el-col
          >

          <el-col :span="4" class="btn_container">
            <el-button
              title="去评价"
              v-if="goods.is_comment == 0"
              @click="handleGotoComment('commentDetails', order.id, goods.g_id)"
              >去评价</el-button
            >
            <el-button
              title="查看评价"
              v-else
              @click="handleGotoComment('commentDetails', order.id, goods.g_id)"
              >已评价</el-button
            >
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
import Title from "@/components/Title.vue";

export default {
  name: "Comment",
  data() {
    return {
      title: "订单评价",
      allOrders: [],
      orderGoods: [],
      user: JSON.parse(localStorage.getItem("userInfo"))
    };
  },
  created() {
    this.handleGetAllOrders();
  },
  methods: {
    handleGetAllOrders() {
      this.$axios
        .post("/api/order/getUserPayOrder", { u_id: this.user.id })
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
    handleGotoComment(path, id, goodsId) {
      this.$router.push({
        name: path,
        params: {
          id: id,
          goodsId: goodsId
        }
      });
    }
  },
  components: {
    Title
  }
};
</script>

<style scoped lang="scss">
.title {
  font-size: 30px;
  font-weight: 400;
  color: #757575;
  margin: 1em 1em;
}

.box_card {
  margin: 0 2em;
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
  margin-left: auto;
  .el-button {
    background: #ff6700;
    color: #fff;
  }
}
</style>
