<template>
  <div id="app-delete">
    <h3 class="text-danger mx-auto mt-4">Delete {{name}} and its children</h3>
    <div class="d-flex justify-content-space mt-4">
      <i class="icofont-danger-zone mr-3" style="color:red; font-size:20px"></i>
      <h5 class="text-danger">Deleting a Member will deletes all of its children</h5>
    </div>
    <div class="d-flex justify-content-space mt-3">
      <i class="icofont-danger-zone mr-3 mb-5" style="color:red; font-size:20px"></i>
      <h5 class="text-danger">No Backup, This can't be undo</h5>
    </div>
    <!-- <SwipeButton
      ref="swipeButton"
      class="swipe-button mx-auto"
      @actionConfirmed="onActionConfirmed"
    />-->
    <div class="d-flex justify-content-between">
      <button @click="onActionConfirmed" type="button" class="btn btn-danger mb-3 mt-3">
        <i class="icofont-ui-delete"></i>
        Delete Permanently
      </button>
      <button @click="close" class="btn mt-3" type="button">Cancel</button>
    </div>
    <div v-show="err">{{err}}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DeleteMember",
  props: ["name", "isMate"],
  data() {
    return {
      err: false
    };
  },
  methods: {
    onActionConfirmed() {
      console.log("deleted");
      this.deleteMe();
    },
    close() {
      console.log("closeeee");
      this.$emit("close");
      if (this.$route.query.hasMate) {
        this.$router.push({
          name: "MemberData",
          params: { member: this.$route.params.member },
          query: { hasMate: true }
        });
      } else {
        this.$router.push({
          name: "MemberData",
          params: { member: this.$route.params.member }
        });
      }
      this.$root.$emit("canceled", this.id);
    },
    deleteMe() {
      console.log("ssas");
      axios
        .delete(
          "http://localhost:5000/tree/" +
            this.$route.params.id +
            "/person/" +
            this.$route.params.member
        )
        .then(() => {
          this.$emit("close");
          this.$router.push({
            name: "MainTree",
            id: this.surname
          });
          this.$root.$emit("update-tree", "deleted a new member");
        })
        .catch(err => (this.err = err));
    }
  }
};
</script>

<style>
#app-delete {
  padding-left: 20px;
}
.slide-button {
  background-color: red !important;
}
.swipe-button {
  width: 500px;
  background-color: white;
  -moz-box-shadow: inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow: inset 0 0 10px #b6b6b6;
  /* border: 1px solid #17255a; */
}
</style>