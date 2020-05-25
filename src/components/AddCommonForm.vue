<template>
  <div class="FormData p-5">
    <h3 class="mb-3">{{memData?"Edit":"Add"}} Member</h3>
    <form v-on:submit.prevent="sendData">
      <div class="row">
        <label class="col-4">
          <span class="text-warning mr-1">*</span>Short Name:
        </label>
        <input
          type="text"
          class="form-control col-7"
          placeholder="Enter Short Name"
          v-model="data.short_name"
          required
        />
      </div>
      <p class="info">Short Name will be shown in Family Tree</p>
      <div class="row">
        <label class="col-4">
          <span class="text-warning mr-1">*</span>Name :
        </label>
        <input
          type="text"
          class="form-control col-7"
          v-model="data.name"
          placeholder="Enter Name"
          required
        />
      </div>

      <!-- Gender Selection -->
      <div class="row" v-if="(this.$route.params.type != 'a') && (this.$route.params.type != 'b')">
        <div class="form-check col-3 ml-3">
          <input
            class="form-check-input col-2 mt-2"
            type="radio"
            name="gender"
            v-model="data.gender"
            value="1"
            checked
            id="male"
            required
          />
          <label for="male" class="form-check-label ml-2">Male</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input col-3 mt-2"
            type="radio"
            name="gender"
            id="female"
            v-model="data.gender"
            value="0"
          />
          <label for="female" class="form-check-label ml-2">Female</label>
        </div>
      </div>
      <hr class="mt-4 mb-4" style="background-color:white" />
      <div class="row">
        <label class="col-4">DOB :</label>
        <input
          type="date"
          class="form-control col-7"
          v-model="data.dob"
          placeholder="Date of Birth"
        />
      </div>

      <div class="row">
        <label class="col-4">Is Alive</label>
        <toggle-button v-model="is_alive" value="true" :sync="true" class="mb-4" />
        <span class="form-inline" v-show="!is_alive">
          <input
            type="date"
            class="form-control col-10 ml-5"
            v-model="data.died_on"
            placeholder="Died On"
          />
        </span>
      </div>

      <div class="row">
        <label class="col-4">Mobile :</label>
        <input
          type="tel"
          class="form-control col-7"
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

export default {
  components: {
    ToggleButton
  },
  props: ["memData"],
  data() {
    return {
      data: {},
      loading: false,
      is_error: false,
      is_alive: true
    };
  },
  watch: {
    is_alive() {
      this.data.is_alive = this.is_alive;
    }
  },
  mounted() {
    this.is_alive = true;
    //memdata comes from MemberData route for editing
    if (this.memData) {
      this.data = this.memData;
      if (this.memData.is_alive) {
        this.is_alive = true;
        if (this.memData.died_on) {
          this.data.died_on = this.memData.died_on;
        }
      }
    }
  },
  methods: {
    sendData() {
      this.loading = true;
      if (this.memData) {
        //calls while updating
        Axios.put(
          ProdData.getHostURL() + "/tree/" + this.$route.params.id + "/person",
          this.data
        )
          .then(() => {
            this.$emit("close");
            this.$root.$emit("canceled");
            this.$router.push({
              name: "MemberData",
              params: { member: this.memData._id }
            });
          })
          .catch(errr => console.log(errr));
      } else {
        if (this.$route.params.type == "a") {
          this.data.gender = "1";
          this.data.type = 1;
        } else if (this.$route.params.type == "b") {
          this.data.gender = "0";
          this.data.type = 1;
        } else if (this.$route.params.type == 1) {
          this.data.type = 2;
        } else if (this.$route.params.type == 0) {
          this.data.type = 0;
        }
        this.$emit("form-submit", this.data);
      }
    },
    goBack() {
      if (this.memData) {
        this.$emit("close");
        this.$root.$emit("canceled");
        // if (this.$route.query.hasMate) {
        //   console.log(this.$route.query.hasMate);
        //   this.$router.push({
        //     name: "MemberData",
        //     params: { member: this.$route.params.member },
        //     query: { hasMate: true }
        //   });
        //   this.$root.$emit("canceled", true);
        // } else {
        //   console.log("thusss....");
        //   this.$router.push({
        //     name: "MemberData",
        //     params: { member: this.$route.params.member }
        //   });
        //   this.$root.$emit("canceled", false);
        // }
      } else {
        this.$emit("form-cancel");
      }
    }
  }
};
</script>

<style scoped>
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