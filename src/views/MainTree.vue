<template>
  <div id="app">
    <router-view></router-view>
    <label>
      <input type="checkbox" v-model="landscape" />
    </label>
    <TreeChart :json="data" :class="{landscape: landscape.length}" @click-node="clickNode" />
    <footer class="foot">
      <p>Satyanarayana Family Dev's</p>
    </footer>
  </div>
</template>

<script>
import TreeChart from "@/components/TreeChart";
import data from "../data.js";

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
      treeName: this.$route.params.id
    };
  },
  mounted() {
    console.log(`data2 : ${this.treeName}`);
  },
  methods: {
    clickNode: function(node) {
      console.log(node);
      this.$router.push({ name: "MemberData", params: { member: node.name } });
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
