<template>
  <div>
    <AddCForm v-on:form-submit="sendData" v-on:form-cancel="goBack" v-on:jst-close="closeme"></AddCForm>
    <div v-show="err">{{err}}</div>
  </div>
</template>

<script>
import AddCForm from "./AddCommonForm";
import Axios from "axios";
import ProdData from "../data.js";

export default {
  name: "AddMemberForm",
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
      console.log(data.type);
      data.parent_id = this.$route.query.parent_id;
      Axios.post(ProdData.getHostURL()+"/tree/" + this.surname + "/person", data)
        .then(() => {
          this.$emit("close");
          this.$router.push({
            name: "MainTree",
            id: this.surname
          });
          this.$root.$emit("update-tree", "added a new member");
        })
        .catch(err => (this.err = err));
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

