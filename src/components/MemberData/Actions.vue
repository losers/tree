<template>
  <div>
    <div class="mx-auto col-12" v-if="hasCookie">
      <button
        @click="addMember(0)"
        class="col-10 btn btn-warning mb-3"
        v-show="!data.parent_id"
      >+ Add Parent</button>

      <button @click="addMember(1)" class="col-10 btn btn-success mb-3">+ Add Child</button>

      <button
        v-show="!hasMate"
        @click="addMember('gender')"
        class="col-10 btn btn-primary mb-3"
      >+ Add {{data.gender=="1"?"Wife":"Husband"}}</button>

      <button @click="deleteSwipe" class="btn btn-danger col-10 mb-3">
        <i class="icofont-ui-delete"></i> Delete
      </button>
    </div>
    <div v-else>
      <span class="col-4">
        <input
          class="form-control input-sm"
          placeholder="Enter Key to Edit"
          v-model="key"
          onkeypress="if(this.value.length==4) return false;"
          type="number"
        />
        <button
          v-show="key.length==4"
          @click="validate"
          class="btn mt-3"
          :class="{'btn-success':!retry, 'btn-warning':retry,}"
          :disabled="vloading"
        >
          <span class="spinner-border spinner-border-sm" v-show="vloading"></span>
          {{retry?"Retry":"Validate"}}
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Store from "@/store/index";
import ProdData from "@/data.js";

export default {
  data() {
    return {
      vloading: false,
      loading:false,
      key: "",
      retry:false,
      hasCookie:this.cookeyStatus,
    };
  },
  props: ["cookeyStatus", "data", "hasMate"],
  methods: {
    addMember(num) {
      this.$emit("actionsAddMember", num);
    },
    deleteSwipe() {
      this.$emit("actionsDeleteSwipe");
    },
    validate() {
      this.vloading = true;
      let sessionUrl = ProdData.getHostURL() + "/sessions/";
      let params = {};
      params.pin = this.key;
      params.surname = this.$route.params.id;
      axios
        .post(sessionUrl, params)
        .then(() => {
          this.hasCookie = true;
          this.vloading = false;
          let sessData = {};
          sessData.status = true;
          sessData.surname = params.surname;
          Store.commit("setSession", sessData);
          this.$emit("keyTrue")
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