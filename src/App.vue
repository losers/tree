<template>
  <div id="app">
    <Drawer @close="toggle" align="right" :closeable="true">
      <div v-if="open">
        <div class="nodeData">
          <h1>{{nodeData.name}}</h1>
          <br />
          <img :src="nodeData.image_url" width="250px" height="250px" />
          <br />
          <table class="table table-borderless table-hover mt-5 table-data">
            <tbody>
              <tr>
                <td>9515792944</td>
              </tr>
              <tr>
                <td>varunkumarmedam@gmail.com</td>
              </tr>
              <tr>
                <td>Super Saiyan Dev in Medam Family</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- <img :src="nodeData."> -->
    </Drawer>

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
import Drawer from "vue-simple-drawer";
import data from "./data.js";

export default {
  name: "app",
  components: {
    TreeChart,
    Drawer
  },
  data() {
    return {
      landscape: [],
      open: false,
      nodeData: null,
      data: data
    };
  },
  mounted() {
    console.log(`data2 : ${this.data}`);
  },
  methods: {
    clickNode: function(node) {
      // eslint-disable-next-line
      console.log(node);
      this.toggle();
      print();
      this.nodeData = node;
    },
    toggle() {
      this.open = !this.open;
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
