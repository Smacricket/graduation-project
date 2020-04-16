<template>
  <div class="title">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: "Title",
  props: {
    title: String
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
</style>
