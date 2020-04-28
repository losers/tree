<template>
  <div>
    <AddCForm v-on:form-submit="sendData" v-on:form-cancel="goBack"></AddCForm>
  </div>
</template>

<script>
import AddCForm from "./AddCommonForm";
import Axios from "axios";

export default {
  name: "AddRootForm",
  components: {
    AddCForm
  },
  data() {
    return {
      surname: this.$route.params.id
    };
  },
  methods: {
    sendData(data) {
      data.type = 0;
      Axios.post("https://familyapptree.herokuapp.com/tree/" + this.surname + "/person", data)
        .then(data => console.log(data))
        .catch(errr => console.log(errr))
        .finally(() => {
          this.goBack();
          this.$root.$emit("update-tree", "calling after adding root parent");
        });
    },
    goBack() {
      console.log("goback called");
      this.$emit("close");
      this.$router.push({ name: "MainTree", params: { id: this.surname } });
    }
  }
};
</script>