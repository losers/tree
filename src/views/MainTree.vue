<template>
  <div id="app">
    <!-- All errors are handeled here -->
    <section v-if="errored">
      <error :msg="errored.response.data">{{errored}}</error>
    </section>

    <!-- Loads when a tree is found -->
    <section v-else>
      <router-view></router-view>

      <div v-if="loading">
        <router-link :to="{name:'Home'}" class="float-left mt-2 ml-1">
          <i class="icofont-arrow-left"></i>
          Back
        </router-link>
        <center style="padding-top:240px">
          <img src="@/assets/dna.gif" alt="Bloodline Loader" />
        </center>
      </div>

      <div v-else>
        <!-- Tree Tilebar -->
        <div class="tree-titlebar">
          <router-link :to="{name:'Home'}">Back</router-link>
          <div class="tree-title flexy">
            <div
              class="fam-name"
              :class="[{'f-26':$device.mobile}]"
            >{{newTitle?newTitle:title[0].title}}</div>
            <div v-show="is_session">
              <i
                class="icofont-edit ml-2"
                @click="dualPage(0)"
                style="font-size:20px;cursor: pointer;"
              ></i>
            </div>
          </div>
          <router-link
            :to="{name:'Analytics'}"
            style="display: flex;align-items: center;margin-right: 5px;"
          >
            <i
              class="icofont-gear"
              style="margin-right: 8px;"
              :class="[{'f-31':$device.mobile, 'f-21':$device.mobile}]"
            ></i>
            <span v-if="!$device.mobile">Analytics</span>
          </router-link>
        </div>

        <!-- Dual page for Add Root Edit form and  -->
        <DualPage
          :reference="dualPageData.reference"
          :payload="title[0]"
          v-on:closed="dualPageClosed"
          v-if="dualPageData.showDualPage"
        ></DualPage>

        <!-- Called When No data is found -->
        <div v-if="tempData==undefined">
          <img src="@/assets/intro-mob.png" class="mob-intro" v-if="$device.mobile" />
          <img
            src="../assets/stickman_family.jpg"
            class="col-xs-12 col-sm-7"
            style="margin-top:160px"
            alt="Blood Line Helper"
            v-else
          />
          <!-- Page Content -->
          <div style="flex-direction: column;
    display: flex;
    align-items: center;">
            <h5
              class="d-flex content-justify-left ml-2"
              :class="[{'desk-intro-text':!$device.mobile}]"
            >Click 'Add' to Start Adding Members.</h5>
            <center>
              <i class="icofont-long-arrow-down object"></i>
            </center>
          </div>
          <!-- Add Root Button -->
          <div id="wrapper" v-if="is_session">
            <button @click="dualPage(1)" class="my-super-cool-btn">
              <div class="dots-container">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
              <span style="font-size:18px; font-weight:900">Add!</span>
            </button>
          </div>
          <div v-else>
            <center>
              <div class="row col-4">
                <input
                  class="form-control input-sm"
                  placeholder="Enter Key to Edit"
                  v-model="cookey"
                  onkeypress="if(this.value.length==4) return false;"
                  type="number"
                />
                <button
                  v-show="cookey.length==4"
                  @click="validate"
                  :class="{'btn':true, 'btn-success':!retry, 'btn-warning':retry, 'mt-3':true}"
                  :disabled="vloading"
                >
                  <span class="spinner-border spinner-border-sm" v-show="vloading"></span>
                  {{retry?"Retry":"Validate"}}
                </button>
              </div>
            </center>
          </div>
        </div>

        <!-- Displays Tree Map -->
        <div v-else>
          <center>
            <TreeChart
              :json="tempData"
              :images="images"
              :class="{landscape: landscape.length}"
              @click-node="clickNode"
              style="padding-top:70px"
            />
            <div v-if="!tempData.children && !tempData.mate" class="on-board">
              <center>
                <i class="icofont-long-arrow-up object"></i>
              </center>
              <h4 style="color:#848181">Click on this person to add Parents / Children etc.,</h4>
            </div>
          </center>
          <footer class="foot">
            <p>
              With
              <i class="icofont-heart" style="color:red"></i>
              by
              <a>Losers</a>
            </p>
          </footer>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TreeChart from "@/components/TreeChart";
import axios from "axios";
import Error from "./Error";
import Store from "../store/index";
import ProData from "../data.js";
import DualPage from "../modals/DualPage";

export default {
  name: "MainTree",
  components: {
    TreeChart,
    Error,
    DualPage
  },
  data() {
    return {
      landscape: [],
      surname: this.$route.params.id,
      cookey: "",
      cookeyStatus: null,
      vloading: false,
      retry: false,
      sess: null,
      newTitle: null,
      on_board: false,
      dualPageData: {
        showDualPage: false,
        reference: null,
        payload: {}
      }
    };
  },
  computed: {
    loading: {
      get() {
        return Store.state.loading;
      }
    },
    images: {
      get() {
        return Store.state.images;
      }
    },
    tempData: {
      get() {
        if (Store.state.tree && !Store.state.tree.id) {
          return undefined;
        }
        return Store.state.tree;
      }
    },
    title: {
      get() {
        return Store.state.title;
      }
    },
    is_session: {
      get() {
        return Store.state.is_session;
      }
    },
    errored: {
      get() {
        return Store.state.error;
      }
    }
  },
  mounted() {
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

    //handling sessions
    validate() {
      this.vloading = true;
      let sessionUrl = ProData.getHostURL() + "/sessions/";
      let params = {};
      params.pin = this.cookey;
      params.surname = this.surname;
      axios
        .post(sessionUrl, params)
        .then(() => {
          let sessData = {};
          sessData.status = true;
          sessData.surname = params.surname;
          Store.commit("setSession", sessData);
          this.vloading = false;
        })
        .catch(err => {
          this.retry = true;
          console.log(err);
        })
        .finally(() => {
          this.vloading = false;
        });
    },

    //Dual page calling function
    dualPage(type) {
      this.dualPageData.showDualPage = true;
      this.dualPageData.reference = type;
    },

    dualPageClosed(payload) {
      if (payload) {
        this.newTitle = payload;
      }
      this.dualPageData.showDualPage = false;
    }
  }
};
</script>

<style>
.desk-intro-text {
  font-size: 28px;
  margin-top: 48px;
}
.mob-intro {
  margin-top: 50px;
  padding: 45px;
}
.object {
  animation: MoveUpDown 1s linear infinite;
  position: relative;
  color: rgb(132, 129, 129);
}

@keyframes MoveUpDown {
  0%,
  100% {
    top: -15px;
  }
  50% {
    top: 0px;
  }
}

.icofont-long-arrow-up,
.icofont-long-arrow-down {
  font-size: 53px;
}
.on-board {
  margin-top: -40px;
  line-height: 36px;
  position: relative;
}
.f-21 {
  font-size: 21px;
}
.f-31 {
  font-size: 31px;
}
.f-26 {
  font-size: 26px;
}
.f-1 {
  flex: 1;
}
.flexy {
  display: flex;
  align-items: center;
}
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
  color: #fff !important;
  margin: 0 0.5em;
}
.table-data {
  color: white;
}
#wrapper {
  width: 100vw;
  height: 120px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tree-titlebar {
  position: fixed;
  width: 100%;
  z-index: 10;
  box-shadow: -1px 3px 20px -10px rgba(163, 163, 163, 0.75);
  padding: 5px !important;
  background-color: white;
  display: flex;
  align-items: center;
}
.tree-title {
  font-size: 30px;
  color: black;
  font-weight: bold;
  flex: 1;
  justify-content: center;
}
.fam-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
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
  padding: 0 !important;
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
  width: 55%;
  height: 55%;
  display: block;
  position: absolute;
  border-radius: 100%;
  border: 4px solid grey;
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
  background-color: grey;
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
