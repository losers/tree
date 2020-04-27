<template>
  <div class="FormData p-5">
    <h3>Add Member</h3>
    <form v-on:submit.prevent="sendData">
      <div class="form-inline">
        <label for="nickname">Short Name :</label>
        <input
          type="text"
          class="form-control"
          id="nickname"
          placeholder="Enter Short Name"
          v-model="data.short_name"
          required
        />
      </div>
      <small id="nickname" class="form-text text-muted">Nick Name will be shown in Family Tree</small>
      <div class="form-inline">
        <label>Name :</label>
        <input
          type="text"
          class="form-control"
          v-model="data.name"
          placeholder="Enter Name"
          required
        />
      </div>
      <div class="form-inline">
        <label>DOB : </label>
        <input type="date" class="form-control" v-model="data.dob" placeholder="Date of Birth" />
      </div>
      <div class="form-inline">
        <label class="mr-3">Is Died </label>
        <toggle-button v-model="data.is_alive" />
        <span class="form-inline" v-show="data.is_alive">
          <input type="date" class="form-control" v-model="data.died_on" placeholder="Died On" />
        </span>
      </div>

      <div class="form-inline">
        <label for="mobile">Mobile :</label>
        <input type="tel" class="form-control" v-model="data.mobile" placeholder="Mobile Number" />
      </div>
      <!-- Gender Selection -->
      <div class="form-inline">
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="gender"
            v-model="data.gender"
            checked
            value="1"
          />
          <label class="form-check-label ml-2">Male</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input ml-5"
            type="radio"
            name="gender"
            v-model="data.gender"
            value="0"
          />
          <label class="form-check-label ml-2">Female</label>
        </div>
      </div>
      <div v-if="form_saved">
        <div class="d-flex content-justify-between"><h4>Form Saved Successfully</h4>
        <tick></tick>
        </div>
        
        <button @click="goHome">See tree</button>
        <button type="reset" @click="form_saved=false;data={}">Add another child</button>
        <button @click="goBack">GO Back</button>
      </div>
      <div v-else class="d-flex justify-content-between">
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

export default {
  components: {
    ToggleButton,
    Tick
  },
  data() {
    return {
      data: {},
      loading: false,
      form_saved: false
    };
  },
  mounted() {
    this.$root.$on("form-saved", () => {
      this.form_saved = true;
      this.loading = false;
    });
  },
  methods: {
    sendData() {
      this.loading = true;
      this.$emit("form-submit", this.data);
    },
    goBack() {
      this.$emit("form-cancel");
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
label {
  size: 22px;
  font-weight: bold;
  margin: 15px 0;
}
input {
  margin-left: 20px;
}
</style>