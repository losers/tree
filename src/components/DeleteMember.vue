<template>
  <div id="app-delete">
    <h3 class="text-danger mx-auto mt-4">
      Delete
      <span class="ml-3 mr-3">{{name}} ?</span>
    </h3>
    <div class="d-flex justify-content-space mt-4">
      <i class="mr-3" style="color:red; font-size:20px"></i>
      <h5 class="text-danger">- It will delete all of his/her children</h5>
    </div>
    <div class="d-flex justify-content-space mt-3">
      <i class="mr-3 mb-5" style="color:red; font-size:20px"></i>
      <h5 class="text-danger">- No Backup, This action can't be undone</h5>
    </div>
    <div class="d-flex justify-content-between">
      <button
        @click="onActionConfirmed"
        type="button"
        class="btn btn-danger mb-3 mt-3"
        :disabled="loading"
      >
        <span class="spinner-border spinner-border-sm" v-if="loading"></span>
        <i class="icofont-ui-delete" v-else></i>
        Delete Permanently
      </button>
      <button @click="close" class="btn mt-3" type="button">Cancel</button>
    </div>
    <div v-show="err" class="mt-1" style="color:red">
      <strong>{{err}}</strong>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ProdData from "../data.js";
import Store from "./../store/index";

export default {
  name: "DeleteMember",
  props: ["name", "isMate"],
  data() {
    return {
      err: false,
      loading: false
    };
  },
  methods: {
    onActionConfirmed() {
      this.loading = true;
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
      axios
        .delete(
          ProdData.getHostURL() +
            "/tree/" +
            this.$route.params.id +
            "/person/" +
            this.$route.params.member
        )
        .then(treeData => {
          this.$emit("close");
          this.$router.push({
            name: "MainTree",
            id: this.surname
          });
          Store.dispatch("treeOnlySetup", treeData.data).then();
        })
        .catch(err => (this.err = err))
        .finally(() => (this.loading = false));
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