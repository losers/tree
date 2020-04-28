<template>
  <div class="FormData p-5">
    <h3 v-if="!created">
      <span>Creating a Family Tree</span>
      <span class="close-btn" @click="goBack">X</span>
      <span v-if="surname">for {{surname}}</span>
    </h3>
    <form v-on:submit.prevent="sendData" v-if="!created">
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
    <div v-if="created">
      <div style="margin-bottom:20px">
        <Tick></Tick>
        <center>
            <h1>Success!</h1>
            <span style="font-size: 20px;">Family tree is created. Start Adding members to your family tree.</span>
        </center>
      </div>
      <center><button class="btn btn-success" @click="goFamily">Go..</button></center>
    </div>
    <div v-else-if="errored">Error Code : {{errored}}</div>
  </div>
</template>

<script>
import Axios from "axios";
import Tick from "./small/tick.vue";

export default {
  name: "AddFamilyForm",
  components: {
    Tick
  },
  data() {
    return {
      surname: null,
      title: null,
      created: false,
      errored: false
    };
  },
  methods: {
    sendData() {
      Axios.post("https://familyapptree.herokuapp.com/meta/add", {
        title: this.title,
        surname: this.surname
      })
        .then(data => {
          this.created = true;
          console.log(data);
        })
        .catch(function(err) {
          this.errored = err;
          console.log(err.response);
        });
    },
    goBack() {
      this.$emit("close");
    },
    goFamily() {
      this.$emit("close");
      this.$router.push({ name: "MainTree", params: { id: this.surname } });
    },
    makeSmall() {
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