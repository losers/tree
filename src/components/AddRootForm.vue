<template>
  <div>
    <AddCForm v-on:form-submit="sendData" :payload="{'is_root':true}" v-on:form-cancel="goBack"></AddCForm>
    <div v-show="err">{{err}}</div>
  </div>
</template>

<script>
import AddCForm from "./AddCommonForm";
import Axios from "axios";
import ProdData from "../data.js";
import Store from "./../store/index";

export default {
  name: "AddRootForm",
  components: {
    AddCForm
  },
  data() {
    return {
      surname: this.$route.params.id,
      err: false
    };
  },
  mounted(){
    Store.dispatch("setStepNumber", 2);
  },
  methods: {
    sendData(data) {
      data.type = 0;
      Axios.post(
        ProdData.getHostURL() + "/tree/" + this.surname + "/person",
        data
      )
        .then(treeData => {
          this.$emit("close");
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