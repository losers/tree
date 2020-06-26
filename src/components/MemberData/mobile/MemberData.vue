<template>
  <div>
    <swipeable-bottom-sheet ref="swipeableBottomSheet" style="z-index:2000">
      <div class="body">
        <h2>Hello Member</h2>
        <AddCForm v-on:form-cancel="shutterDown"></AddCForm>
        <!-- <router-link :to="{name:'TimelinePerson', params:{member:memdata.data.id}}">View Timeline</router-link> -->
        <br />
      </div>
    </swipeable-bottom-sheet>
  </div>
</template>

<script>
import { SwipeableBottomSheet } from "vue-swipeable-bottom-sheet";
import AddCForm from "../../AddCommonForm";

export default {
  components: {
    SwipeableBottomSheet,
    AddCForm
  },
  props: ["memdata"],
  mounted() {
    console.log("mobile add member");
  },
  methods: {
    fromMainTree() {},
    opensheet() {
      this.$refs.swipeableBottomSheet.setState("open");
    },
    shutterDown() {
      this.$refs.swipeableBottomSheet.setState("close");
    }
  }
};
</script>

<style scoped>
.body {
  padding-top: 20px;
}
</style>