<template>
  <Drawer @close="toggle" align="right" :closeable="true" :maskClosable="true">
    <div v-if="open">
      <section v-if="errored">
        err
        <p>{{ errored }}</p>
      </section>
      <section v-else>
        <div v-if="loading" class="container_image mx-auto">
          <center style="padding-top: 240px">
            <img src="@/assets/dna.gif" alt="Bloodline Loader" />
          </center>
        </div>
        <div v-else>
          <div class="container_image mx-auto">
            <div v-if="imageExists">
              <img
                :src="previewImage"
                alt="Avatar"
                class="image mx-auto"
                style="border-radius: 50%; width: 150px"
              />
            </div>
            <div v-else>
              <img
                src="../../assets/profile.png"
                alt="Family Tree Loading"
                class="image mx-auto"
                style="border-radius: 50%; width: 150px"
              />
            </div>

            <div class="middle" v-if="cookeyStatus && !view_only">
              <div class="member-txt">
                <a
                  class="btn"
                  @click="show = true"
                  style="color: white !important"
                >
                  <i class="icofont-edit"></i>
                  Change
                </a>
              </div>
            </div>
          </div>

          <button
            @click="uploadImage"
            v-show="showUpload"
            class="btn btn-success mt-3"
            :disabled="loadingUpload"
          >
            <span v-if="!doneUpload">
              <span
                class="spinner-border spinner-border-sm"
                v-if="loadingUpload"
              ></span>
              <i class="icofont-cloud-upload" v-else></i>
              Upload Image
            </span>
            <span v-else>
              <i class="icofont-tick-mark"></i>
              Successfully Uploaded
            </span>
          </button>

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
          <!-- <KProgress :percent="(count/8)*100" :line-height="4" color="green" class="mx-auto mt-4 col-10"></KProgress> -->
          <table class="table table-borderless table-hover mt-3 table-data">
            <tbody class="text-left" style="color: black">
              <tr class="text-center">
                <td>
                  {{ data.short_name }}
                  <i
                    class="icofont-edit float-right"
                    @click="addMember(2, data)"
                    style="font-size: 20px"
                    v-show="cookeyStatus && !view_only"
                  ></i>
                </td>
              </tr>
              <tr>
                <td style="border-left: 3px solid red">
                  <i class="icofont-business-man"></i>
                  {{ data.name }}
                </td>
              </tr>
              <tr v-if="data.gender">
                <td style="border-left: 3px solid orange">
                  <span v-if="data.gender == 1">
                    <i class="icofont-male"></i>
                  </span>
                  <span v-else>
                    <i class="icofont-female"></i>
                  </span>
                  {{ data.gender == "1" ? "Male" : "Female" }}
                </td>
              </tr>
              <tr v-if="data.xtra_parent_name">
                <td style="border-left: 3px solid blue">
                  <span v-if="data.gender == 1"> S/O : </span>
                  <span v-else> D/O : </span>
                  {{ data.xtra_parent_name }}
                </td>
              </tr>
            </tbody>

            <!-- Accordian for Mobile -->
            <div v-if="$device.mobile && cookeyStatus" class="mt-3">
              <div id="accordion">
                <!-- Actions Card -->
                <div class="mb-1">
                  <!-- Actions Heading -->
                  <button
                    class="btn p-0"
                    style="color: #007bff; width: 100%"
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
                    style="color: #007bff; width: 100%"
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
          </table>
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
  <!-- </div> -->
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
  injectModalsContainer: true,
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
    Actions,
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
        ref: 2,
      },
      payload: {},
    };
  },
  watch: {
    imageData: {
      handler: function (val) {
        if (val) {
          this.showUpload = true;
        }
      },
    },
  },
  computed: {
    view_only: {
      get() {
        return Store.state.view_only;
      },
    },
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
      .then((data) => {
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
      .catch((err) => {
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
      .then((data) => {
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
        .then(function () {})
        .catch(function () {})
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
          resize: true,
        })
        .then((data) => {
          this.imageData = data[0].data;
          this.imageExists = true;
          this.previewImage = "data:image/png;base64, " + this.imageData;
        });
    },
    toggle() {
      this.open = false;
      this.$router.push({
        name: "MainTree",
        params: { id: this.$route.params.id },
      });
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
    reArrange(){
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
    },
  },
  destroyed() {
    this.toggleBodyClass("removeClass", "mem-spec");
  },
};
</script>

<style>
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
  background: white !important;
  box-shadow: 20px black;
  color: black;
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
  border: solid 1px #ddd;
  border-radius: 6px;
  margin-bottom: 5px;
}

@media (min-width: 700px) {
  .tabs-component-tabs {
    border: 0;
    align-items: stretch;
    display: flex;
    justify-content: flex-start;
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
  color: #666;
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
    background-color: #fff;
    border: solid 1px #ddd;
    border-radius: 3px 3px 0 0;
    margin-right: 0.5em;
    transform: translateY(2px);
    transition: transform 0.3s ease;
  }

  .tabs-component-tab.is-active {
    border-bottom: solid 1px #fff;
    z-index: 2;
    transform: translateY(0);
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
  color: black;
}

.mobile-member-drawer {
  left: 0% !important;
  width: 100%;
  top: 0%;
  height: 100%;
}

.mask {
  z-index: 10 !important;
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
    left: 70% !important;
    position: fixed;
  }
  .tabs-component-panels {
    border-top-left-radius: 0;
    background-color: #fff;
    border-top: solid 1px #ddd;
  }
}
</style>