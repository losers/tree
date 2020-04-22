<template>
  <div class="FormData p-5">
    <h3>
      Adding
      <span v-if="type==0">Children</span>
      <span v-else>Mate</span>
      to {{id}} ,
    </h3>
    <form v-on:submit.prevent="sendData">
      <div class="form-inline">
        <label for="nickname">Nick Name :</label>
        <input
          type="text"
          class="form-control"
          id="nickname"
          placeholder="Enter Nick Name"
          v-model="nickname"
          required
        />
      </div>
      <small id="nickname" class="form-text text-muted">Nick Name will be shown in Family Tree</small>
      <div class="form-inline">
        <label>Name :</label>
        <input type="text" class="form-control" v-model="name" placeholder="Enter Name" required />
      </div>
      <div class="form-inline">
        <input type="date" class="form-control" v-model="date" />
      </div>
      <div class="form-inline">
        <toggle-button v-model="isAlive" labels="{checked: 'Live', unchecked: 'Died'}" />
        <span class="form-inline" v-show="isAlive">
          <input type="date" class="form-control" v-model="diedOn" />
        </span>
      </div>

      <div class="form-inline">
        <label for="mobile">Mobile :</label>
        <input type="tel" class="form-control" v-model="mobile" placeholder="Mobile Number" />
      </div>
      <!-- Gender Selection -->
      <div class="form-inline">
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="gender"
            v-model="gender"
            value="m"
            checked
          />
          <label class="form-check-label ml-2">Male</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input ml-5"
            type="radio"
            name="gender"
            v-model="gender"
            value="f"
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
  name: "AddMemberForm",
  components: {
    ToggleButton
  },
  data() {
    return {
      nickname: null,
      name: null,
      date: null,
      isAlive: true,
      diedOn: null,
      mobile: null,
      gender: null,
      id: this.$route.params.member,
      type: this.$route.params.type
    };
  },
  mounted() {},
  methods: {
    sendData() {},
    goBack() {
      this.$emit("close");
      this.$router.go(-1);
      this.$root.$emit("canceled"); //like this
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