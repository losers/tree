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
        <toggle-button v-model="data.is_alive" class="mb-4" />
        <span class="form-inline" v-show="data.is_alive">
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
      <div
        class="row"
        v-if="(this.$route.params.type != 'a') && (this.$route.params.type != 'b') && (newchild)"
      >
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

      <div v-if="form_saved" class="mt-5">
        <tick class="float-right"></tick>
        <h4 class="mb-3">Form Saved Successfully</h4>
        <div class="d-flex justify-content-around form-btns">
          <button @click="goHome" class="btn btn-success">See tree</button>
          <button
            type="reset"
            @click="form_saved=false;data={};newchild=true;"
            class="btn btn-warning"
          >Add Another Child</button>
          <button @click="goBack" class="btn btn-danger">Close</button>
        </div>
      </div>
      <div v-else class="d-flex justify-content-between mt-5">
        <button type="submit" class="btn btn-primary">
          <span class="spinner-border spinner-border-sm" v-show="loading"></span>
          Submit
        </button>
        <button @click="goBack" class="btn btn-danger">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ToggleButton } from "vue-js-toggle-button";
import Tick from "./small/tick";
import Axios from "axios";

export default {
  components: {
    ToggleButton,
    Tick
  },
  props: ["memData"],
  data() {
    return {
      data: {},
      loading: false,
      form_saved: false,
      newchild: true,
      mateAdded: false //this is used to close addmate btn in MemberData Route
    };
  },
  mounted() {
    //memdata comes from MemberData route for editing
    if (this.memData) {
      this.data = this.memData;
    }

    //this will listens when to stop spinning action
    this.$root.$on("form-saved", tempType => {
      if (tempType == 1) {
        this.mateAdded = true;
      }
      this.form_saved = true;
      this.loading = false;
    });
  },
  methods: {
    sendData() {
      this.loading = true;
      if (this.memData) {
        Axios.put(
          "http://localhost:5000/tree/" + this.$route.params.id + "/person",
          this.data
        )
          .catch(errr => console.log(errr))
          .finally(() => {
            this.$emit("close");
            this.$router.push({
              name: "MemberData",
              params: { member: this.memData._id }
            });
          });
      } else {
        if (this.$route.params.type == "a") {
          this.data.gender = "1";
          this.data.type = 1;
        } else if (this.$route.params.type == "b") {
          this.data.gender = "0";
          this.data.type = 1;
        } else if (this.$route.params.type == 1) {
          this.data.type = 2;
        }
        this.$emit("form-submit", this.data);
      }
    },
    goBack() {
      if (this.memData) {
        this.$emit("close");
        this.$root.$emit("canceled");
      } else {
        this.$emit("form-cancel", this.mateAdded);
      }
    },
    goHome() {
      this.$emit("jst-close");
      this.$router.push({
        name: "MainTree",
        params: { id: this.$route.params.id }
      });
      this.$root.$emit("update-tree", "new tree data");
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