<template>
  <div>
    <swipeable-bottom-sheet
      v-if="$device.mobile"
      ref="swipeableBottomSheet"
      style="z-index:100"
      v-on:close="beforeClose"
    >
      <component
        v-bind:is="selectedComponent"
        :payload="this.payload"
        v-on:crudops="crudops"
        v-on:close="swiperClose"
      ></component>
    </swipeable-bottom-sheet>
  </div>
</template>

<script>
import AddFamily from "../components/AddFamilyForm.vue";
import AddRoot from "../components/AddRootForm";
import AddMemberForm from "../components/AddMemberForm";
import DeleteMember from "../components/DeleteMember";
import SwipeableBottomSheet from "../components/t-party/SwipeableBottomSheet";
import TimelineForm from "../components/TimelineForm";

export default {
  props: ["reference", "payload", "onlySwiper"],
  components: {
    SwipeableBottomSheet
  },
  data() {
    return {
      component: [
        AddFamily,
        AddRoot,
        AddMemberForm,
        DeleteMember,
        TimelineForm
      ],
      selectedComponent: ""
    };
  },
  mounted() {
    this.selectedComponent = this.component[this.reference];
    if (this.onlySwiper) {
      setTimeout(() => {
        this.$refs.swipeableBottomSheet.setState("open");
      }, 200);
    } else if (this.$device.mobile) {
      setTimeout(() => {
        this.$refs.swipeableBottomSheet.setState("open");
      }, 200);
    } else {
      this.$modal.show(
        this.selectedComponent,
        {
          payload: this.payload
        },
        {
          height: "auto",
          draggable: true,
          clickToClose: false,
          scrollable: true
        },
        {
          "before-close": this.beforeClose()
        }
      );
    }
  },
  methods: {
    crudops(num) {
      this.$emit("crudops", num);
    },
    beforeClose(return_payload) {
      this.$emit("closed",return_payload);
    },
    swiperClose(return_payload) {
      this.$refs.swipeableBottomSheet.setState("close");
      setTimeout(() => {
        this.beforeClose(return_payload);
      }, 500);
    }
  }
};
</script>