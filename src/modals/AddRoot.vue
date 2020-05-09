<template>
  <div></div>
</template>
<script>
import AddRootForm from "../components/AddRootForm.vue";

export default {
  name: "AddRoot",
  // components: {
  //   AddRootForm
  // },
  mounted() {
    this.$modal.show(
      AddRootForm,
      {
        text: "Root"
      },
      {
        height: "auto",
        draggable: true,
        clickToClose: false,
        scrollable: true  
      }
    );
  }
};
</script>