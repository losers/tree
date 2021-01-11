<template>
  <div>
    <AddCForm v-on:form-submit="sendData" v-on:form-cancel="goBack" :payload="this.payload"></AddCForm>
    <div v-show="err" class="mt-2">{{err}}</div>
  </div>
</template>

<script>
import AddCForm from "./AddCommonForm";
import Axios from "axios";
import ProdData from "../data.js";
import Store from "./../store/index";

export default {
  name: "AddMemberForm",
  components: {
    AddCForm
  },
  props: ["payload"],
  data() {
    return {
      surname: this.$route.params.id,
      err: false
    };
  },
  mounted() {},
  computed: {
    metadata: {
      get() {
        return Store.state.metadata;
      }
    }
  },
  methods: {
    sendData(data) {
      if (this.payload.xtra_parent_id && this.payload.type == 0) {
        //Adding Parent to Partner
        data.main_tree_id = this.metadata[0]._id;
        data.child_id = this.payload.xtra_parent_id;
        if (this.$route.params.subtree_id) {
          data.subtree_id = this.$route.params.subtree_id;
        }
        let url = `${ProdData.getHostURL()}/subtree/${
          this.surname
        }/partner-parent`;
        Axios.post(url, data)
          .then(res => {
            this.$emit("close");
            this.$router.push({
              name: "Subtrees",
              params: { subtree_id: res.data }
            });
          })
          .catch(err => (this.err = err));
      } else if (this.$route.params.subtree_id) {
        //Adding Members in Subtree
        let url = `${ProdData.getHostURL()}/subtree/${this.$route.params.id}/${
          this.$route.params.subtree_id
        }`;
        Axios.post(url, data)
          .then(res => {
            this.$emit("close");
            this.$router.push({
              name: "Subtrees",
              params: { subtree_id: this.$route.params.subtree_id }
            });
            let payload = {};
            payload.tree = res.data;
            Store.dispatch("setSubtree", payload).then();
          })
          .catch(err => (this.err = err));
      } else {
        //Normal Addition of members
        Axios.post(
          ProdData.getHostURL() + "/tree/" + this.surname + "/person",
          data
        )
          .then(treeData => {
            this.$emit("close");
            this.$router.push({
              name: "MainTree",
              id: this.surname
            });
            Store.dispatch("treeOnlySetup", treeData.data).then();
          })
          .catch(err => (this.err = err));
      }
    },
    goBack() {
      this.$emit("close");
    }
  }
};
</script>

