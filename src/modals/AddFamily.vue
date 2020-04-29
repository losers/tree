<template>
  <div></div>
</template>
<script>
import Vue from "vue";
import VModal from "vue-js-modal";
import AddFamily from "../components/AddFamilyForm.vue";
Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true
});

export default {
  name: "AddFamily",
  mounted() {
    this.$modal.show(
      AddFamily,
      {
        text: "Satyanarayana"
      },
      {
        height: "auto",
        draggable: true,
        clickToClose: false,
        scrollable: true
      }
    );
  },
  methods: {
    beforeClose() {
      this.$emit("close");
    }
  }
};
</script>