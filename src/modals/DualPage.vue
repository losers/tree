<template>
  <MobileAddMemberForm v-show="$device.mobile" ref="m"></MobileAddMemberForm>
</template>

<script>
import AddMemberForm from "../components/AddMemberForm";
import AddRoot from "../components/AddRootForm";
import AddFamily from "../components/AddFamilyForm.vue";
import MobileAddMemberForm from "../components/MemberData/mobile/MemberData";

export default {
  props: ["reference", "gender", "type", "parent_id"],
  components: {
    MobileAddMemberForm
  },
  data() {
    return {
      selectedComponent: ""
    };
  },
  mounted() {
    this.selectedComponent = this.switcher(this.reference);
    if (this.$device.mobile) {
      this.selectedComponent;
      this.$refs.m.opensheet();
    } else {
      this.$modal.show(
        this.selectedComponent,
        {
          text: "Satyanarayana",
          gender: this.gender,
          type: this.type,
          parent_id: this.parent_id
        },
        {
          height: "auto",
          draggable: true,
          clickToClose: false,
          scrollable: true
        },
        {
          "before-close": this.beforeClose
        }
      );
    }
  },
  methods: {
    beforeClose() {
      this.$emit("closed");
    },
    switcher(key) {
      switch (key) {
        case "AddMemberForm":
          return this.$device.mobile ? MobileAddMemberForm : AddMemberForm;
        case "AddRootForm":
          return AddRoot;
        case "AddFamilyForm":
          return AddFamily;
        default:
          break;
      }
    }
  }
};
</script>