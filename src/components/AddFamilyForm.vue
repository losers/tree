<template>
  <div class="FormData p-5">
    <h3 v-if="!created">
      <span>Creating a Family Tree</span>
      <span class="close-btn" @click="goBack">x</span>
      <span v-if="surname">for {{surname}}</span>
    </h3>
    <form v-on:submit.prevent="sendData" v-if="!created">
      <div class="form-inline row">
        <label class="col" style="justify-content:left">Display Title :</label>
        <input
          type="text"
          class="form-control col-sm-8"
          id="title"
          placeholder="Display Title"
          required
          v-model="title"
        />
      </div>
      <div class="form-inline row">
        <label for="nickname" class="col" style="justify-content:left">Surname :</label>
        <input
          v-model="surname"
          type="text"
          class="form-control col-sm-8"
          id="surname"
          :disabled="metadata"
          placeholder="Enter Surname"
          @input="makeSmall"
          required
        />
      </div>
      <button
        type="submit"
        class="btn btn-success"
        style="margin-top: 30px;display: flex;align-items: center;"
      >
        <span class="spinner-border spinner-border-sm" v-show="loading" style="margin-right: 8px;"></span>
        <span>{{metadata?"Update":"Create"}}</span>
      </button>
    </form>
    <div v-if="created">
      <div style="margin-bottom:20px">
        <center>
          <Tick></Tick>
        </center>
        <center>
          <h1>Success!</h1>
          <span
            style="font-size: 20px;"
          >Family tree is created. Start Adding members to your family tree.</span>
        </center>
      </div>
      <center>
        <button class="btn btn-success" @click="goFamily">Go..</button>
      </center>
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
  props: ["metadata"],
  data() {
    return {
      surname: null,
      title: null,
      created: false,
      errored: false,
      loading: false
    };
  },
  mounted() {
    (this.surname = this.metadata.surname), (this.title = this.metadata.title);
  },
  methods: {
    sendData() {
      this.loading = true;
      if (this.metadata) {
        Axios.put("http://localhost:5000/meta/update", {
          title: this.title,
          _id: this.metadata._id,
          created_at: this.metadata.created_at
        })
          .catch(err => (this.errored = err))
          .finally(() => {
            this.loading = false;
            this.$emit("close");
          });
      } else {
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
          })
          .finally(() => (this.loading = false));
      }
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
  margin-top: -31px;
  margin-right: -18px;
  cursor: pointer;
}
</style>