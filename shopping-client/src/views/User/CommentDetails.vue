<template>
  <div class="comment_details">
    <Title :title="title" />
    <el-row :gutter="20" class="container" v-if="goods">
      <el-col :span="4" class="left">
        <el-image :src="goods.img_path"></el-image>
        <p>{{ goods.g_name }}</p>
      </el-col>
      <el-col :span="18" class="right" v-if="goods.is_comment == 0">
        <span>评分</span>
        <el-rate v-model="rate" :colors="colors" show-text></el-rate>
        <el-input
          type="textarea"
          placeholder="写下你的感受分享给沙雕网友"
          v-model="content"
          maxlength="500"
          show-word-limit
        >
        </el-input>
        <el-button @click="handleComment">发表评价</el-button>
      </el-col>
      <el-col :span="18" class="o_right" v-if="comment">
        <el-rate
          v-model="comment.rate"
          :colors="colors"
          disabled
          show-text
        ></el-rate>
        <p>内容：{{ comment.content }}</p>
        <p>评论时间：{{ comment.create_time }}</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import { Message } from "element-ui";

export default {
  name: "CommentDetails",
  data() {
    return {
      title: "服务评价",
      orderId: "",
      goodsId: "",
      goods: null,
      rate: null,
      content: "",
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      user: JSON.parse(localStorage.getItem("userInfo")),
      comment: null,
    };
  },
  created() {
    this.orderId = this.$route.params.id;
    this.handleGetGoodId();
    this.handleGetGoods();
    this.handleGetComment();
  },
  methods: {
    handleGetGoodId() {
      let commentDetailsGoodsId = this.$route.params.goodsId;
      this.goodsId =
        commentDetailsGoodsId || localStorage.getItem("commentDetailsGoodsId");

      if (commentDetailsGoodsId) {
        localStorage.setItem("commentDetailsGoodsId", commentDetailsGoodsId);
      }
    },
    handleGetGoods() {
      this.$axios
        .post("/api/order/getSingleOrder", {
          o_id: this.orderId,
          g_id: this.goodsId,
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.goods = res.data.goods;
            return;
          }
          Message.error(res.data.msg);
        });
    },
    handleComment() {
      if (!this.content.length || !this.rate) {
        Message.warning("请正确输入");
        return;
      }
      this.$axios
        .post("/api/user/comment", {
          o_id: this.orderId,
          g_id: this.goodsId,
          u_id: this.user.id,
          content: this.content,
          rate: this.rate,
        })
        .then((res) => {
          if (res.data.code === 0) {
            Message.success("发表评论成功");
            this.$nextTick(() => {
              this.handleGetGoods();
              this.handleGetComment();
            });
            return;
          }
          Message.error("发表评论失败");
        });
    },
    handleGetComment() {
      this.$axios
        .post("/api/user/getUserComment", {
          o_id: this.orderId,
          g_id: this.goodsId,
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.comment = res.data.comment;
            return;
          }
          this.comment = null;
        });
    },
  },
  components: {
    Title,
  },
};
</script>

<style scoped lang="scss">
.title {
  font-size: 30px;
  font-weight: 400;
  color: #757575;
  margin: 1em 1em;
}

.container {
  padding-left: 2em;
  margin-bottom: 2em;
}
.left {
  text-align: center;
  .el-image {
    width: 100px;
    height: 100px;
  }
  p {
    font-size: 14px;
  }
}
.right {
  * {
    margin-top: 1em;
  }
  .el-rate {
    display: inline-block;
    margin-left: 1em;
  }
  .el-button {
    float: right;
  }
}
.o_right {
  * {
    margin-top: 1em;
  }
  :nth-child(3) {
    font-size: 14px;
    color: #757575;
  }
}
</style>
