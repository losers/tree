<template>
  <div>
    <h4 class="title">{{ payload.title }}</h4>
    <div class="col-sm-12 padt0 pad15">
      <form v-on:submit.prevent="validate" @keyup.enter.prevent="validate">
        <div class="input-group">
          <input
            class="form-control input-sm"
            placeholder="Enter PIN to unlock"
            v-model="key"
            onkeypress="if(this.value.length==4) return false;"
            type="number"
            max="9999"
            :style="{ '-webkit-text-security': isPinHide ? 'disc' : '' }"
          />
          <div class="input-group-append">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="isPinHide = !isPinHide"
            >
              <i :class="isPinHide ? 'icofont-eye-blocked' : 'icofont-eye'"></i>
            </button>
          </div>
        </div>
        <div v-if="payload.contact" class="contact-box">
          <div class="contact">Contact Details :</div>
          <div v-if="payload.contact && payload.contact.email">
            Name : {{ payload.contact.name }}
          </div>
          <div v-if="payload.contact && payload.contact.email">
            Email : {{ payload.contact.email }}
          </div>
        </div>
        <button
          type="submit"
          class="btn mt-3"
          :class="{ 'btn-success': !retry, 'btn-warning': retry }"
          :disabled="vloading || key.length !== 4"
        >
          <span
            class="spinner-border spinner-border-sm"
            v-show="vloading"
          ></span>
          {{ retry ? "Retry" : "Validate" }}
        </button>

        <button @click="goBack" class="btn mt-3 btn-default float-right">
          Cancel
        </button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.contact-box {
  border: 1px solid lightgrey;
  margin-top: 20px;
  padding: 20px;
  border-radius: 5px;
  background: #fcfcfc;
  color: #9c9c9c;
  margin-bottom: 20px;
}
.contact-box > .contact {
  font-weight: bold;
  margin-bottom: 10px;
}
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
      vloading: false,
      isPinHide: true,
    };
  },
  methods: {
    goBack() {
      this.$emit("close");
    },
    validate() {
      if (this.key.length == 4) {
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
    },
  },
};
</script>