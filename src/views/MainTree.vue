<template>
  <div id="app">
    <!-- All errors are handeled here -->
    <section v-if="errored">
      <p>{{errored.response.data}}</p>
    </section>

    <!-- Loads when a tree is found -->
    <section v-else>
      <router-view></router-view>
      <div v-if="loading">Loading...</div>

      <!-- Called When No data is found -->
      <div v-else-if="tempData==undefined">
        Lets create the tree
        <br />
        <button @click="createRoot">Add Parent</button>
      </div>

      <!-- Displays Tree Map -->
      <div v-else>
        <label>
          <input type="checkbox" v-model="landscape" />
        </label>
        <TreeChart :json="tempData" :class="{landscape: landscape.length}" @click-node="clickNode" />
        <footer class="foot">
          <p>Satyanarayana Family Dev's</p>
        </footer>
      </div>
    </section>
  </div>
</template>

<script>
import TreeChart from "@/components/TreeChart";
// import data from "../data.js";
import axios from "axios";

export default {
  name: "MainTree",
  components: {
    TreeChart
  },
  data() {
    return {
      landscape: [],
      // data: data,
      surname: this.$route.params.id,
      loading: true,
      tempData: null,
      errored: false
    };
  },
  mounted() {
    axios
      .get("http://localhost:5000/tree/" + this.surname)
      .then(data => {
        this.tempData = data.data.tree;
        console.log("got data");
        console.log(data.data.tree);
      })
      .catch(err => {
        this.errored = err;
        console.log("Error : " + err);
      })
      .finally(() => {
        this.loading = false;
      });

    //called after adding a new member
    this.$root.$on("update-tree", data => {
      this.$router.go();
      console.log("tree is updatingooo" + data);
    });
  },
  methods: {
    // Called when a node is clicked
    clickNode: function(node) {
      if (node.data.mate || node.isMate) {
        console.log("mat");
        this.$router.push({
          name: "MemberData",
          params: { member: node.data.id },
          query: { hasMate: true }
        });
      } else {
        console.log("nomate");
        this.$router.push({
          name: "MemberData",
          params: { member: node.data.id }
        });
      }
    },

    // Called when tree is empty
    createRoot: function() {
      this.$router.push({
        name: "AddRoot"
      });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#app .avat {
  border-radius: 2em;
  border-width: 2px;
}
#app .name {
  font-weight: 700;
}
.foot {
  position: fixed;
  left: 0;
  bottom: -20px;
  width: 100%;
  background: #333;
  padding: 10px;
  overflow: hidden;
  color: white;
  font-size: 14px;
  text-align: center;
  z-index: 10;
}
.foot a {
  color: #fff;
  margin: 0 0.5em;
}
.table-data {
  color: white;
}
</style>
