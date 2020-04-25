<template>
  <div class="FormData p-5">
    <h3 v-if="!created1">
      <span>Creating a Family Tree</span>
      <span class="close-btn" @click="goBack">X</span>
      <span v-if="surname"> for {{surname}}</span>
    </h3>
    <form v-on:submit.prevent="sendData" v-if="!created1">
      <div class="form-inline row">
        <label class="col-sm">Display Title :</label>
        <input
          type="text"
          class="form-control col-sm"
          id="title"
          placeholder="Display Title"
          required
          v-model="title"
        />
      </div>
      <div class="form-inline row">
        <label for="nickname" class="col">Surname :</label>
        <input
          v-model="surname"
          type="text"
          class="form-control col"
          id="surname"
          placeholder="Enter Surname"
          @input="makeSmall"
          required
        />
      </div>
      <center style="margin-bottom: 20px;font-size: 20px;">
        <button type="submit" class="btn btn-success">Create +</button>
      </center>
    </form>
    <div v-if="created1">
      <div style="margin-bottom:20px">
        <span style="color:green">&#9989;</span> Success! Family tree is created. Start Adding members to your family tree.
      </div>
      <button
        class="btn btn-success"
        @click="goFamily"
      >Go..</button>
    </div>
    <!-- <button class="btn btn-danger" >close</button> -->
  </div>
</template>

<script>
import Axios from "axios";
// import axios from "axios";
export default {
  name: "AddFamilyForm",
  data() {
    return {
      values: {},
      surname: null,
      title: null,
      new: true,

      created1: false,
      loading: false,
      errored: false
    };
  },
  methods: {
    sendData() {
      this.new = false;
      Axios.post("http://localhost:5000/meta/add", {
        title: this.title,
        surname: this.surname
      })
        .then(data => {
          this.created1 = true;
          console.log(data);
        })
        .catch(function(err) {
          console.log(err.response);
        })
        .finally(() => (this.loading = false));
      //   console.log(data);
    },
    goBack() {
      this.$emit("close");
      //   this.$router.go(-1);
    },
    goFamily() {
      this.$emit("close");
      this.$router.push({ name: "MainTree", params: { id: this.surname } });
    },
    makeSmall(){
      this.surname = this.surname.toLowerCase();
      this.surname = this.surname.split(" ").join("");
    }
  }
};
</script>

<style scoped>
input {
  margin: 10px;
}

.close-btn {
  float: right;
  color: red;
  font-weight: bolder;
  font-size: 27px;
  margin-top: -20px;
  margin-right: -11px;
  cursor: pointer;
}
</style>