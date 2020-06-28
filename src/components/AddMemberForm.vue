<template>
  <div>
    <AddCForm
      v-on:form-submit="sendData"
      v-on:form-cancel="goBack"
      :payload="payload"
      :type="type"
      :parent_id="parent_id"
      :gender="gender"
      :memData="memData"
    ></AddCForm>
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
  props: ["payload","type", "gender", "parent_id","memData"],
  data() {
    return {
      surname: this.$route.params.id,
      err: false
    };
  },
  methods: {
    sendData(data) {
      // data.parent_id = this.$route.query.parent_id;
      Axios.post(
        ProdData.getHostURL() + "/tree/" + this.surname + "/person", data ) .then(treeData => { 
          this.$emit("close");
          this.$router.push({
            name: "MainTree",
            id: this.surname
          });
          Store.dispatch("treeOnlySetup", treeData.data).then();
        })
        .catch(err => (this.err = err));
    },
    goBack() {
      this.$emit("close");
    }
  }
};
</script>

