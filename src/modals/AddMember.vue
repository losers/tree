<template>
  <div></div>
</template>
<script>
import Vue from "vue";
import VModal from "vue-js-modal";
import AddMember from "../components/AddMemberForm.vue";
Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true
});

export default {
  name: "AddMember",
  mounted() {
    this.$modal.show(
      AddMember,
      {
        text: "Satyanarayana"
      },
      {
        height: "auto",
        draggable: true,
        clickToClose: false,
        scrollable:true
      }
    );
  }
};
</script>