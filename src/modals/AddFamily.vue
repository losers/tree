<template>
  <div></div>
</template>
<script>
import AddFamily from "../components/AddFamilyForm.vue";

export default {
  name: "AddFamily",
  mounted() {
    this.$modal.show(
      AddFamily,
      {
        text: "Satyanarayana",
      },
      {
        height: "auto",
        draggable: true,
        clickToClose: false,
        scrollable: true,
      },
      {
        'before-close': this.beforeClose
      }
    );
  },
  methods: {
    beforeClose() {
      this.$emit("closed");
    }
  }
};
</script>