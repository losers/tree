<template>
  <div class="member-drawer-wrapper">
    <Drawer @close="toggle" :align="drawerAlign" :closeable="false" :maskClosable="true">
      <div
        v-if="open"
        class="drawer-inner-container"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
      >
        <!-- Mobile drag handle pill -->
        <div class="drawer-drag-area" v-if="$device.mobile">
          <div class="drawer-drag-pill"></div>
        </div>

        <!-- Floating Sleek Close Button -->
        <button class="drawer-close-btn" @click="toggle" aria-label="Close profile">
          <i class="icofont-close-line"></i>
        </button>

        <!-- Error State -->
        <section v-if="errored" class="p-4 text-center">
          <div class="error-badge">
            <i class="icofont-warning text-warning" style="font-size: 32px;"></i>
          </div>
          <p class="mt-3 text-white-50 font-weight-500">{{ errored }}</p>
        </section>

        <!-- Loading State -->
        <section v-else-if="loading" class="loading-wrapper">
          <div class="modern-loader"></div>
          <span class="loading-hint mt-3">Loading profile...</span>
        </section>

        <!-- Content State -->
        <section v-else class="drawer-scroll-content">
          <!-- Hero Identity Card -->
          <div class="hero-profile-card">
            <!-- Avatar with ambient aura -->
            <div class="avatar-container">
              <div class="avatar-glow"></div>
              <div class="avatar-frame">
                <img
                  v-if="imageExists"
                  :src="previewImage"
                  alt="Avatar"
                  class="profile-avatar"
                />
                <img
                  v-else
                  src="../../assets/profile.png"
                  alt="Family Member"
                  class="profile-avatar"
                />
                <!-- Camera edit badge for admin -->
                <button
                  v-if="cookeyStatus && !view_only"
                  class="avatar-camera-btn"
                  @click="show = true"
                  title="Change photo"
                  aria-label="Change photo"
                >
                  <i class="icofont-camera"></i>
                </button>
              </div>
            </div>

            <!-- Upload confirmation button if image picked -->
            <button
              @click="uploadImage"
              v-show="showUpload"
              class="upload-confirm-btn mt-3"
              :disabled="loadingUpload"
            >
              <span v-if="!doneUpload">
                <span class="spinner-border spinner-border-sm mr-1" v-if="loadingUpload"></span>
                <i class="icofont-cloud-upload mr-1" v-else></i>
                Upload Photo
              </span>
              <span v-else class="text-success font-weight-bold">
                <i class="icofont-tick-mark mr-1"></i>
                Saved!
              </span>
            </button>

            <!-- Names -->
            <div class="profile-names mt-3">
              <div class="short-name-row">
                <h2 class="profile-short-name">{{ data.short_name }}</h2>
                <button
                  v-if="cookeyStatus && !view_only"
                  class="name-edit-btn"
                  @click="addMember(2, data)"
                  title="Edit Profile"
                >
                  <i class="icofont-ui-edit"></i>
                </button>
              </div>
              <div class="profile-full-name" v-if="data.name && data.name !== data.short_name">
                {{ data.name }}
              </div>
            </div>

            <!-- Badges Row -->
            <div class="profile-badges-row mt-2">
              <!-- Gender Badge -->
              <span
                v-if="data.gender"
                class="badge-pill"
                :class="data.gender == '1' ? 'badge-male' : 'badge-female'"
              >
                <i :class="data.gender == '1' ? 'icofont-male' : 'icofont-female'"></i>
                <span>{{ data.gender == "1" ? "Male" : "Female" }}</span>
              </span>

              <!-- Parent / Relation Badge -->
              <span v-if="data.xtra_parent_name" class="badge-pill badge-relation">
                <i class="icofont-users-alt-4"></i>
                <span>{{ data.gender == 1 ? "S/O:" : "D/O:" }} {{ data.xtra_parent_name }}</span>
              </span>

              <!-- Memorial Badge -->
              <span v-if="data.died_on" class="badge-pill badge-memorial">
                <i class="icofont-candle"></i>
                <span>In Memory</span>
              </span>

              <!-- Spouse Badge -->
              <span v-if="data.is_mate" class="badge-pill badge-spouse">
                <i class="icofont-heart-alt"></i>
                <span>Spouse</span>
              </span>
            </div>

            <!-- Quick Action Shortcuts Bar -->
            <div class="quick-shortcuts-bar mt-3">
              <!-- Personal Timeline Shortcut -->
              <router-link
                :to="{ name: 'PersonTimeline', params: { member: id } }"
                class="quick-action-item"
                title="View Timeline"
              >
                <div class="quick-icon-circle icon-timeline">
                  <i class="icofont-sand-clock"></i>
                </div>
                <span class="quick-label">Timeline</span>
              </router-link>

              <!-- Call Shortcut -->
              <a
                v-if="data.mobile"
                :href="'tel:' + data.mobile"
                class="quick-action-item"
                title="Call"
              >
                <div class="quick-icon-circle icon-call">
                  <i class="icofont-phone"></i>
                </div>
                <span class="quick-label">Call</span>
              </a>

              <!-- Email Shortcut -->
              <a
                v-if="data.email"
                :href="'mailto:' + data.email"
                class="quick-action-item"
                title="Email"
              >
                <div class="quick-icon-circle icon-mail">
                  <i class="icofont-envelope"></i>
                </div>
                <span class="quick-label">Email</span>
              </a>

              <!-- Edit Shortcut -->
              <button
                v-if="cookeyStatus && !view_only"
                class="quick-action-item"
                @click="addMember(2, data)"
                title="Edit Details"
              >
                <div class="quick-icon-circle icon-edit">
                  <i class="icofont-edit"></i>
                </div>
                <span class="quick-label">Edit</span>
              </button>
            </div>
          </div>

          <!-- Modern Unified Segmented Tabs Navigation -->
          <div class="member-tabs-container mt-3 px-3">
            <div class="segmented-nav">
              <button
                class="segmented-btn"
                :class="{ active: currentTab === 'actions' }"
                @click="currentTab = 'actions'"
              >
                <i class="icofont-flash mr-1"></i>
                <span>Actions</span>
              </button>
              <button
                class="segmented-btn"
                :class="{ active: currentTab === 'info' }"
                @click="currentTab = 'info'"
              >
                <i class="icofont-id-card mr-1"></i>
                <span>Details</span>
              </button>
            </div>

            <!-- Tab Panels -->
            <div class="tab-panels-body mt-3">
              <transition name="tab-fade" mode="out-in">
                <div v-if="currentTab === 'actions'" key="actions" class="tab-pane">
                  <Actions
                    :cookeyStatus="cookeyStatus"
                    :data="data"
                    :hasMate="hasMate"
                    :viewOnly="view_only"
                    v-on:actionsAddMember="addMember"
                    v-on:actionsDeleteSwipe="deleteSwipe"
                    v-on:actionsReArrange="reArrange"
                    v-on:keyTrue="cookeyStatus = true"
                  ></Actions>
                </div>
                <div v-else-if="currentTab === 'info'" key="info" class="tab-pane">
                  <MoreInfo :id="id" :data="data"></MoreInfo>
                </div>
              </transition>
            </div>
          </div>
        </section>
      </div>
    </Drawer>

    <!-- DualPage rendered outside Drawer so position:fixed bottom sheet works relative to viewport -->
    <DualPage
      :reference="dualPage.ref"
      :payload="payload"
      style="position: relative; z-index: 1000 !important;"
      v-if="dualPage.callForm"
      v-on:closed="addMemberCancel"
    ></DualPage>

    <my-upload
      :class="{ 'img-picker-mob': $device.mobile }"
      field="img"
      @crop-success="cropSuccess"
      :width="200"
      :height="200"
      url
      lang-type="en"
      v-model="show"
      img-format="jpg"
    ></my-upload>
  </div>
</template>

<script>
import Drawer from "vue-simple-drawer";
import axios from "axios";
const Compress = require("compress.js");
import myUpload from "vue-image-crop-upload/upload-2.vue";
import Vue from "vue";
import VModal from "vue-js-modal";
import ProdData from "@/data.js";
import MoreInfo from "./MoreInfo";
import DualPage from "../../modals/DualPage";
import Actions from "./Actions";
import Algos from "@/algos/analytics/relation-finder";
import Store from "@/store/index";

Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true
});

export default {
  name: "MemberData",
  props: {
    memberId: {
      type: String,
      default: null
    },
    surnameProp: {
      type: String,
      default: null
    }
  },
  components: {
    Drawer,
    "my-upload": myUpload,
    MoreInfo,
    DualPage,
    Actions
  },
  data() {
    return {
      loading: true,
      data: null,
      errored: false,
      open: null,
      surname: this.surnameProp || (this.$route && this.$route.params ? this.$route.params.id : ""),
      id: this.memberId || (this.$route && this.$route.params ? this.$route.params.member : ""),
      type: "",
      previewImage: null,
      imageData: "",
      show: false,
      url: null,
      showUpload: false,
      loadingUpload: false,
      doneUpload: false,
      imageExists: false,
      cookeyStatus: false,
      vloading: false,
      hasMate: false,
      retry: false,
      count: 0,
      parent_id: "",
      dualPage: {
        callForm: false,
        ref: 2
      },
      payload: {},
      activeTab: null,
      touchStartY: null,
      touchCurrentY: null,
      isDraggingDown: false
    };
  },
  watch: {
    imageData: {
      handler: function(val) {
        if (val) {
          this.showUpload = true;
        }
      }
    }
  },
  computed: {
    drawerAlign() {
      return (this.$device && this.$device.mobile) ? "down" : "right";
    },
    view_only: {
      get() {
        return Store.state.view_only;
      }
    },
    currentTab: {
      get() {
        if (this.activeTab) {
          return this.activeTab;
        }
        return (this.view_only || !this.cookeyStatus) ? "info" : "actions";
      },
      set(val) {
        this.activeTab = val;
      }
    }
  },
  mounted() {
    this.open = true;
    this.hasMate = (this.$route && this.$route.query && this.$route.query.hasMate) || false;
    this.cookeyStatus = false;
    if (this.$device.mobile) {
      this.toggleBodyClass("addClass", "mem-spec");
    }

    // Person Data API
    axios
      .get(
        ProdData.getHostURL() + "/tree/" + this.surname + "/person/" + this.id
      )
      .then(data => {
        if (data.data.is_mate) {
          this.hasMate = true;
        }
        this.data = data.data;
        this.count = Object.keys(this.data).length - 6;
        this.cookeyStatus = this.data.has_session;
        if (this.data.xtra_parent_id) {
          this.data.xtra_parent_name = Algos.getPersonById(
            Store.getters.getTreeData,
            this.data.xtra_parent_id
          );
        }
      })
      .catch(err => {
        this.errored = err;
      })
      .finally(() => {
        this.loading = false;
      });

    // Image data API
    axios
      .get(
        ProdData.getHostURL() +
          "/tree/" +
          this.surname +
          "/person/" +
          this.id +
          "/image"
      )
      .then(data => {
        if (data.data && data.data.length !== 0) {
          this.previewImage = "data:image/png;base64," + data.data[0][this.id];
          if (this.previewImage === "data:image/png;base64,undefined") {
            this.imageExists = false;
          } else {
            this.count++;
            this.imageExists = true;
          }
        }
      });
  },
  methods: {
    uploadImage() {
      this.loadingUpload = true;
      let params = {};
      params.image_data = this.imageData;
      this.url =
        ProdData.getHostURL() +
        "/tree/" +
        this.surname +
        "/person/" +
        this.id +
        "/image";
      axios
        .post(this.url, params)
        .then(function() {})
        .catch(function() {})
        .finally(() => {
          this.doneUpload = true;
          setTimeout(() => {
            this.showUpload = false;
          }, 2000);
        });
    },
    cropSuccess(imgDataUrl) {
      var arr = imgDataUrl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      let x = new File([u8arr], "Something", { type: mime });
      const compress = new Compress();
      compress
        .compress([x], {
          size: 0.1,
          quality: 0.2,
          maxWidth: 200,
          maxHeight: 200,
          resize: true
        })
        .then(data => {
          this.imageData = data[0].data;
          this.imageExists = true;
          this.previewImage = "data:image/png;base64, " + this.imageData;
        });
    },
    toggle() {
      this.open = false;
      this.$emit("close");
      if (this.memberId) {
        return;
      }
      let routerLink = {};
      if (this.$route.params.subtree_id) {
        routerLink = {
          name: "Subtrees",
          params: { subtree_id: this.$route.params.subtree_id }
        };
      } else {
        routerLink = {
          name: "MainTree",
          params: { id: this.$route.params.id }
        };
      }
      this.$router.push(routerLink);
    },
    addMember(num, memData) {
      this.payload.memData = memData;
      this.payload.gender = this.data.gender == 0 ? "male" : "female";
      this.payload.type = num;
      this.dualPage.callForm = true;
      this.dualPage.ref = 2;
      if (this.data.is_mate) {
        this.payload.parent_id = this.data.parent_id;
        this.payload.xtra_parent_id = this.id;
      } else {
        this.payload.parent_id = this.id;
      }
    },
    deleteSwipe() {
      this.dualPage.callForm = true;
      this.dualPage.ref = 3;
      this.payload.name = this.data.name;
      this.payload.is_mate = this.data.is_mate;
      this.payload.gender = this.data.gender;
    },
    reArrange() {
      this.dualPage.callForm = true;
      this.dualPage.ref = 9;
      this.payload.parent_id = this.data.parent_id;
    },
    addMemberCancel() {
      this.dualPage.callForm = false;
    },
    handleTouchStart(e) {
      if (!this.$device || !this.$device.mobile) return;
      const drawer = this.$el.querySelector(".vue-simple-drawer");
      if (drawer && drawer.scrollTop > 5) {
        this.isDraggingDown = false;
        return;
      }
      this.touchStartY = e.touches[0].clientY;
      this.touchCurrentY = this.touchStartY;
      this.isDraggingDown = false;
    },
    handleTouchMove(e) {
      if (!this.$device || !this.$device.mobile || !this.touchStartY) return;
      const drawer = this.$el.querySelector(".vue-simple-drawer");
      if (drawer && drawer.scrollTop > 5) return;

      this.touchCurrentY = e.touches[0].clientY;
      const deltaY = this.touchCurrentY - this.touchStartY;

      if (deltaY > 8) {
        this.isDraggingDown = true;
        if (drawer) {
          drawer.style.transition = "none";
          drawer.style.transform = `translate3d(0, ${deltaY}px, 0)`;
        }
      }
    },
    handleTouchEnd() {
      if (!this.$device || !this.$device.mobile || !this.isDraggingDown) {
        this.touchStartY = null;
        this.isDraggingDown = false;
        return;
      }
      const deltaY = this.touchCurrentY - this.touchStartY;
      const drawer = this.$el.querySelector(".vue-simple-drawer");

      this.touchStartY = null;
      this.isDraggingDown = false;

      if (drawer) {
        if (deltaY > 80) {
          drawer.style.transition = "transform 0.25s cubic-bezier(0.4, 0, 0.6, 1)";
          drawer.style.transform = "translate3d(0, 100%, 0)";
          setTimeout(() => {
            this.toggle();
            if (drawer) {
              drawer.style.transform = "";
              drawer.style.transition = "";
            }
          }, 250);
        } else {
          drawer.style.transition = "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)";
          drawer.style.transform = "translate3d(0, 0, 0)";
          setTimeout(() => {
            if (drawer) {
              drawer.style.transform = "";
              drawer.style.transition = "";
            }
          }, 200);
        }
      }
    },
    toggleBodyClass(addRemoveClass, className) {
      const el = document.body;
      if (addRemoveClass === "addClass") {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    }
  },
  destroyed() {
    this.toggleBodyClass("removeClass", "mem-spec");
  }
};
</script>

<style>
/* Vue Image Crop Upload adjustments */
.vicp-img {
  max-width: none;
}
.img-picker-mob .vicp-wrap {
  width: 320px;
  height: 520px;
}

/* Base Drawer Customization */
.vue-simple-drawer {
  position: fixed !important;
  background: rgba(15, 20, 36, 0.94) !important;
  backdrop-filter: blur(28px) !important;
  -webkit-backdrop-filter: blur(28px) !important;
  border-left: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: #fff;
  box-shadow: -12px 0 40px rgba(0, 0, 0, 0.6) !important;
  width: 440px !important;
  max-width: 100% !important;
  right: 0 !important;
  left: auto !important;
  top: 0 !important;
  bottom: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding: 0 !important;
  z-index: 101 !important;
}

.mask {
  z-index: 100 !important;
  backdrop-filter: blur(6px) !important;
  -webkit-backdrop-filter: blur(6px) !important;
  background-color: rgba(5, 8, 18, 0.6) !important;
}

/* Mobile bottom-sheet drawer adaptation */
@media (max-width: 768px) {
  .vue-simple-drawer {
    width: 100% !important;
    max-width: 100% !important;
    left: 0 !important;
    right: 0 !important;
    top: 50px !important;
    bottom: 0 !important;
    border-radius: 24px 24px 0 0 !important;
    border-left: none !important;
    border-top: 1px solid rgba(255, 255, 255, 0.14) !important;
    box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.7) !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }

  .animated.bounceIndown {
    animation-name: mobileProfileSlideUp !important;
    animation-duration: 0.32s !important;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  .animated.bounceOutdown {
    animation-name: mobileProfileSlideDown !important;
    animation-duration: 0.25s !important;
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1) !important;
  }
}

@keyframes mobileProfileSlideUp {
  0% {
    transform: translate3d(0, 100%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes mobileProfileSlideDown {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, 100%, 0);
  }
}

.drawer-inner-container {
  position: relative;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: max(32px, env(safe-area-inset-bottom));
}

.drawer-scroll-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Mobile drag indicator */
.drawer-drag-area {
  width: 100%;
  padding: 14px 0 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  touch-action: pan-y;
  flex-shrink: 0;
}

.drawer-drag-pill {
  width: 44px;
  height: 5px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 99px;
  margin: 0;
}

/* Sleek close button */
.drawer-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
}
.drawer-close-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  transform: scale(1.06);
}

/* Hero Profile Card */
.hero-profile-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px 20px 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* Avatar & Halo */
.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 124px;
  height: 124px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f8ef7, #ec4899, #8b5cf6);
  filter: blur(12px);
  opacity: 0.65;
  animation: auraPulse 6s ease-in-out infinite alternate;
}

@keyframes auraPulse {
  0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.8; }
}

.avatar-frame {
  position: relative;
  width: 110px;
  height: 110px;
  z-index: 1;
}

.profile-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}

.avatar-camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f8ef7, #8b5cf6);
  border: 2px solid #0f1424;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79, 142, 247, 0.4);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.avatar-camera-btn:hover {
  transform: scale(1.12);
}

/* Upload confirm button */
.upload-confirm-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 99px;
  padding: 6px 18px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  cursor: pointer;
  transition: all 0.2s ease;
}
.upload-confirm-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.5);
}

/* Names Section */
.profile-names {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.short-name-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-short-name {
  font-size: 24px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
  letter-spacing: -0.3px;
}

.name-edit-btn {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 15px;
  cursor: pointer;
  padding: 4px;
  margin-left: 6px;
  transition: color 0.2s ease;
}
.name-edit-btn:hover {
  color: #4f8ef7;
}

.profile-full-name {
  font-size: 13.5px;
  color: #94a3b8;
  margin-top: 3px;
  font-weight: 500;
}

/* Badges Row */
.profile-badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 99px;
  backdrop-filter: blur(8px);
}

.badge-male {
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

.badge-female {
  background: rgba(236, 72, 153, 0.15);
  border: 1px solid rgba(236, 72, 153, 0.3);
  color: #f472b6;
}

.badge-relation {
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #c084fc;
}

.badge-memorial {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #fbbf24;
}

.badge-spouse {
  background: rgba(244, 63, 94, 0.15);
  border: 1px solid rgba(244, 63, 94, 0.3);
  color: #fb7185;
}

/* Quick Action Shortcuts Bar */
.quick-shortcuts-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  width: 100%;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #cbd5e1;
  text-decoration: none !important;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0;
}
.quick-action-item:hover {
  transform: translateY(-2px);
}

.quick-icon-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
}

.icon-timeline {
  background: rgba(99, 102, 241, 0.18);
  border: 1px solid rgba(99, 102, 241, 0.35);
  color: #818cf8;
}
.quick-action-item:hover .icon-timeline {
  background: rgba(99, 102, 241, 0.3);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
}

.icon-call {
  background: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
}
.quick-action-item:hover .icon-call {
  background: rgba(16, 185, 129, 0.3);
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
}

.icon-mail {
  background: rgba(245, 158, 11, 0.18);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
}
.quick-action-item:hover .icon-mail {
  background: rgba(245, 158, 11, 0.3);
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
}

.icon-edit {
  background: rgba(59, 130, 246, 0.18);
  border: 1px solid rgba(59, 130, 246, 0.35);
  color: #60a5fa;
}
.quick-action-item:hover .icon-edit {
  background: rgba(59, 130, 246, 0.3);
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}

.quick-label {
  font-size: 11.5px;
  font-weight: 500;
  color: #94a3b8;
}

/* Modern Segmented Navigation */
.member-tabs-container {
  width: 100%;
}

.segmented-nav {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.segmented-btn {
  flex: 1;
  padding: 9px 16px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #94a3b8;
  font-weight: 600;
  font-size: 13.5px;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.segmented-btn:hover {
  color: #e2e8f0;
}

.segmented-btn.active {
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.35), rgba(167, 139, 250, 0.35));
  color: #fff;
  box-shadow: 0 4px 16px rgba(79, 142, 247, 0.25);
  border: 1px solid rgba(167, 139, 250, 0.4);
}

.tab-panels-body {
  width: 100%;
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.tab-fade-enter {
  opacity: 0;
  transform: translateY(4px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Modern Molecular Loader */
.loading-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
.loading-hint {
  font-size: 13px;
  color: #94a3b8;
  letter-spacing: 0.3px;
}
.modern-loader {
  position: relative;
  width: 48px;
  height: 48px;
  animation: loader-spin 2s linear infinite;
}
.modern-loader::before,
.modern-loader::after {
  content: '';
  position: absolute;
  top: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #4f8ef7;
  box-shadow: 0 0 16px rgba(79, 142, 247, 0.6);
  animation: loader-bounce 1s ease-in-out infinite alternate;
}
.modern-loader::after {
  bottom: 0;
  top: auto;
  background: #a78bfa;
  box-shadow: 0 0 16px rgba(167, 139, 250, 0.6);
  animation-delay: -1s;
}
@keyframes loader-spin { 100% { transform: rotate(360deg); } }
@keyframes loader-bounce { 0% { transform: scale(0.6); } 100% { transform: scale(1.2); } }
</style>