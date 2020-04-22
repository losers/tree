<template>
  <div>
    <section v-if="errored">
      <p>{{err}}</p>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <!-- <router-link :to="{ name: 'AddFamily'}">Add Family</router-link> -->
        <button @click="callMe =! callMe">Click Me</button>
        <AddFamily v-if="callMe"></AddFamily>
        <h1>Welcome to Losers Family</h1>
        <div v-for="data in info" :key="data.id">
          <div class="container jumbotron">
            <ul>
              <li>
                <router-link :to="{name:'MainTree', params:{id:data.surname}}">{{data.title}}</router-link>
              </li>
              <li>Surname : {{data.surname}}</li>
            </ul>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import AddFamily from "../modals/AddFamily";
export default {
  data() {
    return {
      info: null,
      loading: true,
      errored: false,
      err: null,
      callMe: false
    };
  },
  components: {
    AddFamily
  },
  methods: {
    addFamily() {
      console.log("adding family");
    }
  },
  mounted() {
    axios
      .get("http://localhost:5000/meta")
      .then(response => {
        this.info = response.data;
      })
      .catch(error => {
        this.err = error;
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.loading = false));
  }
};
</script>