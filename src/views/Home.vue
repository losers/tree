<template>
  <h1>Find your Tree</h1>
</template>

<script>
export default {
  data() {
    return {
      info: null,
      loading: true,
      errored: false
    };
  },
  mounted() {
    axios
      .get("https://biheros.herokuapp.com/" + this.id)
      .then(response => {
        this.info = response.data;
        console.log("lets see");
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.loading = false));
  }
};
</script>