<template>
  <div id="app">
    <SwipeButton ref="swipeButton" class="swipe-button" @actionConfirmed="onActionConfirmed" />
    <button @click="close" class="btn btn-danger">Cancel</button>
  </div>
</template>

<script>
import SwipeButton from "vue-swipe-button";
import "vue-swipe-button/dist/swipeButton.css";
import axios from "axios";

export default {
  name: "DeleteMember",
  components: {
    SwipeButton
  },
  methods: {
    onActionConfirmed() {
      setTimeout(() => {
        this.$refs.swipeButton.reset();
        this.deleteMe();
      }, 1000);
      console.log("deleted");
    },
    close() {
      this.$emit("close");
      this.$router.push({
        name: "MemberData",
        params: this.$route.params.member
      });
      this.$root.$emit("canceled", this.id);
    },
    deleteMe() {
      axios
        .delete(
          "http://localhost:5000/tree/" +
            this.$route.params.id +
            "/person/" +
            this.$route.params.member
        )
        .then(data => console.log(`Deleted : ${data}`))
        .catch(err => console.log("Error : " + err))
        .finally(() => {
          this.$emit("jst-close");
          this.$router.push({
            name: "MainTree",
            params: { id: this.$route.params.id }
          });
          this.$root.$emit("update-tree", "new tree data");
        });
    }
  }
};
</script>

<style>
.swipe-button {
  width: 500px;
  background-color: #17255a;
  border: 1px solid #17255a;
}
</style>