<template>
  <div class="my_profile">
    <Title :title="title" />
    <Profile />
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import Profile from "@/components/Profile.vue";

export default {
  name: "MyProfile",
  data() {
    return {
      title: "收货地址"
    };
  },
  components: {
    Profile,
    Title
  }
};
</script>

<style scoped lang="scss"></style>
