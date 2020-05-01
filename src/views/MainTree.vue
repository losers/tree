<template>
  <div id="app">
    <!-- All errors are handeled here -->
    <section v-if="errored">
      <!-- <p>{{errored.response.data}}</p> -->
      <error :msg="errored.response.data"></error>
    </section>

    <!-- Loads when a tree is found -->
    <section v-else>
      <router-view></router-view>
      <router-link :to="{name:'Home'}" class="float-left mt-3 ml-1">
        <i class="icofont-arrow-left"></i>
        Back
      </router-link>
      <div v-if="loading" style="padding-top:240px">
        <center>
          <img src="@/assets/dna.gif" />
        </center>
      </div>

      <!-- Called When No data is found -->
      <div v-else-if="tempData==undefined">
        <TreeTitle :meta="title[0]"></TreeTitle>
        <img src="../assets/family_bg.jpg" class="col-7 mt-0" />
        <center>
          <div class="row">
            <div class="col-3"></div>
            <ul class="col-8">
              <li>
                <div class="d-flex content-justify-left ml-2">
                  Add Members in a Top Down Manner
                  <br />E.g : Grand Father -> Father -> Child
                </div>
              </li>
              <li>
                <h3
                  class="d-flex content-justify-left ml-2"
                >Share your tree to your family members to collaborate</h3>
              </li>
            </ul>
          </div>
        </center>
        <div id="wrapper">
          <button @click="createRoot" class="my-super-cool-btn">
            <div class="dots-container">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
            <span style="color:#0039A9">Add!</span>
          </button>
        </div>
      </div>

      <!-- Displays Tree Map -->
      <div v-else>
        <TreeTitle :meta="title[0]"></TreeTitle>
        <center>
          <TreeChart
            :json="tempData"
            :images="images"
            :class="{landscape: landscape.length}"
            @click-node="clickNode"
          />
        </center>
        <footer class="foot">
          <p>
            With
            <i class="icofont-heart" style="color:red"></i>
            by
            <a href="/medam">Satyanarayana Family Dev's</a>
          </p>
        </footer>
      </div>
    </section>
  </div>
</template>

<script>
import TreeChart from "@/components/TreeChart";
import data from "../data.js";
import axios from "axios";
import TreeTitle from "../components/TreeTitle";
import Error from "./Error";

export default {
  name: "MainTree",
  components: {
    TreeChart,
    TreeTitle,
    Error
  },
  data() {
    return {
      landscape: [],
      data: data,
      surname: this.$route.params.id,
      loading: true,
      tempData: null,
      errored: false,
      images: {},
      title: null
    };
  },
  mounted() {
    axios
      .get(
        "http://localhost:5000/tree/" +
          this.surname +
          "/person/" +
          this.id +
          "/images"
      )
      .then(data => {
        this.images = data.data[0];
        axios
          .get("http://localhost:5000/tree/" + this.surname)
          .then(data => {
            this.tempData = data.data.tree;
            this.title = data.data.meta;
          })
          .catch(err => {
            this.errored = err;
            console.log("Error : " + err);
          })
          .finally(() => {
            this.loading = false;
          });
      })
      .catch(err => {
        this.errored = err;
        console.log("Error : " + err);
      });

    //called after adding a new member
    this.$root.$on("update-tree", data => {
      console.log(data);
      this.$router.go();
    });
  },
  methods: {
    // Called when a node is clicked
    clickNode: function(node) {
      if (node.data.mate || node.isMate) {
        this.$router.push({
          name: "MemberData",
          params: { member: node.data.id },
          query: { hasMate: true }
        });
      } else {
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
a:hover {
  text-decoration: none !important;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
#app .avat {
  border-radius: 2em;
  border-width: 2px;
}
#app .name {
  font-weight: 700;
}
h2 {
  font-family: "Comfortaa", cursive;
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
li > h3 {
  /* background-image: linear-gradient(#0039a9, #d9dee9); */
  /* background: linear-gradient(right, #eee, #333); */
  color: #0039a9;
  background-clip: text;
  font-weight: 600;
  font-family: "Comfortaa", cursive;
  /* -webkit-text-fill-color: transparent; */
}
#wrapper {
  width: 100vw;
  height: 120px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.my-super-cool-btn {
  background-color: Transparent;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  position: relative;
  text-decoration: none;
  letter-spacing: 1px;
  font-size: 2rem;
  box-sizing: border-box;
}
.my-super-cool-btn span {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
}
.my-super-cool-btn span:before {
  content: "";
  width: 75%;
  height: 75%;
  display: block;
  position: absolute;
  border-radius: 100%;
  border: 7px solid #0039a9;
  box-sizing: border-box;
  transition: all 0.85s cubic-bezier(0.25, 1, 0.33, 1);
  -webkit-box-shadow: 9px 10px 38px -19px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 9px 10px 38px -19px rgba(0, 0, 0, 0.75);
  box-shadow: 9px 10px 38px -19px rgba(0, 0, 0, 0.75);
  /* box-shadow: 0 30px 85px rgba(0, 0, 0, 0.14), 0 15px 35px rgba(0, 0, 0, 0.14); */
}
.my-super-cool-btn:hover span:before {
  transform: scale(0.8);
  -webkit-box-shadow: 9px 10px 38px -19px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 9px 10px 38px -19px rgba(0, 0, 0, 0.75);
  box-shadow: 9px 10px 38px -19px rgba(0, 0, 0, 0.75);
  /* box-shadow: 0 20px 55px rgba(0, 0, 0, 0.14), 0 15px 35px rgba(0, 0, 0, 0.14); */
}
.my-super-cool-btn .dots-container {
  opacity: 0;
  animation: intro 1.6s;
  animation-fill-mode: forwards;
}
.my-super-cool-btn .dot {
  width: 8px;
  height: 8px;
  display: block;
  background-color: #0039a9;
  border-radius: 100%;
  position: absolute;
  transition: all 0.85s cubic-bezier(0.25, 1, 0.33, 1);
}
.my-super-cool-btn .dot:nth-child(1) {
  top: 25px;
  left: 25px;
  transform: rotate(-140deg);
  animation: swag1-out 0.3s;
  animation-fill-mode: forwards;
  opacity: 0;
}
.my-super-cool-btn .dot:nth-child(2) {
  top: 50px;
  right: 50px;
  transform: rotate(140deg);
  animation: swag2-out 0.3s;
  animation-fill-mode: forwards;
  opacity: 0;
}
.my-super-cool-btn .dot:nth-child(3) {
  bottom: 50px;
  left: 50px;
  transform: rotate(140deg);
  animation: swag3-out 0.3s;
  animation-fill-mode: forwards;
  opacity: 0;
}
.my-super-cool-btn .dot:nth-child(4) {
  bottom: 50px;
  right: 50px;
  transform: rotate(-140deg);
  animation: swag4-out 0.3s;
  animation-fill-mode: forwards;
  opacity: 0;
}
.my-super-cool-btn:hover span {
  font-size: 1.5rem;
}
.my-super-cool-btn:hover .dot:nth-child(1) {
  animation: swag1 0.3s;
  animation-fill-mode: forwards;
}
.my-super-cool-btn:hover .dot:nth-child(2) {
  animation: swag2 0.3s;
  animation-fill-mode: forwards;
}
.my-super-cool-btn:hover .dot:nth-child(3) {
  animation: swag3 0.3s;
  animation-fill-mode: forwards;
}
.my-super-cool-btn:hover .dot:nth-child(4) {
  animation: swag4 0.3s;
  animation-fill-mode: forwards;
}
@keyframes intro {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes swag1 {
  0% {
    top: 50px;
    left: 50px;
    width: 8px;
  }
  50% {
    width: 30px;
    opacity: 1;
  }
  100% {
    top: 20px;
    left: 20px;
    width: 8px;
    opacity: 1;
  }
}
@keyframes swag1-out {
  0% {
    top: 20px;
    left: 20px;
    width: 8px;
  }
  50% {
    width: 30px;
    opacity: 1;
  }
  100% {
    top: 50px;
    left: 50px;
    width: 8px;
    opacity: 0;
  }
}
@keyframes swag2 {
  0% {
    top: 50px;
    right: 50px;
    width: 8px;
  }
  50% {
    width: 30px;
    opacity: 1;
  }
  100% {
    top: 20px;
    right: 20px;
    width: 8px;
    opacity: 1;
  }
}
@keyframes swag2-out {
  0% {
    top: 20px;
    right: 20px;
    width: 8px;
  }
  50% {
    width: 30px;
    opacity: 1;
  }
  100% {
    top: 50px;
    right: 50px;
    width: 8px;
    opacity: 0;
  }
}
@keyframes swag3 {
  0% {
    bottom: 50px;
    left: 50px;
    width: 8px;
  }
  50% {
    width: 30px;
    opacity: 1;
  }
  100% {
    bottom: 20px;
    left: 20px;
    width: 8px;
    opacity: 1;
  }
}
@keyframes swag3-out {
  0% {
    bottom: 20px;
    left: 20px;
    width: 8px;
  }
  50% {
    width: 30px;
    opacity: 1;
  }
  100% {
    bottom: 50px;
    left: 50px;
    width: 8px;
    opacity: 0;
  }
}
@keyframes swag4 {
  0% {
    bottom: 50px;
    right: 50px;
    width: 8px;
  }
  50% {
    width: 30px;
    opacity: 1;
  }
  100% {
    bottom: 20px;
    right: 20px;
    width: 8px;
    opacity: 1;
  }
}
@keyframes swag4-out {
  0% {
    bottom: 20px;
    right: 20px;
    width: 8px;
  }
  50% {
    width: 30px;
    opacity: 1;
  }
  100% {
    bottom: 50px;
    right: 50px;
    width: 8px;
    opacity: 0;
  }
}
</style>
