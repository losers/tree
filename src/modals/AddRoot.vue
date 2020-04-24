<script>
import Vue from "vue";
import VModal from "vue-js-modal";
import AddRootForm from "../components/AddRootForm.vue";

Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true
});

export default {
  name: "AddRoot",
  components:{
      AddRootForm
  },
  mounted() {
    console.log("add root form");
    this.$modal.show(
      AddRootForm,
      {
        text: "Root"
      },
      {
        height: "auto",
        draggable: true,
        clickToClose: false
      }
    );
  },
  
};
</script>