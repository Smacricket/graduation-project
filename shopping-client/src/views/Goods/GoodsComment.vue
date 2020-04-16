<template>
  <div class="goods_comment">
    <CutLine />
    <div v-if="!comments.length" style="text-align:center; margin: 1em 0;">
      <p>暂无用户评论</p>
    </div>
    <div
      class="ct_box"
      v-for="(comment, index) in comments"
      :key="index"
      v-else
    >
      <el-avatar :src="avatar"></el-avatar>
      <div class="right">
        <p>
          {{ comment.u_id.substr(0, 4) + "****" + comment.u_id.substr(28) }}
        </p>
        <el-rate
          v-model="comment.rate"
          :colors="colors"
          disabled
          show-text
        ></el-rate>
      </div>
      <p>内容：{{ comment.content }}</p>
      <p>评论时间：{{ comment.create_time }}</p>
    </div>
  </div>
</template>

<script>
import CutLine from "@/components/CutLine.vue";
// import { Message } from "element-ui";

export default {
  name: "GoodsComment",
  data() {
    return {
      goodsId: "",
      comments: [],
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      avatar:
        "http://imgku.smacricketcvm.com/images/2020/03/28/c2967dfef7e98df036c463d50041edf7.png"
    };
  },
  created() {
    this.goodsId = this.$route.params.id;
    this.handleGetAllComments();
  },
  methods: {
    handleGetAllComments() {
      this.$axios
        .post("/api/user/getAllComments", { g_id: this.goodsId })
        .then(res => {
          if (res.data.code === 0) {
            this.comments = res.data.comments;
            return;
          }
          this.comments = [];
        });
    }
  },
  components: {
    CutLine
  }
};
</script>

<style scoped lang="scss">
.ct_box {
  margin: 1em 2em;
  border: 1px solid #cccccc;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 1em 0;
  * {
    margin-top: 5px;
    margin-left: 1em;
  }
  :first-child,
  :last-child {
    font-size: 14px;
    color: #757575;
  }
  .el-avatar {
    margin-left: 10px;
  }
  .right {
    display: inline-block;
  }
}
</style>
