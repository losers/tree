<template>
  <div>
    <Drawer @close="toggle" align="right" :closeable="true" :maskClosable="true">
    <div v-if="open">
      <section v-if="errored">
        err
        <p>{{ errored }}</p>
      </section>
      <section v-else>
        <div v-if="loading" class="loading-wrapper">
          <div class="modern-loader"></div>
        </div>
        <div v-else>
          <div class="container_image mx-auto" style="margin-top: 30px; margin-bottom: 20px;">
            <div class="animated-halo"></div>
            <div v-if="imageExists" style="position: relative; z-index: 1;">
              <img
                :src="previewImage"
                alt="Avatar"
                class="image mx-auto modern-avatar"
              />
            </div>
            <div v-else style="position: relative; z-index: 1;">
              <img
                src="../../assets/profile.png"
                alt="Family Tree Loading"
                class="image mx-auto modern-avatar"
              />
            </div>

            <div class="middle" v-if="cookeyStatus && !view_only">
              <div class="member-txt">
                <a class="btn" @click="show = true" style="color: white !important">
                  <i class="icofont-edit"></i>
                  Change
                </a>
              </div>
            </div>
          </div>

          <button
            @click="uploadImage"
            v-show="showUpload"
            class="my-btn mt-3"
            :disabled="loadingUpload"
          >
            <span v-if="!doneUpload">
              <span class="spinner-border spinner-border-sm" v-if="loadingUpload"></span>
              <i class="icofont-cloud-upload" v-else></i>
              Upload Image
            </span>
            <span v-else>
              <i class="icofont-tick-mark"></i>
              Successfully Uploaded
            </span>
          </button>

          <!-- <KProgress :percent="(count/8)*100" :line-height="4" color="green" class="mx-auto mt-4 col-10"></KProgress> -->
          <!-- Modern Info Cards -->
          <div class="info-cards-container mt-4">
            <div class="info-card title-card" style="justify-content: center; background: transparent; border: none; box-shadow: none;">
              <span class="info-text font-weight-bold" style="font-size: 22px; letter-spacing: 0.5px;">
                {{ data.short_name }}
              </span>
              <i
                class="icofont-edit edit-icon ml-2 cursor"
                @click="addMember(2, data)"
                v-show="cookeyStatus && !view_only"
              ></i>
            </div>
            
            <div class="info-card">
              <div class="icon-wrapper" style="background: rgba(255, 71, 87, 0.15); color: #ff4757;">
                <i class="icofont-business-man"></i>
              </div>
              <span class="info-text">{{ data.name }}</span>
            </div>

            <div class="info-card" v-if="data.gender">
              <div class="icon-wrapper" style="background: rgba(255, 165, 2, 0.15); color: #ffa502;">
                <i :class="data.gender == 1 ? 'icofont-male' : 'icofont-female'"></i>
              </div>
              <span class="info-text">{{ data.gender == "1" ? "Male" : "Female" }}</span>
            </div>

            <div class="info-card" v-if="data.xtra_parent_name">
              <div class="icon-wrapper" style="background: rgba(79, 142, 247, 0.15); color: #4f8ef7;">
                <i class="icofont-users-alt-4"></i>
              </div>
              <span class="info-text">
                <span style="opacity: 0.6; margin-right: 6px;">{{ data.gender == 1 ? "S/O:" : "D/O:" }}</span>
                {{ data.xtra_parent_name }}
              </span>
            </div>
          </div>

            <!-- Accordian for Mobile -->
            <div v-if="$device.mobile && cookeyStatus" class="mt-3">
              <div id="accordion">
                <!-- Actions Card -->
                <div class="mb-1">
                  <!-- Actions Heading -->
                  <button
                    class="btn p-0"
                    style="color: #a78bfa; width: 100%; font-weight: bold;"
                    data-toggle="collapse"
                    data-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    <div class="card-header" id="headingOne">Actions</div>
                  </button>

                  <!-- Actions Body -->
                  <div
                    id="collapseOne"
                    class="collapse"
                    aria-labelledby="headingOne"
                    data-parent="#accordion"
                    :class="{ show: !view_only }"
                  >
                    <div class="card-body">
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
                  </div>
                </div>

                <!-- More Info Card -->
                <div>
                  <!-- INfo HEading -->
                  <button
                    class="btn p-0 collapsed"
                    style="color: #a78bfa; width: 100%; font-weight: bold;"
                    data-toggle="collapse"
                    data-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    <div class="card-header" id="headingTwo">More Info</div>
                  </button>

                  <!-- Info Body -->
                  <div
                    id="collapseTwo"
                    class="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordion"
                    :class="{ show: view_only }"
                  >
                    <div class="card-body" style="padding: 0px">
                      <MoreInfo :id="id" :data="data"></MoreInfo>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabbar for Laptops-->
            <tabs v-else :style="{ display: cookeyStatus ? 'block' : 'none' }">
              <tab
                name="Actions"
                :class="{
                  'is-active': !cookeyStatus,
                }"
              >
                <!-- Actions -->
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
              </tab>
              <tab
                name="More Info"
                :class="{
                  'is-active': cookeyStatus,
                }"
              >
                <MoreInfo :id="id" :data="data"></MoreInfo>
              </tab>
            </tabs>
        </div>
      </section>
    </div>
    <DualPage
      :reference="dualPage.ref"
      :payload="payload"
      style="z-index: 102 !important"
      v-if="dualPage.callForm"
      v-on:closed="addMemberCancel"
    ></DualPage>
  </Drawer>
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
import { Tabs, Tab } from "vue-tabs-component";
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
  components: {
    Drawer,
    "my-upload": myUpload,
    Tabs,
    Tab,
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
      surname: this.$route.params.id,
      id: this.$route.params.member,
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
      retry: false, //stores key status
      count: 0,
      parent_id: "",
      dualPage: {
        callForm: false,
        ref: 2
      },
      payload: {}
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
    view_only: {
      get() {
        return Store.state.view_only;
      }
    }
  },
  mounted() {
    this.open = true;
    this.hasMate = this.$route.query.hasMate;
    this.cookeyStatus = false; //Check version
    if (this.$device.mobile) {
      this.toggleBodyClass("addClass", "mem-spec");
    }

    //Person Data API
    axios
      .get(
        ProdData.getHostURL() + "/tree/" + this.surname + "/person/" + this.id
      )
      .then(data => {
        if (data.data.is_mate) {
          this.hasMate = true;
        }
        this.data = data.data;
        this.count = Object.keys(this.data).length - 6; //decremented 1 for image status
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
    //Image data API
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
        if (data.data.length != 0) {
          this.previewImage = "data:image/png;base64," + data.data[0][this.id];
          if (this.previewImage == "data:image/png;base64,undefined") {
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
      let routerLink = {};
      if (this.$route.params.subtree_id) {
        routerLink = {
          name: "Subtrees",
          params: {subtree_id:  this.$route.params.subtree_id}
        };
      }
      else{
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
.vicp-img{
  max-width: none;
}
.badge {
  position: absolute;
  right: -10px;
  top: -10px;
  border-radius: 50%;
  background: indianred;
  color: white;
}
.img-picker-mob .vicp-wrap {
  width: 300px;
  height: 500px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

.vue-simple-drawer {
  position: absolute;
  background: rgba(15, 17, 35, 0.75) !important;
  backdrop-filter: blur(40px) !important;
  border-left: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: #fff;
  -webkit-box-shadow: -18px -1px 26px -17px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: -18px -1px 26px -17px rgba(0, 0, 0, 0.75);
  box-shadow: -18px -1px 26px -17px rgba(0, 0, 0, 0.75);
}
.container_image {
  position: relative;
}
.image {
  opacity: 1;
  display: block;
  width: 100%;
  height: auto;
  transition: 0.5s ease;
  backface-visibility: hidden;
}
.middle {
  transition: 0.5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
}
.container_image:hover .image {
  opacity: 0.3;
}
.container_image:hover .middle {
  opacity: 1;
}
.member-txt {
  background-color: #4caf50;
  border-radius: 5px;
  font-size: 10px;
}
.tabs-component {
  margin-top: 30px;
}

.tabs-component-tabs {
  border: 0;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  margin-bottom: 10px;
}

@media (min-width: 700px) {
  .tabs-component-tabs {
    border: 0;
    align-items: stretch;
    display: flex;
    justify-content: center;
    margin-bottom: -1px;
    padding-left: 0 !important;
  }
}

.tabs-component-tab {
  color: #999;
  font-size: 14px;
  font-weight: 600;
  margin-right: 0;
  list-style: none;
}

.tabs-component-tab:not(:last-child) {
  border-bottom: dotted 1px #ddd;
}

.tabs-component-tab:hover {
  color: #4f8ef7;
  text-shadow: 0 0 8px rgba(79,142,247,0.5);
}

.tabs-component-tab.is-active {
  color: #000;
}

.tabs-component-tab.is-disabled * {
  color: #cdcdcd;
  cursor: not-allowed !important;
}

@media (min-width: 700px) {
  .tabs-component-tab {
    background-color: transparent;
    border: none !important;
    border-radius: 12px;
    margin-right: 0.5em;
    transition: transform 0.3s ease;
  }

  .tabs-component-tab.is-active {
    background-color: rgba(79, 142, 247, 0.15) !important;
    color: #4f8ef7 !important;
    border-bottom: 2px solid #4f8ef7 !important;
  }
}

.tabs-component-tab-a {
  align-items: center;
  color: inherit;
  display: flex;
  padding: 0.75em 1em;

  text-decoration: none;
}

.tabs-component-panels {
  padding-top: 20px;
  height: 200px;
  color: #fff;
}

.mobile-member-drawer {
  left: 0% !important;
  width: 100%;
  top: 0%;
  height: 100%;
}

.mask {
  z-index: 100 !important;
}
.vue-simple-drawer {
  z-index: 101 !important;
}
@media (min-width: 120px) {
  .vue-simple-drawer.right {
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
}

@media (min-width: 720px) {
  .vue-simple-drawer {
    left: 60% !important;
    position: fixed;
  }
  .tabs-component-panels {
    border-top-left-radius: 0;
    background-color: transparent;
    border-top: none;
  }
}
.my-btn {
  background: linear-gradient(135deg, #4f8ef7, #a78bfa) !important;
  border: none !important;
  padding: 10px 24px !important;
  border-radius: 12px !important;
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

/* Modern MemberData Styles */
.animated-halo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff007f, #7928ca, #4f8ef7, #00d2ff);
  background-size: 400% 400%;
  animation: glowingHalo 8s ease infinite;
  z-index: 0;
  filter: blur(14px);
  opacity: 0.8;
}

@keyframes glowingHalo {
  0% { background-position: 0% 50%; transform: translate(-50%, -50%) rotate(0deg); }
  50% { background-position: 100% 50%; transform: translate(-50%, -50%) rotate(180deg); }
  100% { background-position: 0% 50%; transform: translate(-50%, -50%) rotate(360deg); }
}

.modern-avatar {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.info-cards-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 10px;
}

.info-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px 16px;
  transition: transform 0.3s ease, background 0.3s ease;
  backdrop-filter: blur(10px);
}

.info-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  margin-right: 16px;
  font-size: 20px;
  flex-shrink: 0;
}

.info-text {
  color: #fff;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
}

/* Modern Molecular Loader */
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
.modern-loader {
  position: relative;
  width: 50px;
  height: 50px;
  animation: loader-spin 2s linear infinite;
}
.modern-loader::before,
.modern-loader::after {
  content: '';
  position: absolute;
  top: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #4f8ef7;
  box-shadow: 0 0 15px rgba(79, 142, 247, 0.6);
  animation: loader-bounce 1s ease-in-out infinite alternate;
}
.modern-loader::after {
  bottom: 0;
  top: auto;
  background: #a78bfa;
  box-shadow: 0 0 15px rgba(167, 139, 250, 0.6);
  animation-delay: -1s;
}
@keyframes loader-spin { 100% { transform: rotate(360deg); } }
@keyframes loader-bounce { 0% { transform: scale(0.6); } 100% { transform: scale(1.2); } }
</style>