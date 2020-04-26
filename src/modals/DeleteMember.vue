<script>
import Vue from "vue";
import VModal from "vue-js-modal";
import Delete from "../components/DeleteMember";

Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true
});

export default {
  mounted() {
    // this.open = false;
    this.$modal.show(
      Delete,
      {},
      {
        height: "auto",
        // draggable: true,
        clickToClose: false,
        scrollable: true
      }
    );
  }
};
</script>