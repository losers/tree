<template>
  <div>
    <!-- <swipeable-bottom-sheet
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
    </swipeable-bottom-sheet> -->


    <vue-bottom-dialog
      v-if="$device.mobile"
      v-model="$device.mobile"
      ref="swipeableBottomSheet"
      style="z-index:100"
      v-on:close="beforeClose"
      :height="400"
      :backgroundColor="'#ffffff'"
      :topRadius="'0px'"
      :overlayColor="'grey'"
    >
      <component
        v-bind:is="selectedComponent"
        :payload="this.payload"
        v-on:crudops="crudops"
        v-on:close="swiperClose"
      ></component>
    </vue-bottom-dialog>
  </div>
</template>

<script>
import SwipeableBottomSheet from "../components/t-party/SwipeableBottomSheet";
import VueBottomDialog from 'vue-bottom-dialog';

import AddFamily from "../components/AddFamilyForm.vue";
import AddRoot from "../components/AddRootForm.vue";
import AddMemberForm from "../components/AddMemberForm";
import DeleteMember from "../components/DeleteMember";
import TimelineForm from "../components/TimelineForm";
import AuthForm from "../components/AuthForm";
import Helper from "../components/Helper"; //6
import RelationFinderPromo from "../components/promotional/RelationFinder"; //7
import WebsitePromo from "../components/promotional/Website"; //7
import Vue from "vue";
Vue.use(VueBottomDialog);

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
        TimelineForm,
        AuthForm,
        Helper,
        RelationFinderPromo,
        WebsitePromo
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
          clickToClose: true,
          scrollable: true
        },
        {
          "before-close": this.beforeClose
        }
      );
    }
  },
  methods: {
    crudops(num) {
      this.$emit("crudops", num);
    },
    beforeClose() {
      this.$emit("closed");
    },
    swiperClose(return_payload) {
      this.$refs.swipeableBottomSheet.setState("close");
      setTimeout(() => {
        this.$emit("closed", return_payload);
      }, 500);
    }
  }
};
</script>