<template>
  <div class="FormData p-5">
    <h3>Add Member</h3>
    <form v-on:submit.prevent="sendData">
      <div class="row">
        <label class="col-4">Short Name:</label>
        <input
          type="text"
          class="form-control col-7"
          placeholder="Enter Short Name"
          v-model="data.short_name"
          required
        />
      </div>
      <p class="info">Nick Name will be shown in Family Tree</p>
      <div class="row">
        <label class="col-4">Name :</label>
        <input
          type="text"
          class="form-control col-7"
          v-model="data.name"
          placeholder="Enter Name"
          required
        />
      </div>
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
        <label class="col-4">Is Died</label>
        <toggle-button v-model="data.is_died" :sync="true" class="mb-4" />
        <span class="form-inline" v-show="data.is_died">
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
            required
          />
          <label class="form-check-label ml-2">Male</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input col-3 mt-2"
            type="radio"
            name="gender"
            v-model="data.gender"
            value="0"
          />
          <label class="form-check-label ml-2">Female</label>
        </div>
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

export default {
  components: {
    ToggleButton
  },
  props: ["memData"],
  data() {
    return {
      data: {},
      loading: false,
      is_died: null,
      is_error: false
    };
  },
  mounted() {
    //memdata comes from MemberData route for editing
    if (this.memData) {
      console.log("1");
      this.data = this.memData;
      if (this.memData.is_died) {
        console.log(this.memData.is_died);
        this.data.is_died = true;
        if (this.memData.died_on) {
          console.log("3");
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
        console.log(this.memData);
        Axios.put(
          "http://localhost:5000/tree/" + this.$route.params.id + "/person",
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
        console.log(this.data.type);
        this.$emit("form-submit", this.data);
      }
    },
    goBack() {
      if (this.memData) {
        this.$emit("close");
        console.log("test");
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