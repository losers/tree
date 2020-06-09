<template>
  <div>
    <AddCForm v-on:form-submit="sendData" v-on:form-cancel="goBack"></AddCForm>
    <div v-show="err">{{err}}</div>
  </div>
</template>

<script>
import AddCForm from "./AddCommonForm";
import Axios from "axios";

import ProdData from "../data.js";

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
  methods: {
    sendData(data) {
      data.type = 0;
      Axios.post(ProdData.getHostURL()+"/tree/" + this.surname + "/person", data)
        .then(() => {
          this.$emit("close");
          this.$router.push({
            name: "MainTree",
            id: this.surname
          });
          this.$root.$emit("update-tree", "added a root member");
        })
        .catch(err => (this.err = err));
    },
    goBack() {
      this.$emit("close");
      this.$router.push({ name: "MainTree", params: { id: this.surname } });
    }
  }
};
</script>