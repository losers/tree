<template>
  <div class="FormData p-5">
    <h3>
      Creating a Family Tree
      <span v-if="surname">for {{surname}}</span>
    </h3>
    <form v-on:submit.prevent="sendData" v-if="!created">
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
    <div v-if="created">
      Your Family has been created. Go add your members of family to tree.
      <button
        class="btn btn-success"
        @click="goFamily"
      >Start</button>
    </div>
    <div v-else-if="errored">Error Code : {{errored}}</div>
    <button class="btn btn-danger" @click="goBack">close</button>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  name: "AddFamilyForm",
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
      Axios.post("http://localhost:5000/meta/add", {
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
    }
  }
};
</script>

<style scoped>
input {
  margin: 10px;
}
</style>