<template>
  <AddCForm v-on:form-submit="sendData" v-on:form-cancel="goBack" v-on:jst-close="closeme"></AddCForm>
</template>

<script>
import AddCForm from "./AddCommonForm";
import Axios from "axios";

export default {
  name: "AddMemberForm",
  components: {
    AddCForm
  },
  data() {
    return {
      surname: this.$route.params.id,
      type: this.$route.params.type
    };
  },
  methods: {
    sendData(data) {
      data.parent_id = this.$route.query.parent_id;
      data.type = this.type;
      Axios.post("http://localhost:5000/tree/" + this.surname + "/person", data)
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(() => {
          console.log("add member from finally");
          this.$root.$emit("form-saved");
        });
    },
    goBack() {
      this.$emit("close");
      this.$router.go(-1);
      this.$root.$emit("canceled", this.id);
    },
    closeme() {
      this.$emit("close");
    }
  }
};
</script>

