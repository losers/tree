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
          <div class="spinner-border" style="transform: scale(3);"></div>
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
        <div v-if="tempData == undefined" class="tree-empty-state-container">
          <div class="empty-state-card">
            <!-- Background-less Animated Family Tree Vector Illustration -->
            <div class="empty-illustration-wrap">
              <svg
                class="empty-tree-svg"
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="treeTrunkGrad" x1="200" y1="280" x2="200" y2="60" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#10b981" />
                    <stop offset="45%" stop-color="#3b82f6" />
                    <stop offset="100%" stop-color="#8b5cf6" />
                  </linearGradient>
                  <linearGradient id="goldNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fbbf24" />
                    <stop offset="100%" stop-color="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="emeraldNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#34d399" />
                    <stop offset="100%" stop-color="#059669" />
                  </linearGradient>
                  <linearGradient id="purpleNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#c084fc" />
                    <stop offset="100%" stop-color="#7c3aed" />
                  </linearGradient>
                  <linearGradient id="blueNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#60a5fa" />
                    <stop offset="100%" stop-color="#2563eb" />
                  </linearGradient>
                  <radialGradient id="haloAmbientGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.32" />
                    <stop offset="60%" stop-color="#10b981" stop-opacity="0.1" />
                    <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
                  </radialGradient>
                  <filter id="svgGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <!-- Ambient Radial Glow Behind Tree -->
                <circle cx="200" cy="150" r="135" fill="url(#haloAmbientGlow)" class="ambient-halo" />

                <!-- Ground Ripple Base -->
                <path d="M130 275 Q200 290 270 275" stroke="rgba(255,255,255,0.18)" stroke-width="2" stroke-linecap="round" />
                <path d="M160 286 Q200 295 240 286" stroke="rgba(255,255,255,0.08)" stroke-width="1.8" stroke-linecap="round" />

                <!-- Tree Trunk & Main Branches -->
                <path class="svg-branch branch-trunk" d="M200 275 C200 235, 200 205, 200 170" stroke="url(#treeTrunkGrad)" stroke-width="4.5" stroke-linecap="round" />
                <path class="svg-branch branch-left" d="M200 205 C170 185, 125 175, 110 130" stroke="url(#treeTrunkGrad)" stroke-width="3" stroke-linecap="round" />
                <path class="svg-branch branch-right" d="M200 205 C230 185, 275 175, 290 130" stroke="url(#treeTrunkGrad)" stroke-width="3" stroke-linecap="round" />
                <path class="svg-branch branch-center" d="M200 170 C200 145, 200 120, 200 85" stroke="url(#treeTrunkGrad)" stroke-width="3.2" stroke-linecap="round" />
                <path class="svg-branch branch-sub-left" d="M110 130 C95 100, 65 90, 52 65" stroke="url(#treeTrunkGrad)" stroke-width="2.2" stroke-linecap="round" />
                <path class="svg-branch branch-sub-right" d="M290 130 C305 100, 335 90, 348 65" stroke="url(#treeTrunkGrad)" stroke-width="2.2" stroke-linecap="round" />

                <!-- Floating Atmospheric Fireflies / Spores -->
                <circle cx="145" cy="90" r="2.8" fill="#34d399" class="spore sp-1" />
                <circle cx="255" cy="88" r="2.5" fill="#60a5fa" class="spore sp-2" />
                <circle cx="165" cy="142" r="2.2" fill="#fbbf24" class="spore sp-3" />
                <circle cx="235" cy="148" r="2.4" fill="#c084fc" class="spore sp-4" />
                <circle cx="85" cy="115" r="2" fill="#34d399" class="spore sp-5" />
                <circle cx="315" cy="110" r="2.2" fill="#f472b6" class="spore sp-6" />

                <!-- Grandparent Node Left -->
                <g class="float-node node-gp-left">
                  <circle cx="52" cy="65" r="16" fill="#1e293b" stroke="url(#goldNodeGrad)" stroke-width="2" />
                  <circle cx="52" cy="65" r="12" fill="url(#goldNodeGrad)" fill-opacity="0.18" />
                  <circle cx="52" cy="62" r="3.5" fill="#fcd34d" />
                  <path d="M45 71 C45 67, 48 66.5, 52 66.5 C56 66.5, 59 67, 59 71" stroke="#fcd34d" stroke-width="1.8" stroke-linecap="round" fill="none" />
                </g>

                <!-- Grandparent Node Right -->
                <g class="float-node node-gp-right">
                  <circle cx="348" cy="65" r="16" fill="#1e293b" stroke="url(#goldNodeGrad)" stroke-width="2" />
                  <circle cx="348" cy="65" r="12" fill="url(#goldNodeGrad)" fill-opacity="0.18" />
                  <circle cx="348" cy="62" r="3.5" fill="#fcd34d" />
                  <path d="M341 71 C341 67, 344 66.5, 348 66.5 C352 66.5, 355 67, 355 71" stroke="#fcd34d" stroke-width="1.8" stroke-linecap="round" fill="none" />
                </g>

                <!-- Father Node Left -->
                <g class="float-node node-father">
                  <circle cx="110" cy="130" r="22" fill="#1e293b" stroke="url(#blueNodeGrad)" stroke-width="2.5" filter="url(#svgGlowFilter)" />
                  <circle cx="110" cy="130" r="18" fill="url(#blueNodeGrad)" fill-opacity="0.22" />
                  <circle cx="110" cy="125" r="5.2" fill="#93c5fd" />
                  <path d="M100 140 C100 134, 105 133, 110 133 C115 133, 120 134, 120 140" stroke="#93c5fd" stroke-width="2.2" stroke-linecap="round" fill="none" />
                </g>

                <!-- Mother Node Right -->
                <g class="float-node node-mother">
                  <circle cx="290" cy="130" r="22" fill="#1e293b" stroke="url(#purpleNodeGrad)" stroke-width="2.5" filter="url(#svgGlowFilter)" />
                  <circle cx="290" cy="130" r="18" fill="url(#purpleNodeGrad)" fill-opacity="0.22" />
                  <circle cx="290" cy="125" r="5.2" fill="#f472b6" />
                  <path d="M280 140 C280 134, 285 133, 290 133 C295 133, 300 134, 300 140" stroke="#f472b6" stroke-width="2.2" stroke-linecap="round" fill="none" />
                </g>

                <!-- YOU / Root Member Center Node (Glowing Crown Node) -->
                <g class="float-node node-root-hero">
                  <circle cx="200" cy="78" r="35" fill="none" stroke="#10b981" stroke-width="1.8" class="hero-pulse-ring" />
                  <circle cx="200" cy="78" r="28" fill="#0f172a" stroke="url(#emeraldNodeGrad)" stroke-width="3" filter="url(#svgGlowFilter)" />
                  <circle cx="200" cy="78" r="24" fill="url(#emeraldNodeGrad)" fill-opacity="0.25" />
                  <circle cx="200" cy="72" r="7.5" fill="#6ee7b7" />
                  <path d="M187 92 C187 84, 192 83, 200 83 C208 83, 213 84, 213 92" stroke="#6ee7b7" stroke-width="2.6" stroke-linecap="round" fill="none" />
                  <!-- Crown / Star Accent -->
                  <polygon points="200,49 203,55 209,56 205,60 206,66 200,63 194,66 195,60 191,56 197,55" fill="#fbbf24" class="crown-star" />
                </g>
              </svg>
            </div>

            <!-- Page Copy (Clean & Minimal) -->
            <div class="empty-text-wrap">
              <h2 class="empty-title">
                Start Your Family Tree
              </h2>
              <p class="empty-subtitle">
                Add yourself to plant the first root.
              </p>
            </div>

            <!-- Add Root Button -->
            <div class="empty-action-wrap" v-if="is_session">
              <touch-ripple
                @click.native="dualPage(1)"
                class="empty-btn-container"
                :speed="1.1"
              >
                <button class="empty-add-btn">
                  <span class="btn-shine"></span>
                  <i class="icofont-plus-circle btn-icon"></i>
                  <span class="btn-text">+ Add Yourself</span>
                </button>
              </touch-ripple>
            </div>

            <!-- 4-digit Key Unlock (When viewing with no active session) -->
            <div v-else class="empty-key-box">
              <div class="key-card">
                <label class="key-label">Enter 4-Digit Edit Key:</label>
                <div class="key-input-row">
                  <input
                    class="key-field"
                    placeholder="••••"
                    v-model="cookey"
                    onkeypress="if(this.value.length==4) return false;"
                    type="number"
                  />
                  <button
                    v-show="cookey.length == 4"
                    @click="validate"
                    class="key-submit-btn"
                    :class="{ 'retry-btn': retry }"
                    :disabled="vloading"
                  >
                    <span class="spinner-border spinner-border-sm mr-1" v-show="vloading"></span>
                    {{ retry ? "Retry" : "Unlock" }}
                  </button>
                </div>
              </div>
            </div>
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
              <button class="my-btn view-control-btn" @click="zoomOut" title="Zoom Out">
                <i class="icofont-minus"></i>
              </button>
            </div>

            <!-- Minimap -->
            <div class="minimap-container" :class="{ 'minimap-visible': minimap.visible }" v-if="minimap.treeWidth > 0" @click="minimapClick" @mousedown="startMinimapDrag" @mouseenter="keepMinimapVisible" @mouseleave="hideMinimapDelayed">
              <div class="minimap-canvas" :style="minimapCanvasStyle">
                <div class="minimap-viewport" :style="minimapViewportStyle"></div>
              </div>
            </div>

            <!-- Tree with Zoom -->
            <div 
              class="tree-pan-zoom-container"
              @wheel="doZoom"
              @scroll="updateMinimap"
              ref="treeContainer"
            >
              <div class="tree-wrapper" :style="wrapperStyle">
                <div class="tree-canvas" ref="treeCanvas" :style="{ transform: `scale(${pan.scale})` }">
                  <TreeChart
                    :json="tempData"
                    :images="images"
                    :class="{ landscape: landscape.length }"
                    @click-node="clickNode"
                    style="padding-top: 80px;"
                  />

                  <!-- First Member Onboarding Guide: Displayed directly below the person -->
                  <div v-if="tempData && !tempData.children && !tempData.mate" class="first-member-guide">
                    <div class="guide-arrow-box">
                      <i class="icofont-long-arrow-up guide-arrow-icon"></i>
                    </div>
                    <div class="guide-prompt-pill">
                      Click on you to add your Parents / Children etc.,
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </center>

          <!-- Share Button For Mobile -->
          <button
            @click="shareTree"
            class="btn bottombtn"
            style="left: 10px;"
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
        scale: 1,
      },
      minimap: {
        treeWidth: 0,
        treeHeight: 0,
        viewWidth: 0,
        viewHeight: 0,
        scrollLeft: 0,
        scrollTop: 0,
        isDragging: false,
        visible: false,
        hideTimer: null,
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
    minimapBaseSize() {
      return this.$device && this.$device.mobile ? 80 : 150;
    },
    wrapperStyle() {
      let w = this.minimap.treeWidth * this.pan.scale;
      let h = this.minimap.treeHeight * this.pan.scale;
      return {
        width: w > 0 ? `${w}px` : 'auto',
        height: h > 0 ? `${h}px` : 'auto'
      };
    },
    minimapCanvasStyle() {
      let maxDim = Math.max(this.minimap.treeWidth, this.minimap.treeHeight, 1);
      let scale = this.minimapBaseSize / maxDim;
      return {
        width: `${this.minimap.treeWidth * scale}px`,
        height: `${this.minimap.treeHeight * scale}px`,
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        margin: 'auto'
      };
    },
    minimapViewportStyle() {
      let maxDim = Math.max(this.minimap.treeWidth, this.minimap.treeHeight, 1);
      let scale = this.minimapBaseSize / maxDim;
      let viewW = this.minimap.viewWidth / this.pan.scale;
      let viewH = this.minimap.viewHeight / this.pan.scale;
      let left = this.minimap.scrollLeft / this.pan.scale;
      let top = this.minimap.scrollTop / this.pan.scale;
      
      if (left < 0) left = 0;
      if (top < 0) top = 0;
      if (viewW > this.minimap.treeWidth) viewW = this.minimap.treeWidth;
      if (viewH > this.minimap.treeHeight) viewH = this.minimap.treeHeight;
      
      return {
        width: `${viewW * scale}px`,
        height: `${viewH * scale}px`,
        left: `${left * scale}px`,
        top: `${top * scale}px`,
        position: 'absolute',
        border: '2px solid #ff4757',
        backgroundColor: 'rgba(255, 71, 87, 0.2)',
        boxSizing: 'border-box',
        cursor: 'grab'
      };
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
    
    // Resize Observer for Minimap
    this.resizeObserver = new ResizeObserver(() => {
      this.updateMinimapDimensions();
    });
    if (this.$refs.treeCanvas) this.resizeObserver.observe(this.$refs.treeCanvas);
    if (this.$refs.treeContainer) this.resizeObserver.observe(this.$refs.treeContainer);
    
    // Minimap drag
    window.addEventListener("mousemove", this.doMinimapDrag);
    window.addEventListener("mouseup", this.endMinimapDrag);
    
    // Initial update
    setTimeout(() => { this.updateMinimapDimensions(); }, 500);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("mousemove", this.doMinimapDrag);
    window.removeEventListener("mouseup", this.endMinimapDrag);
    if (this.resizeObserver) this.resizeObserver.disconnect();
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
    updateMinimapDimensions() {
      if (this.$refs.treeCanvas && this.$refs.treeContainer) {
        this.minimap.treeWidth = this.$refs.treeCanvas.scrollWidth;
        this.minimap.treeHeight = this.$refs.treeCanvas.scrollHeight;
        this.minimap.viewWidth = this.$refs.treeContainer.clientWidth;
        this.minimap.viewHeight = this.$refs.treeContainer.clientHeight;
        this.updateMinimap();
      }
    },
    updateMinimap() {
      if (this.$refs.treeContainer) {
        this.minimap.scrollLeft = this.$refs.treeContainer.scrollLeft;
        this.minimap.scrollTop = this.$refs.treeContainer.scrollTop;
        this.showMinimap();
      }
    },
    showMinimap() {
      this.minimap.visible = true;
      this.hideMinimapDelayed();
    },
    hideMinimapDelayed() {
      if (this.minimap.hideTimer) clearTimeout(this.minimap.hideTimer);
      this.minimap.hideTimer = setTimeout(() => {
        if (!this.minimap.isDragging) {
          this.minimap.visible = false;
        }
      }, 1500);
    },
    keepMinimapVisible() {
      if (this.minimap.hideTimer) clearTimeout(this.minimap.hideTimer);
      this.minimap.visible = true;
    },
    setMinimapScroll(e) {
      let maxDim = Math.max(this.minimap.treeWidth, this.minimap.treeHeight, 1);
      let scale = this.minimapBaseSize / maxDim;
      
      let canvasRect = e.currentTarget.closest('.minimap-canvas').getBoundingClientRect();
      let clickX = e.clientX - canvasRect.left;
      let clickY = e.clientY - canvasRect.top;
      
      let treeX = clickX / scale;
      let treeY = clickY / scale;
      
      let scrollLeft = (treeX * this.pan.scale) - (this.minimap.viewWidth / 2);
      let scrollTop = (treeY * this.pan.scale) - (this.minimap.viewHeight / 2);
      
      if (this.$refs.treeContainer) {
        this.$refs.treeContainer.scrollTo({
          left: scrollLeft,
          top: scrollTop,
          behavior: 'instant'
        });
      }
    },
    minimapClick(e) {
      if (!this.minimap.isDragging) {
        this.setMinimapScroll(e);
      }
    },
    startMinimapDrag(e) {
      this.minimap.isDragging = true;
      document.body.style.userSelect = 'none';
      this.keepMinimapVisible();
      this.setMinimapScroll(e);
    },
    doMinimapDrag(e) {
      if (!this.minimap.isDragging) return;
      let canvas = this.$el.querySelector('.minimap-canvas');
      if (canvas) {
        let fakeEvent = {
          clientX: e.clientX,
          clientY: e.clientY,
          currentTarget: { closest: () => canvas }
        };
        this.setMinimapScroll(fakeEvent);
      }
    },
    endMinimapDrag() {
      this.minimap.isDragging = false;
      document.body.style.userSelect = 'auto';
      this.hideMinimapDelayed();
    },
    doZoom(e) {
      if (!e.ctrlKey && !e.metaKey) return; // Only zoom on ctrl+scroll or pinch
      e.preventDefault();
      const zoomSensitivity = 0.005;
      const delta = -e.deltaY * zoomSensitivity;
      const oldScale = this.pan.scale;
      let newScale = oldScale + delta;
      
      if (newScale < 0.2) newScale = 0.2;
      if (newScale > 4) newScale = 4;
      
      this.applyZoom(newScale, e.clientX, e.clientY);
    },
    zoomIn() {
      let newScale = this.pan.scale + 0.2;
      if (newScale > 4) newScale = 4;
      this.applyZoomToCenter(newScale);
    },
    zoomOut() {
      let newScale = this.pan.scale - 0.2;
      if (newScale < 0.2) newScale = 0.2;
      this.applyZoomToCenter(newScale);
    },
    applyZoomToCenter(newScale) {
      const container = this.$refs.treeContainer;
      if (!container) {
        this.pan.scale = newScale;
        return;
      }
      const rect = container.getBoundingClientRect();
      this.applyZoom(newScale, rect.left + rect.width / 2, rect.top + rect.height / 2);
    },
    applyZoom(newScale, clientX, clientY) {
      const container = this.$refs.treeContainer;
      if (!container) return;
      
      const oldScale = this.pan.scale;
      const rect = container.getBoundingClientRect();
      
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;
      
      const treeX = (container.scrollLeft + mouseX) / oldScale;
      const treeY = (container.scrollTop + mouseY) / oldScale;
      
      this.pan.scale = newScale;
      
      this.$nextTick(() => {
        container.scrollLeft = (treeX * newScale) - mouseX;
        container.scrollTop = (treeY * newScale) - mouseY;
        this.updateMinimapDimensions();
      });
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
/* Modern Animated Empty State */
.tree-empty-state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 32px 16px 48px 16px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .tree-empty-state-container {
    min-height: calc(100vh - 90px);
    padding: 16px 12px 36px 12px;
  }
}

.empty-state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 580px;
  width: 100%;
}

.empty-illustration-wrap {
  width: 100%;
  max-width: 360px;
  position: relative;
  margin-bottom: 16px;
}

@media (max-width: 576px) {
  .empty-illustration-wrap {
    max-width: 290px;
    margin-bottom: 10px;
  }
}

.empty-tree-svg {
  width: 100%;
  height: auto;
  overflow: visible;
  filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.45));
}

/* SVG Node Float & Pulse Keyframes */
@keyframes heroFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}

@keyframes slowFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes reverseFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

@keyframes heroPulseRing {
  0% {
    r: 28px;
    opacity: 0.85;
    stroke-width: 2px;
  }
  50% {
    r: 40px;
    opacity: 0.2;
    stroke-width: 1.2px;
  }
  100% {
    r: 45px;
    opacity: 0;
    stroke-width: 0.5px;
  }
}

@keyframes ambientGlowPulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 0.95; transform: scale(1.05); }
}

@keyframes sporeBlink {
  0%, 100% { opacity: 0.2; transform: translateY(0); }
  50% { opacity: 0.9; transform: translateY(-4px); }
}

@keyframes starSpin {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(15deg); }
}

.ambient-halo {
  transform-origin: 200px 150px;
  animation: ambientGlowPulse 5s ease-in-out infinite;
}

.hero-pulse-ring {
  animation: heroPulseRing 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

.node-root-hero {
  transform-origin: 200px 78px;
  animation: heroFloat 3.5s ease-in-out infinite;
}

.crown-star {
  transform-origin: 200px 58px;
  animation: starSpin 4s ease-in-out infinite;
}

.node-father {
  transform-origin: 110px 130px;
  animation: slowFloat 4s ease-in-out infinite;
}

.node-mother {
  transform-origin: 290px 130px;
  animation: reverseFloat 4.2s ease-in-out infinite;
}

.node-gp-left {
  transform-origin: 52px 65px;
  animation: slowFloat 3.8s ease-in-out infinite 0.5s;
}

.node-gp-right {
  transform-origin: 348px 65px;
  animation: reverseFloat 4.5s ease-in-out infinite 0.3s;
}

.spore {
  animation: sporeBlink 2.8s ease-in-out infinite;
}
.sp-1 { animation-delay: 0.2s; }
.sp-2 { animation-delay: 0.8s; }
.sp-3 { animation-delay: 1.4s; }
.sp-4 { animation-delay: 0.5s; }
.sp-5 { animation-delay: 1.9s; }
.sp-6 { animation-delay: 1.1s; }

/* Empty Text Copy (Clean & Minimal) */
.empty-text-wrap {
  margin-bottom: 24px;
}

.empty-title {
  font-size: 26px;
  font-weight: 800;
  color: #f8fafc;
  margin: 0 0 8px 0;
  letter-spacing: -0.4px;
  line-height: 1.25;
}

@media (max-width: 576px) {
  .empty-title {
    font-size: 21px;
  }
}

.empty-subtitle {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0 auto;
}

@media (max-width: 576px) {
  .empty-subtitle {
    font-size: 13px;
  }
}

/* Empty Action CTA */
.empty-action-wrap {
  margin-bottom: 28px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.empty-btn-container {
  display: inline-block;
  max-width: 320px;
  width: 100%;
}

.empty-add-btn {
  width: 100%;
  min-height: 52px;
  padding: 14px 28px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15) inset;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.empty-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.25) inset;
}

.empty-add-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
}

.btn-icon {
  font-size: 20px;
}

@keyframes btnGleam {
  0% { transform: translateX(-150%) rotate(25deg); }
  35%, 100% { transform: translateX(250%) rotate(25deg); }
}

.btn-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 50%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.32), transparent);
  animation: btnGleam 4s infinite;
  pointer-events: none;
}

/* Key Unlock Box */
.empty-key-box {
  margin-bottom: 24px;
  width: 100%;
  max-width: 360px;
}

.key-card {
  background: rgba(15, 20, 36, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 16px;
  text-align: left;
}

.key-label {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 8px;
  display: block;
}

.key-input-row {
  display: flex;
  gap: 8px;
}

.key-field {
  flex: 1;
  background: rgba(0, 0, 0, 0.4);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 4px;
  padding: 8px 12px;
  outline: none;
}

.key-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.key-submit-btn {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.key-submit-btn:hover {
  background: #059669;
}

.key-submit-btn.retry-btn {
  background: #f59e0b;
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

/* First Member Onboarding Guide - Directly below root person */
.first-member-guide {
  margin-top: 14px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  animation: fadeIn 0.4s ease;
  user-select: none;
}

.guide-arrow-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.guide-arrow-icon {
  font-size: 30px;
  color: #a78bfa;
  animation: guideArrowBounce 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.7));
}

@keyframes guideArrowBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.guide-prompt-pill {
  color: #e2e8f0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.2px;
  margin: 0;
  padding: 10px 22px;
  background: rgba(15, 20, 36, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
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
  margin-bottom: 0;
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
.foot p {
  margin: 0;
}
.foot a {
  color: #fff !important;
  margin: 0 0.5em;
}
.tree-pan-zoom-container {
  width: 100%;
  max-width: 100%;
  height: calc(100vh - 120px);
  overflow: auto;
  position: relative;
  text-align: center;
}
.tree-wrapper {
  display: inline-block;
  margin: 0 auto;
  text-align: center;
  vertical-align: top;
}
.tree-canvas {
  transform-origin: top center;
  will-change: transform;
  display: inline-block;
  min-width: max-content;
  margin: 0 auto;
}
.minimap-container {
  position: fixed;
  bottom: 80px;
  right: 90px;
  width: 170px;
  height: 170px;
  background: rgba(15, 17, 35, 0.85);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease-in-out;
}
.minimap-container.minimap-visible {
  opacity: 1;
  pointer-events: auto;
}
@media (max-width: 768px) {
  .minimap-container {
    width: 100px;
    height: 100px;
    right: 80px; /* Keeps it slightly to the left of the view controls */
  }
}
.minimap-viewport:active {
  cursor: grabbing !important;
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
  left: 24px;
  right: auto !important;
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

/* ==========================================================================
   MainTree Light Theme Overrides
   ========================================================================== */
[data-theme="light"] #app,
.theme-light #app {
  color: #0f172a !important;
  background: #f1f5f9 !important;
}

[data-theme="light"] .tree-bg-glow,
.theme-light .tree-bg-glow {
  background-color: #f1f5f9 !important;
}

[data-theme="light"] .tree-bg-glow::before,
.theme-light .tree-bg-glow::before {
  background: radial-gradient(circle, rgba(79, 142, 247, 0.15), transparent 70%);
}

[data-theme="light"] .tree-bg-glow::after,
.theme-light .tree-bg-glow::after {
  background: radial-gradient(circle, rgba(167, 139, 250, 0.12), transparent 70%);
}

[data-theme="light"] .minimap-container,
.theme-light .minimap-container {
  background: rgba(255, 255, 255, 0.88) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08) !important;
}

[data-theme="light"] .minimap-title,
.theme-light .minimap-title {
  color: #64748b !important;
}

[data-theme="light"] .view-control-btn,
.theme-light .view-control-btn {
  background: rgba(255, 255, 255, 0.88) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #334155 !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06) !important;
}

[data-theme="light"] .view-control-btn:hover,
.theme-light .view-control-btn:hover {
  background: #ffffff !important;
  color: #4f8ef7 !important;
  border-color: rgba(79, 142, 247, 0.3) !important;
}

[data-theme="light"] .foot,
.theme-light .foot {
  background: rgba(255, 255, 255, 0.88) !important;
  border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
  color: #64748b !important;
}

[data-theme="light"] .foot a,
.theme-light .foot a {
  color: #3b82f6 !important;
}
</style>
