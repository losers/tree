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
              <tr> <td>9515792944</td> </tr> <tr> <td>varunkumarmedam@gmail.com</td> </tr> <tr> <td>Super Saiyan Dev in Medam Family</td> </tr>
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
      data: {
        name: "root",
        mate: {
          name: "mate",
          image_url: "assets/logo.png"
        },

        image_url: "https://static.refined-x.com/static/avatar.jpg",
        children: [
          {
            name: "children1",
            image_url: "https://static.refined-x.com/static/avatar.jpg"
          },
          {
            name: "children3",
            image_url: "https://static.refined-x.com/static/avatar.jpg"
          },
          {
            name: "children2",
            image_url: "https://static.refined-x.com/static/avatar.jpg",
            mate: {
              name: "mate",
              image_url: "https://static.refined-x.com/static/avatar.jpg"
            },
            children: [
              {
                name: "grandchild",
                image_url: "https://static.refined-x.com/static/avatar.jpg"
              },
              {
                name: "grandchild2",
                image_url: "https://static.refined-x.com/static/avatar.jpg"
              },
              {
                name: "grandchild3",
                image_url: "https://static.refined-x.com/static/avatar.jpg",
                children: [
                  {
                    name: "grandchild",
                    image_url: "https://static.refined-x.com/static/avatar.jpg"
                  },
                  {
                    name: "grandchild",
                    image_url: "https://static.refined-x.com/static/avatar.jpg"
                  },
                  {
                    name: "grandchild",
                    image_url: "https://static.refined-x.com/static/avatar.jpg"
                  }
                ]
              }
            ]
          }
        ]
      }
    };
  },
  methods: {
    clickNode: function(node) {
      // eslint-disable-next-line
      console.log(node);
      this.toggle();
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
  bottom: 0;
  width: 100%;
  background: #333;
  padding: 10px;
  overflow: hidden;
  color: #999;
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
.table-data{
  color:white
}
</style>
