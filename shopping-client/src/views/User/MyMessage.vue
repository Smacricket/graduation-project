<template>
  <div class="message">
    <Title :title="title" />
  </div>
</template>

<script>
// import { Message } from "element-ui";
import Title from "@/components/Title.vue";

export default {
  name: "MyMessage",
  data() {
    return {
      title: "我的信息"
    };
  },
  components: {
    Title
  }
};
</script>

<style scoped lang="scss"></style>
