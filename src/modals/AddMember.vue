<template>
  <div></div>
</template>
<script>
import AddMember from "../components/AddMemberForm.vue";

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