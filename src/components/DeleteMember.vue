<template>
  <div id="app-delete" class="p-4">
    <h3 class="text-danger mx-auto mt-4">Delete {{payload.name}}?</h3>
    <ul class="text-danger mt-4">
      <li class="mb-3" v-if="payload.is_mate">It will delete {{payload.name}}'s node.</li>
      <li class="mb-3" v-else>
        It will also delete all of
        <span v-if="payload.gender == 1">his</span>
        <span v-if="payload.gender == 0">her</span>
        descendants/children.
      </li>
      <li>This action can't be undone</li>
    </ul>

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
  props: ["payload"],
  data() {
    return {
      err: false,
      loading: false
    };
  },
  methods: {
    onActionConfirmed() {
      this.loading = true;

      //Subtree Deletion
      if (this.$route.params.subtree_id) {
        console.log("Subtree Deletion");
        let url = `${ProdData.getHostURL()}/subtree/${this.$route.params.id}/${
          this.$route.params.subtree_id
        }/${this.$route.params.member}`;
        axios
          .delete(url)
          .then(res => {
            this.$emit("close");
            if (res.data.name) {
              this.$router.push({
                name: "Subtrees",
                params: { subtree_id: this.$route.params.subtree_id }
              });
            }
            else{
              this.$router.push({
                name: "Tree"
              });
            }
            let payload = {};
            payload.tree = res.data;
            Store.dispatch("setSubtree", payload).then();
          })
          .catch(err => (this.err = err))
          .finally(() => (this.loading = false));
      }
      //MainTree Deletion
      else {
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
            Store.dispatch("treeOnlySetup", treeData.data).then(() => {
              this.$router.push({
                name: "MainTree",
                id: this.surname
              });
            });
          })
          .catch(err => (this.err = err))
          .finally(() => (this.loading = false));
      }
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
#app-delete {
  padding-left: 20px;
}
ul {
  font-size: 20px;
  text-align: start;
}
</style>