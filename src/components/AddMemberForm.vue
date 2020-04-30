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
      surname: this.$route.params.id
    };
  },
  methods: {
    sendData(data) {
      data.parent_id = this.$route.query.parent_id;
      Axios.post("http://localhost:5000/tree/" + this.surname + "/person", data)
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(() => {
          console.log("add member from finally");
          this.$root.$emit("form-saved", data.type);
        });
    },
    goBack(mateAdded) {
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
      this.$root.$emit("canceled", mateAdded);
    },
    closeme() {
      this.$emit("close");
    }
  }
};
</script>

