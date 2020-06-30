<template>
  <div class="FormData p-5">
    <h3 class="mb-3">{{payload.memData?"Edit":"Add"}} Member</h3>
    <form v-on:submit.prevent="sendData">
      <div class="row">
        <label class="d-none d-sm-block col-md-4">
          <span class="text-warning mr-1">*</span>Short Name:
        </label>
        <input
          type="text"
          class="form-control col-md-7 col-sm-12"
          placeholder="Enter Short Name"
          v-model="data.short_name"
          required
        />
      </div>
      <p class="info">Short Name will be shown in Family Tree</p>
      <div class="row">
        <label class="d-none d-sm-block col-md-4">
          <span class="text-warning mr-1">*</span>Name :
        </label>
        <input
          type="text"
          class="form-control col-md-7 col-sm-12"
          v-model="data.name"
          placeholder="Enter Name"
          required
        />
      </div>

      <!-- payload.gender Selection -->
      <div v-if="type_data=='gender'"></div>
      <div class="row" v-else>
        <div class="form-check col-3 ml-3">
          <input
            class="form-check-input col-3 mt-2"
            type="radio"
            name="gender"
            v-model="data.gender"
            value="1"
            checked
            id="male"
            required
          />
          <label for="male" class="form-check-label ml-2" style="color:black;">Male</label>
        </div>
        <div class="form-check" >
          <input
            class="form-check-input col-3 mt-2"
            type="radio"
            name="gender"
            id="female"
            v-model="data.gender"
            value="0"
          />
          <label for="female" class="form-check-label ml-2" style="color:black;">Female</label>
        </div>
      </div>
      <hr class="mt-4 mb-4" style="background-color:white" />
      <div class="row">
        <label class="col-md-4 d-none d-sm-flex flexy">DOB :</label>
        <md-datepicker class="col-md-7 col-xs-12 cus" v-model="data.dob" :md-model-type="String">
          <label>Date of Birth</label>
        </md-datepicker>
      </div>

      <div class="row mb-2">
        <label class="col-4 flexy" style="color:black;">Is Alive :</label>
        <toggle-button v-model="is_alive" :value="is_alive" :sync="true" class="flexy" />
        <div class="form-inline col-md-6 col-xs-12" v-show="!is_alive">
          <md-datepicker v-model="data.died_on" required="true" class="cus">
            <label>Date of Demise</label>
          </md-datepicker>
        </div>
      </div>

      <div class="row">
        <label class="d-none d-sm-flex col-md-4">Mobile :</label>
        <input
          type="tel"
          class="form-control col-md-7 col-sm-12"
          v-model="data.mobile"
          placeholder="Mobile Number"
        />
      </div>

      <div class="d-flex justify-content-between mt-5">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span class="spinner-border spinner-border-sm" v-show="loading"></span>
          Submit
        </button>
        <button type="button" @click="goBack" class="btn btn-danger">Cancel</button>
      </div>
      <div v-show="is_error" class="mt-3">{{is_error}}</div>
    </form>
  </div>
</template>

<script>
import { ToggleButton } from "vue-js-toggle-button";
import Axios from "axios";
import ProdData from "../data.js";
import Vue from "vue";
import VueMaterial from "vue-material";
import "@/assets/css/vue-material.min.css";

// var emitData;

Vue.use(VueMaterial);

export default {
  components: {
    ToggleButton
  },
  props: ["payload"],
  data() {
    return {
      data: {},
      type_data: this.payload.type,
      loading: false,
      is_error: false,
      is_alive: true
    };
  },
  watch: {
    is_alive() {
      this.data.is_died = !this.is_alive;
    }
  },
  mounted() {
    this.is_alive = true;
    //payload.memData comes from MemberData route for editing
    if (this.payload.memData) {
      // this.payload.memData.dob = this.payload.memData.dob.toString().split("T")[0];
      // console.log(this.payload.memData.dob);
      this.data = this.payload.memData;
      if (this.payload.memData.is_died) {
        this.is_alive = false;
        if (this.payload.memData.died_on) {
          this.data.died_on = this.payload.memData.died_on;
        }
      }
    }
  },
  methods: {
    sendData() {
      this.loading = true;
      if (this.payload.memData) {
        //calls while updating
        Axios.put(
          ProdData.getHostURL() + "/tree/" + this.$route.params.id + "/person",
          this.data
        )
          .then(() => {
            this.goBack();
          })
          .catch(errr => console.log(errr));
      } else {
        if (this.payload.type == "gender") {
          this.data.type = 1;
          if (this.payload.gender == "male") {
            this.data.gender = "1";
          } else {
            this.data.gender = "0";
          }
        } else if (this.payload.type == 1) {
          this.data.type = 2;
        } else if (this.payload.type == 0) {
          this.data.type = 0;
        }
        this.data.parent_id = this.payload.parent_id;
        this.$emit("form-submit", this.data);
      }
    },
    goBack() {
      this.$emit("form-cancel");
    }
  }
};
</script>

<style scoped>
/* .cus.md-field{
  min-height: auto;
  padding-top: 0px;
}
.cus.md-field label{
  top: 5px;
  margin-bottom: 0px;
} */
.flexy {
  display: flex;
  align-items: center;
}
.info {
  margin-top: -10px;
  font-size: 12px;
  color: rgb(160, 160, 160);
}
.form-btns {
  margin-left: -20px;
}
label {
  size: 22px;
  font-weight: bold;
  margin-top: 8px;
}
input {
  margin-bottom: 15px;
}
input[type="radio"] {
  width: 100%;
  height: 1.2em;
}
</style>