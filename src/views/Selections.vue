<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  mounted() {
      console.log(this.$route.name);
    if (this.$route.name == "MainTree") {
      this.$router.push({ name: "Tree" });
    }
  }
};
</script>