<template>
  <div class="FormData p-5">
    <h3>
      Creatingdsa a Family Tree
      <span v-if="surname">for {{surname}}</span>
    </h3>
    <form v-on:submit.prevent="sendData" v-if="!created1">
      <div class="form-inline">
        <label>Family Title :</label>
        <input
          type="text"
          class="form-control"
          id="title"
          placeholder="Family Title"
          required
          v-model="title"
        />
      </div>
      <div class="form-inline">
        <label for="nickname">Surname :</label>
        <input
          v-model="surname"
          type="text"
          class="form-control"
          id="surname"
          placeholder="Enter Surname"
          required
        />
      </div>
      <button type="submit" class="btn btn-success">Submit</button>
    </form>
    <div v-if="created1">
      Your Family has been created. Go add your members of family to tree.
      <button
        class="btn btn-success"
        @click="goFamily"
      >Start</button>
    </div>
    <button class="btn btn-danger" @click="goBack">close</button>
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
      this.$router.go(-1);
    },
    goFamily() {
      this.$emit("close");
      this.$router.push({ name: "MainTree", params: { id: this.surname } });
    }
  }
};
</script>

<style scoped>
input {
  margin: 10px;
}
</style>