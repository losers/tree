<template>
  <router-link to="/">Go bAck</router-link>
</template>
<script>
export default {
  mounted() {
    console.log("hello");
    this.$swal("Add a Family", "<input>").then(() => {
      this.$router.go(-1);
    });
  }
};
</script>