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
        <input type="date" class="form-control" v-model="data.dob" />
      </div>
      <div class="form-inline">
        <toggle-button v-model="data.is_alive"/>
        <span class="form-inline" v-show="data.is_alive">
          <input type="date" class="form-control" v-model="data.died_on" />
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
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    <button @click="goBack" class="btn btn-danger">Cancel</button>
  </div>
</template>

<script>
import { ToggleButton } from "vue-js-toggle-button";

export default {
  components: {
    ToggleButton
  },
  data() {
    return {
      data: {}
    };
  },
  methods: {
    sendData() {
      this.$emit("form-submit", this.data);
    },
    goBack() {
      this.$emit("form-cancel");
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