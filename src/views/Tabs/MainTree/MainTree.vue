<template>
  <div id="app" style="height: 100%" :class="[{ 'o-auto': $device.mobile }, 'fade-in-up']">
    <div class="tree-bg-glow"></div>
    <!-- All errors are handeled here -->
    <section v-if="errored" class="h100">
      <error
        v-if="errored.response.status == 404"
        :msg="errored.response.data"
        >{{ errored }}</error
      >
      <DualPage
        :payload="authModal.payload"
        :reference="5"
        v-if="authModal.show == true"
        v-on:closed="authModal.show = false"
      ></DualPage>

      <div v-if="errored.response.status == 403">
        <div style="display: flex">
          <router-link :to="{ name: 'Home' }" class="mt-2 ml-1">
            <i class="icofont-arrow-left"></i>
            Back
          </router-link>
        </div>
        <img
          src="@/assets/no_entry.jpg"
          alt="No Entry"
          style="margin-top: 50px; margin-bottom: 30px"
        />
        <h2 style="margin-bottom: 20px">
          You don't have access for "{{ metadata.title }}"
        </h2>
        <button class="btn btn-success" @click="openAuthBox">Enter PIN</button>

        <div style="margin-top: 20px" v-if="helper.main_show">
          <a @click="toggleHelper" style="color: blue; cursor: pointer"
            >Help !</a
          >
          <div v-if="helper.show">
            <p>
              Change Cookie Settings in {{ helper.browser }} Browser, to allow
              all third-party cookies.
            </p>
            <p style="color: grey">
              ( In case if you still face problem, Mail to
              "bloodline.helpline@gmail.com" and we can have quick one-on-one
              session to fix this )
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Loads when a tree is found -->
    <section v-else>
      <router-view></router-view>
      <div v-if="loading">
        <center style="padding-top: 240px">
          <img src="@/assets/dna.gif" alt="Bloodline Loader" />
        </center>
      </div>

      <div v-else>
        <!-- Dual page for Add Root Edit form and  -->
        <DualPage
          :reference="dualPageData.reference"
          :payload="metadata[0]"
          v-on:closed="dualPageClosed"
          v-if="dualPageData.showDualPage"
        ></DualPage>

        <!-- Promotional Pages -->
        <Promotional :numOfMembers="numOfMembers"/>

        <!-- Called When No data is found -->
        <div v-if="tempData == undefined">
          <!-- <img src="@/assets/intro-mob.png" class="mob-intro"/> -->
          <img
            src="@/assets/stickman_family.jpg"
            class="col-xs-12 col-sm-7"
            style="margin-top: 160px"
            alt="Bloodline Helper"
            v-if="!$device.mobile"
          />
          <!-- Page Content -->
          <div
            style="flex-direction: column; display: flex; align-items: center"
          >
            <h5
              class="d-flex content-justify-left ml-2"
              :class="[
                { 'desk-intro-text': !$device.mobile, padt340: $device.mobile },
              ]"
            >
              Add yourself and start creating your family tree
            </h5>
          </div>
          <!-- Add Root Button -->
          <div id="wrapper" v-if="is_session">
            <touch-ripple
              @click.native="dualPage(1)"
              class="button-box"
              :speed="1.1"
            >
              <button
                class="btn btn-success my-btn"
                style="font-weight: bolder; font-size: 17px"
              >
                + Add Me
              </button>
            </touch-ripple>
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
                  v-show="cookey.length == 4"
                  @click="validate"
                  :class="{
                    btn: true,
                    'btn-success': !retry,
                    'btn-warning': retry,
                    'mt-3': true,
                  }"
                  :disabled="vloading"
                >
                  <span
                    class="spinner-border spinner-border-sm"
                    v-show="vloading"
                  ></span>
                  {{ retry ? "Retry" : "Validate" }}
                </button>
              </div>
            </center>
          </div>
        </div>

        <!-- Displays Origial Tree Map -->
        <div v-else>
          <center>
            <div>
              <!-- Download Tree -->
              <button
                class="btn download-tree-btn"
                @click="puppyDownload"
                id="download-pic"
                :disabled="puppyData.loader"
                v-if="!puppyData.downloaded && numOfMembers > 1"
              >
                <i class="icofont-download" v-if="!puppyData.loader"></i>
                <div
                  class="spinner-border"
                  style="height: 22px; width: 22px; color: white"
                  role="status"
                  v-else
                ></div>
              </button>

              <!-- Downloaded Successfully -->
              <div
                v-else-if="numOfMembers > 1"
                class="download-tree-pic-body"
                style="position: absolute; top: 85px; z-index: 10; right: 10px"
              >
                <!-- Message -->
                <div
                  class="download-msg"
                  :style="{
                    width: puppyData.hide ? '0px' : '260px',
                    'font-size': puppyData.hide ? '0px' : '18px',
                    color: puppyData.hide ? '#7ac142' : 'white',
                  }"
                >
                  Downloaded Sucessfully
                </div>
                <!-- Ticker -->
                <tick></tick>
              </div>
            </div>

            <!-- View Controls -->
            <div class="view-controls">
              <button class="my-btn view-control-btn" @click="zoomIn" title="Zoom In">
                <i class="icofont-plus"></i>
              </button>
              <button 
                class="my-btn view-control-btn"
                @click="pan.enabled = !pan.enabled"
                :class="{ 'pan-active': pan.enabled }"
                :title="pan.enabled ? 'Pan Mode: ON' : 'Pan Mode: OFF'"
              >
                <i :class="pan.enabled ? 'icofont-drag' : 'icofont-scroll-long-right'"></i> 
              </button>
              <button class="my-btn view-control-btn" @click="zoomOut" title="Zoom Out">
                <i class="icofont-minus"></i>
              </button>
            </div>

            <!-- Tree with Pan & Zoom -->
            <div 
              class="tree-pan-zoom-container"
              :class="{ 'pan-disabled': !pan.enabled }"
              @mousedown="startPan"
              @mousemove="doPan"
              @mouseup="endPan"
              @mouseleave="endPan"
              @wheel="doZoom"
            >
              <div class="tree-canvas" :style="{ transform: pan.enabled ? `translate(${pan.x}px, ${pan.y}px) scale(${pan.scale})` : `scale(${pan.scale})` }">
                <TreeChart
                  :json="tempData"
                  :images="images"
                  :class="{ landscape: landscape.length }"
                  @click-node="clickNode"
                  style="padding-top: 80px;"
                />
              </div>
            </div>
            <div v-if="!tempData.children && !tempData.mate" class="on-board">
              <center>
                <i
                  class="icofont-long-arrow-up object"
                  style="font-size: 25px"
                ></i>
              </center>
              <h4 style="color: #848181">
                Click on you to add your Parents / Children etc.,
              </h4>
            </div>
          </center>

          <!-- Share Button For Mobile -->
          <button
            @click="shareTree"
            class="btn bottombtn"
            style="right: 10px"
            v-if="$device.mobile"
          >
            <i class="icofont-share"></i>
          </button>
          <footer class="foot">
            <p>
              With
              <i class="icofont-heart" style="color: red"></i>
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
import Error from "@/views/Error";
import Store from "@/store/index";
import ProData from "@/data.js";
import DualPage from "@/modals/DualPage";
import Promotional from  "@/components/promotional";
import { touchRipple } from "vue-touch-ripple";
import "vue-touch-ripple/dist/vue-touch-ripple.css";
import * as htmlToImage from "html-to-image";
import Tick from "@/components/small/tick";
import bomb from "@/bomb";

export default {
  name: "MainTree",
  components: {
    TreeChart,
    Error,
    DualPage,
    touchRipple,
    Tick,
    Promotional
  },
  data() {
    return {
      puppyData: {
        loader: false,
        hide: false,
        downloaded: false,
      },
      landscape: [],
      surname: this.$route.params.id,
      cookey: "",
      cookeyStatus: null,
      vloading: false,
      retry: false,
      sess: null,
      on_board: false,
      dualPageData: {
        showDualPage: false,
        reference: null,
        payload: {},
      },
      authModal: {
        payload: {},
        show: false,
      },
      helper: {
        show: false,
        browser: "",
        main_show: false,
      },
      pan: {
        enabled: false,
        isDragging: false,
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        scale: 1,
      },
    };
  },
  computed: {
    
    metadata: {
      get() {
        return Store.state.metadata;
      },
    },
    loading: {
      get() {
        return Store.state.loading;
      },
    },
    images: {
      get() {
        return Store.state.images;
      },
    },
    numOfMembers: {
      get() {
        if (Store.state.allMembers) {
          if(Store.state.allMembers.length == 1){
            bomb.fireworks();
          }
          return Store.state.allMembers.length;
        }
        return 0;
      },
    },
    tempData: {
      get() {
        if (Store.state.tree && !Store.state.tree.id) {
          return undefined;
        } else if (!Store.state.tree) {
          Store.dispatch("setStepNumber", 1);
        }
        return Store.state.tree;
      },
    },
    view_only: {
      get() {
        return Store.state.view_only;
      },
    },
    is_session: {
      get() {
        return Store.state.is_session;
      },
    },
    errored: {
      get() {
        if (Store.state.error.response) {
          if (Store.state.error.response.status === 403) {
            this.openAuthBox();
            Store.dispatch("setMetaData", Store.state.error.response.data[0]);
          }
        }
        return Store.state.error;
      },
    },
  },
  mounted() {
    // this.toggleBodyClass("addClass", "mem-spec");

    //To show Helper for Wrong Pinner
    if (localStorage.pinner) {
      this.helper.main_show = true;
    }

    //called after adding a new member
    this.$root.$on("update-tree", (data) => {
      console.log(data);
      this.$router.go();
    });

    // Add keyboard listener for zoom in/out keys
    window.addEventListener("keydown", this.handleKeyDown);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
  },
  methods: {
    puppyDownload() {
      this.puppyData.loader = true;
      let params = {};
      params.family_id = this.metadata[0]._id;
      params.members = this.numOfMembers;
      // let puppyUrl = ProData.getHostURL() + "/puppy/";
      // axios
      //   .post(puppyUrl, params)
      //   .then(response => {
      //     const link = document.createElement("a");
      //     link.href = "data:image/png;base64,"+response.data;
      //     link.download = `${this.surname}.png`;
      //     link.click();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   })
      //   .finally(() => {
      //     this.puppyData.loader = false
      //   });
      let puppyTree = document.querySelector(".puppy-tree");
      htmlToImage
        .toPng(puppyTree, {
          backgroundColor: "white",
          pixelRatio: 1,
        })
        .then((dataUrl) => {
          try {
            print.postMessage(
              "download--" + this.surname + "--" + dataUrl.split("base64,")[1]
            );
          } catch (error) {
            var link = document.createElement("a");
            link.download = `${this.surname} - ${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
          }
          this.puppyData.downloaded = true;
          setTimeout(() => {
            this.puppyData.hide = true;
          }, 4000);
          setTimeout(() => {
            this.puppyData.downloaded = false;
            this.puppyData.hide = false;
          }, 6000);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.puppyData.loader = false;
        });
    },
    shareTree() {
      var shareData = {
        type: "share",
        title: `${this.surname.toUpperCase()} Family Tree`,
        text: `Click on the below link to check ${this.surname.toUpperCase()} family tree. You can also open the link in your desktop or laptop browser`,
        url: `https://bloodlineapp.page.link/familytree?surname=${this.surname}`,
      };
      try {
        print.postMessage(`share--${this.surname}`);
      } catch (error) {
        navigator.share(shareData);
      }
    },
    startPan(e) {
      if (this.$device.mobile || !this.pan.enabled) return; // Touch pan handled separately or rely on overflow
      this.pan.isDragging = true;
      this.pan.startX = e.clientX - this.pan.x;
      this.pan.startY = e.clientY - this.pan.y;
    },
    doPan(e) {
      if (!this.pan.isDragging || !this.pan.enabled) return;
      this.pan.x = e.clientX - this.pan.startX;
      this.pan.y = e.clientY - this.pan.startY;
    },
    endPan() {
      this.pan.isDragging = false;
    },
    doZoom(e) {
      if (!this.pan.enabled) return;
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      const oldScale = this.pan.scale;
      let newScale = oldScale + delta;
      
      // Limit zoom min/max
      if (newScale < 0.2) newScale = 0.2;
      if (newScale > 4) newScale = 4;
      
      // Calculate cursor position relative to the container
      const container = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - container.left;
      const mouseY = e.clientY - container.top;
      
      // Adjust x and y so the point under the mouse stays under the mouse
      this.pan.x = mouseX - (mouseX - this.pan.x) * (newScale / oldScale);
      this.pan.y = mouseY - (mouseY - this.pan.y) * (newScale / oldScale);
      
      this.pan.scale = newScale;
    },
    zoomIn() {
      let newScale = this.pan.scale + 0.2;
      if (newScale > 4) newScale = 4;
      this.zoomToCenter(newScale);
    },
    zoomOut() {
      let newScale = this.pan.scale - 0.2;
      if (newScale < 0.2) newScale = 0.2;
      this.zoomToCenter(newScale);
    },
    zoomToCenter(newScale) {
      const container = this.$el.querySelector('.tree-pan-zoom-container').getBoundingClientRect();
      const mouseX = container.width / 2;
      const mouseY = container.height / 2;
      
      this.pan.x = mouseX - (mouseX - this.pan.x) * (newScale / this.pan.scale);
      this.pan.y = mouseY - (mouseY - this.pan.y) * (newScale / this.pan.scale);
      this.pan.scale = newScale;
    },
    handleKeyDown(e) {
      // Ignore if user is typing in an input or textarea
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        this.zoomIn();
      } else if (e.key === "-") {
        e.preventDefault();
        this.zoomOut();
      }
    },
    // Called when a node is clicked
    toggleHelper: function () {
      this.helper.show = !this.helper.show;

      let nAgt = navigator.userAgent;
      let browserName = navigator.appName;

      if (nAgt.indexOf("Opera") != -1) {
        browserName = "Opera";
      } else if (nAgt.indexOf("MSIE") != -1) {
        browserName = "Microsoft Internet Explorer";
      } else if (nAgt.indexOf("Chrome") != -1) {
        browserName = "Chrome";
      } else if (nAgt.indexOf("Safari") != -1) {
        browserName = "Safari";
      } else if (nAgt.indexOf("Firefox") != -1) {
        browserName = "Firefox";
      } else {
        browserName = "your";
      }

      this.helper.browser = browserName;
    },
    openAuthBox: function () {
      this.authModal.show = true;
      this.authModal.payload.surname =
        Store.state.error.response.data[0].surname;
    },
    clickNode: function (node) {
      if (node.data.mate || node.isMate) {
        this.$router.push({
          name: "MemberData",
          params: { member: node.data.id },
          query: { hasMate: true },
        });
      } else {
        this.$router.push({
          name: "MemberData",
          params: { member: node.data.id },
        });
      }
    },

    toggleBodyClass(addRemoveClass, className) {
      const el = document.body;
      if (addRemoveClass === "addClass") {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
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
        .catch((err) => {
          this.retry = true;
          console.log(err);
        })
        .finally(() => {
          this.vloading = false;
        });
    },

    //Dual page calling function
    dualPage(type) {
      if (this.$device.mobile) {
        this.toggleBodyClass("addClass", "mem-spec");
      }
      this.dualPageData.showDualPage = true;
      this.dualPageData.reference = type;
    },

    dualPageClosed() {
      if (this.$device.mobile) {
        this.toggleBodyClass("removeClass", "mem-spec");
      }
      this.dualPageData.showDualPage = false;
    },
  },
};
</script>

<style>
.vsm--mobile-bg{
  background: #ff5d5d !important;
}
.vsm--link_hover > i{
  background-color: #ff5d5d !important;
}
.o-auto {
  overflow: auto;
}
.padt340 {
  padding-top: 200px;
}
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
  color: #fff;
  margin-top: 0px;
  background: #05060f;
  min-height: 100vh;
  position: relative;
  font-family: 'Inter', sans-serif;
}
.tree-bg-glow {
  position: fixed;
  inset: 0;
  background-color: #05060f;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}
.tree-bg-glow::before, .tree-bg-glow::after {
  content: '';
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
  animation: floatBG 20s infinite alternate;
}
.tree-bg-glow::before {
  background: radial-gradient(circle, rgba(79, 142, 247, 0.4), transparent 70%);
  top: -200px;
  left: -200px;
}
.tree-bg-glow::after {
  background: radial-gradient(circle, rgba(167, 139, 250, 0.3), transparent 70%);
  bottom: -200px;
  right: -200px;
  animation-delay: -10s;
}

@keyframes floatBG {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(200px, 100px) scale(1.2); }
  100% { transform: translate(-100px, 200px) scale(0.9); }
}
.fade-in-up {
  animation: fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
#app .name {
  font-weight: 700;
  color: #fff;
}
h2 {
  font-family: "Comfortaa", cursive;
}
.foot {
  position: fixed;
  left: 0;
  bottom: 0px;
  width: 100%;
  background: rgba(15, 17, 35, 0.85);
  backdrop-filter: blur(24px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px;
  color: rgba(255,255,255,0.7);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-align: center;
  z-index: 10;
}
.foot a {
  color: #fff !important;
  margin: 0 0.5em;
}
.tree-pan-zoom-container {
  width: 100vw;
  height: calc(100vh - 120px);
  overflow: hidden;
  cursor: grab;
  position: relative;
  display: flex;
  justify-content: center;
}
.tree-pan-zoom-container.pan-disabled {
  overflow: auto;
  display: block;
  text-align: center;
  cursor: default;
}
.tree-pan-zoom-container:active {
  cursor: grabbing;
}
.tree-canvas {
  transform-origin: top center;
  will-change: transform;
  display: inline-block;
  min-width: max-content;
  transition: transform 0.1s ease-out; /* Smooth snapping for mousewheel */
}
.table-data {
  color: white;
}
#wrapper {
  width: 100%;
  height: 120px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fam-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
  color: indianred;
}

/* Share Button In Mobile */
.bottombtn {
  position: fixed;
  background: linear-gradient(135deg, #4f8ef7, #a78bfa) !important;
  color: white !important;
  bottom: 80px;
  right: 24px;
  height: 60px;
  width: 60px;
  border-radius: 60px;
  z-index: 11;
  border: none !important;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -4px 0 rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}
.bottombtn:hover {
  transform: scale(1.15) translateY(-5px) !important;
  box-shadow: 0 15px 40px rgba(79, 142, 247, 0.7), inset 0 2px 0 rgba(255, 255, 255, 0.5), inset 0 -4px 0 rgba(0, 0, 0, 0.3) !important;
}

.download-tree-btn {
  position: fixed;
  right: 24px;
  top: 100px;
  font-size: 24px;
  cursor: pointer;
  z-index: 11;
  background: linear-gradient(135deg, #4f8ef7, #a78bfa) !important;
  color: white !important;
  border-radius: 60px;
  height: 64px;
  width: 64px;
  border: none !important;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -4px 0 rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.download-tree-btn:hover {
  transform: scale(1.15) translateY(-5px) !important;
  box-shadow: 0 15px 40px rgba(79, 142, 247, 0.7), inset 0 2px 0 rgba(255, 255, 255, 0.5), inset 0 -4px 0 rgba(0, 0, 0, 0.3) !important;
}

.my-btn {
  background: linear-gradient(135deg, #4f8ef7, #a78bfa) !important;
  border: none !important;
  padding: 14px 40px !important;
  border-radius: 16px !important;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -4px 0 rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  color: #fff !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
}
.my-btn:hover {
  transform: translateY(-4px) scale(1.05) !important;
  box-shadow: 0 16px 40px rgba(79, 142, 247, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -4px 0 rgba(0, 0, 0, 0.25) !important;
}

.view-controls {
  position: fixed;
  right: 24px;
  left: auto;
  bottom: 80px;
  z-index: 11;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.view-control-btn {
  padding: 0 !important;
  width: 48px !important;
  height: 48px !important;
  border-radius: 50% !important;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(15, 17, 35, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: rgba(255,255,255,0.7) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
  font-size: 20px;
}
.view-control-btn.pan-active {
  background: linear-gradient(135deg, #4f8ef7, #a78bfa) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -4px 0 rgba(0, 0, 0, 0.2) !important;
}

.download-msg,
.download-tree-pic-body {
  display: flex;
  align-items: center;
  justify-content: center;
}

.download-msg {
  background: #7ac142;
  transition: all 1s linear;
  height: 30px;
  border-radius: 10px 0px 0px 10px;
  margin-right: -10px;
  color: white;
}
</style>
