<template>
  <Drawer @close="toggle" align="right" :closeable="true" :maskClosable="true">
    <div v-if="open">
      <section v-if="errored">
        err
        <p>{{errored}}</p>
      </section>
      <section v-else>
        <div v-if="loading" class="container_image mx-auto">
          <center>
            <img src="@/assets/dna.gif" alt="Family Tree Loading" />
          </center>
        </div>
        <div v-else>
          <div class="container_image mx-auto">
            <div v-if="imageExists">
              <img
                :src="previewImage"
                alt="Avatar"
                class="image mx-auto"
                style="border-radius: 50%;width: 150px;"
              />
            </div>
            <div v-else>
              <img
                src="../../assets/profile.png"
                alt="Family Tree Loading"
                class="image mx-auto"
                style="border-radius: 50%;width: 150px;"
              />
            </div>

            <div class="middle" v-show="cookeyStatus">
              <div class="member-txt">
                <a class="btn" @click="show=true" style="color: white!important;">
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
              <span class="spinner-border spinner-border-sm" v-if="loadingUpload"></span>
              <i class="icofont-cloud-upload" v-else></i>
              Upload Image
            </span>
            <span v-else>
              <i class="icofont-tick-mark"></i>
              Successfully Uploaded
            </span>
          </button>

          <my-upload
            field="img"
            @crop-success="cropSuccess"
            :width="300"
            :height="300"
            url
            lang-type="en"
            v-model="show"
            img-format="jpg"
          ></my-upload>
          <!-- <KProgress :percent="(count/8)*100" :line-height="4" color="green" class="mx-auto mt-4 col-10"></KProgress> -->
          <table class="table table-borderless table-hover mt-3 table-data">
            <tbody class="text-left" style="color:black">
              <tr class="text-center">
                <td>
                  {{data.short_name}}
                  <i
                    class="icofont-edit float-right"
                    @click="showUpdateForm(data)"
                    style="font-size:20px"
                    v-show="cookeyStatus"
                  ></i>
                </td>
              </tr>
              <tr>
                <td style="border-left:3px solid red;">
                  <i class="icofont-business-man"></i>
                  {{data.name}}
                </td>
              </tr>
              <tr v-if="data.gender">
                <td style="border-left:3px solid orange;">
                  <span v-if="data.gender==1">
                    <i class="icofont-male"></i>
                  </span>
                  <span v-else>
                    <i class="icofont-female"></i>
                  </span>
                  {{data.gender=="1"?"Male":"Female"}}
                </td>
              </tr>
            </tbody>

            <!-- Tabbar -->
            <tabs>
              <tab name="Actions">
                <!-- Actions -->
                <transition name="fade" mode="out-in">
                  <div class="mx-auto col-12" v-if="cookeyStatus">
                    <button
                      @click="addMember(0)"
                      class="col-10 btn btn-warning mb-3"
                      v-show="!data.parent_id"
                    >+ Add Parent</button>

                    <button @click="addMember(1)" class="col-10 btn btn-success mb-3">+ Add Child</button>

                    <button
                      v-show="!hasMate"
                      @click="addMember('gender')"
                      class="col-10 btn btn-primary mb-3"
                    >+ Add {{data.gender=="1"?"Wife":"Husband"}}</button>

                    <button @click="deleteSwipe" class="btn btn-danger col-10 mb-3">
                      <i class="icofont-ui-delete"></i> Delete
                    </button>
                  </div>
                  <div v-else>
                    <span class="col-4">
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
                        :disabled="loading"
                      >
                        <!-- <button v-show="retry" class="btn btn-warning btn-sm"></button> -->
                        <span class="spinner-border spinner-border-sm" v-show="vloading"></span>
                        {{retry?"Retry":"Validate"}}
                      </button>
                    </span>
                  </div>
                </transition>
              </tab>
              <tab name="More Info" :is-disabled="!cookeyStatus">
                <MoreInfo :id="id" :data="data"></MoreInfo>
              </tab>
            </tabs>
          </table>
        </div>
      </section>
    </div>
    <DualPage
      :reference="2"
      style="z-index:102!important"
      v-if="callForm"
      :gender="data.gender==1?'female':'male'"
      :type="type"
      :parent_id="parent_id"
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
import Delete from "@/components/DeleteMember";
import CommonForm from "../AddCommonForm";
import ProdData from "@/data.js";
import Store from "@/store/index";
import { Tabs, Tab } from "vue-tabs-component";
import MoreInfo from "./MoreInfo";
import DualPage from "../../modals/DualPage";

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
    DualPage
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
      cookey: "",
      cookeyStatus: false,
      vloading: false,
      hasMate: false,
      retry: false, //stores key status
      count: 0,
      callForm: false,
      parent_id: ""
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
  mounted() {
    this.callForm = false;
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
    validate() {
      this.vloading = true;
      let sessionUrl = ProdData.getHostURL() + "/sessions/";
      let params = {};
      params.pin = this.cookey;
      params.surname = this.surname;
      axios
        .post(sessionUrl, params)
        .then(() => {
          this.cookeyStatus = true;
          this.vloading = false;
          Store.commit("setSession", true);
        })
        .catch(() => {
          this.retry = true;
        })
        .finally(() => {
          this.vloading = false;
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
      this.$router.push({
        name: "MainTree",
        params: { id: this.$route.params.id }
      });
    },
    showUpdateForm(formd) {
      this.$modal.show(
        CommonForm,
        {
          memData: formd
        },
        {
          height: "auto",
          draggable: true,
          clickToClose: false,
          scrollable: true
        }
      );
    },
    addMember(num) {
      this.type = num;
      this.callForm = true;
      if (this.data.is_mate) {
        this.parent_id = this.data.parent_id;
      } else {
        this.parent_id = this.id;
      }
      // if (this.$route.query.hasMate) {
      //   this.$router.push({
      //     name: "AddMember",
      //     params: { type: num },
      //     query: {
      //       parent_id: this.data.is_mate ? this.data.parent_id : this.data._id,
      //       hasMate: true
      //     }
      //   });
      // } else {
      //   this.$router.push({
      //     name: "AddMember",
      //     params: { type: num },
      //     query: {
      //       parent_id: this.data.is_mate ? this.data.parent_id : this.data._id
      //     }
      //   });
      // }
    },
    deleteSwipe() {
      this.$modal.show(
        Delete,
        {
          name: this.data.name
        },
        {
          height: "auto",
          clickToClose: false,
          scrollable: true,
          draggable: true
        }
      );
      this.open = false;
    },
    addMemberCancel() {
      this.callForm = false;
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