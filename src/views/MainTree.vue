<template>
  <div id="app">
    <section v-if="errored">
      <p>{{errored}}</p>
    </section>

    <section v-else>
      <div v-if="loading">Loading...</div>

      <!-- Called When No data in root -->
      <div v-else-if="tempData==undefined">
        Lets create the tree
        <br />
        <button @click="createRoot">Add Parent</button>
        <router-view></router-view>
      </div>

      <!-- Displays Tree Map -->
      <div v-else>
        <router-view></router-view>
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
import data from "../data.js";
import axios from "axios";

export default {
  name: "MainTree",
  components: {
    TreeChart
  },
  data() {
    return {
      landscape: [],
      open: false,
      nodeData: null,
      data: data,
      treeName: this.$route.params.id,
      loading: true,
      tempData: null,
      errored: false,
      myData: {
        name: "varun"
      }
    };
  },
  mounted() {
    axios
      .get("http://localhost:5000/tree/" + this.treeName)
      .then(data => {
        this.tempData = data.data.tree;
        console.log(data.data.tree);
      })
      .catch(err => {
        this.errored = err;
        console.log("Error : " + err);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    clickNode: function(node) {
      console.log(node);
      this.$router.push({
        name: "MemberData",
        params: { member: node.id },
        query: { hasMate: node.mate ? true : false }
      });
    },
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
.nodeData {
  width: 300px !important;
}
.table-data {
  color: white;
}
</style>
