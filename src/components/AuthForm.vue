<template>
  <div>
    <h4 class="title">{{payload.title}}</h4>
    <div class="col-sm-12 padt0 pad15">
      <input
        class="form-control input-sm"
        placeholder="Enter PIN to unlock"
        v-model="key"
        onkeypress="if(this.value.length==4) return false;"
        type="number"
      />
      <button
        @click="validate"
        class="btn mt-3"
        :class="{'btn-success':!retry, 'btn-warning':retry,}"
        :disabled="vloading || key.length!==4"
      >
        <span class="spinner-border spinner-border-sm" v-show="vloading"></span>
        {{retry?"Retry":"Validate"}}
      </button>

      <button @click="goBack" class="btn mt-3 btn-default float-right">Cancel</button>
    </div>
  </div>
</template>
<style scoped>
.title {
  padding: 15px;
  margin-bottom: 0px;
}
.pad15 {
  padding: 0px 15px 15px 15px;
}
.btn-default {
  border: 1px solid black;
}
</style>
<script>
import ProdData from "@/data.js";
import Store from "@/store/index";
import axios from "axios";

export default {
  name: "AuthForm",
  props: ["payload"],
  data() {
    return {
      key: "",
      retry: false,
      vloading: false
    };
  },
  methods: {
    goBack() {
      this.$emit("close");
    },
    validate() {
      this.vloading = true;
      localStorage.pinner = true;
      let sessionUrl = ProdData.getHostURL() + "/sessions/";
      let params = {};
      params.pin = this.key;
      params.surname = this.payload.surname;
      axios
        .post(sessionUrl, params)
        .then(() => {
          this.hasCookie = true;
          this.vloading = false;
          let sessData = {};
          sessData.status = true;
          sessData.surname = params.surname;
          location.href = `/app/${sessData.surname}`;
          Store.commit("setSession", sessData);
          this.goBack();
        })
        .catch(() => {
          this.retry = true;
        })
        .finally(() => {
          this.vloading = false;
        });
    }
  }
};
</script>