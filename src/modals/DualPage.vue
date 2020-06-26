<template>
  <!-- <MobileAddMemberForm v-show="$device.mobile" ref="m"></MobileAddMemberForm> -->
  <div>
    <swipeable-bottom-sheet v-if="$device.mobile" ref="swipeableBottomSheet" style="z-index:2000" v-on:close="beforeClose()">
      <component v-bind:is="selectedComponent"></component>
    </swipeable-bottom-sheet>
  </div>
</template>

<script>
import AddFamily from "../components/AddFamilyForm.vue";
import AddRoot from "../components/AddRootForm";
import AddMemberForm from "../components/AddMemberForm";
import SwipeableBottomSheet from "../components/t-party/SwipeableBottomSheet";

export default {
  props: ["reference", "gender", "type", "parent_id"],
  components: {
    SwipeableBottomSheet,
    // AddFamily,
  },
  data() {
    return {
      component: [AddFamily, AddRoot, AddMemberForm],
      selectedComponent : ""
    };
  },
  mounted() {
    this.selectedComponent = this.component[this.reference];
    if (this.$device.mobile) {
      this.$refs.swipeableBottomSheet.setState("open");
    } else {
      this.$modal.show(
        this.selectedComponent,
        {
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
    }
  }
};
</script>