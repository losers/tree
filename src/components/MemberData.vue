<template>
  <div style="left:70%!important;">
    <router-view></router-view>
    <Drawer @close="toggle" align="right" :closeable="true" @click.stop="disable">
      <div v-if="open">
        <section v-if="errored">
          <p>{{errored}}</p>
        </section>
        <section v-else>
          <div v-if="loading" style="margin-top:240px">
            <center>
              <img src="@/assets/dna.gif" />
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
                  src="../assets/profile.png"
                  alt="Avatar"
                  class="image mx-auto"
                  style="border-radius: 50%;width: 150px;"
                />
              </div>

              <div class="middle" v-show="cookeyStatus">
                <div class="member-txt">
                  <a class="btn" @click="show=true">
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
            <table class="table table-borderless table-hover mt-5 table-data">
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
                <tr v-if="data.mobile">
                  <td style="border-left:3px solid yellow;">
                    <i class="icofont-smart-phone"></i>
                    {{data.mobile}}
                  </td>
                </tr>
                <tr v-if="data.dob">
                  <td style="border-left:3px solid brown;">
                    <i class="icofont-ui-calendar"></i>
                    {{data.dob}}
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
                <tr>
                  <td style="border-left:3px solid black;">
                    <i class="icofont-listing-box"></i>
                    Add some description here
                  </td>
                </tr>
              </tbody>
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
            </table>
          </div>
        </section>
      </div>
    </Drawer>
  </div>
</template>

<script>
import Drawer from "vue-simple-drawer";
import axios from "axios";
const Compress = require("compress.js");
import myUpload from "vue-image-crop-upload/upload-2.vue";
import Vue from "vue";
import VModal from "vue-js-modal";
import Delete from "../components/DeleteMember";
import CommonForm from "./AddCommonForm";

Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true
});

export default {
  name: "MemberData",
  components: {
    Drawer,
    "my-upload": myUpload
  },
  data() {
    return {
      loading: true,
      data: null,
      errored: false,
      open: null,
      surname: this.$route.params.id,
      id: this.$route.params.member,
      type: this.$route.params.type,
      previewImage: null,
      imageData: "",
      show: false,
      url: null,
      showUpload: false,
      loadingUpload: false,
      doneUpload: false,
      imageExists: false,
      cookey: "",
      cookeyStatus: null,
      vloading: false,
      hasMate: false,
      retry: false //stores key status
    };
  },
  watch: {
    imageData: {
      handler: function(val) {
        console.log(val);
        if (val) {
          this.showUpload = true;
        }
      }
    }
  },
  mounted() {
    this.hasMate = this.$route.query.hasMate;
    this.cookeyStatus = null; //Check version
    axios
      .get("http://localhost:5000/tree/" + this.surname + "/person/" + this.id)
      .then(data => {
        if (data.data.is_mate) {
          this.hasMate = true;
        }
        this.data = data.data;
        this.cookeyStatus = this.data.has_session;
      })
      .catch(err => {
        this.errored = err;
      })
      .finally(() => {
        this.loading = false;
      });

    axios
      .get(
        "http://localhost:5000/tree/" +
          this.surname +
          "/person/" +
          this.id +
          "/image"
      )
      .then(data => {
        this.data = data.data;
        if (this.data.length != 0) {
          this.previewImage = "data:image/png;base64," + this.data[0][this.id];
          if (this.previewImage == "data:image/png;base64,undefined") {
            this.imageExists = false;
          } else {
            this.imageExists = true;
            console.log("exists no");
          }
        }
      })
      .catch(err => {
        this.errored = err;
        console.log("no");
        this.imageExists = false;
      });
    this.$root.$on("canceled", addedMate => {
      if (addedMate) {
        this.hasMate = false;
      }
      this.open = true;
    });
    if (this.type === undefined) {
      this.open = true;
    }
  },
  methods: {
    uploadImage() {
      this.loadingUpload = true;
      let params = {};
      params.image_data = this.imageData;
      this.url =
        "http://localhost:5000/tree/" +
        this.surname +
        "/person/" +
        this.id +
        "/image";
      axios
        .post(this.url, params)
        .then(function(data) {
          console.log(data);
        })
        .catch(function(err) {
          console.log(err);
        })
        .finally(() => {
          this.doneUpload = true;
          setTimeout(() => {
            this.showUpload = false;
          }, 2000);
        });
    },
    validate() {
      this.vloading = true;
      let sessionUrl = "http://localhost:5000/sessions/";
      let params = {};
      params.pin = this.cookey;
      params.surname = this.surname;
      axios
        .post(sessionUrl, params)
        .then(() => {
          this.cookeyStatus = true;
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
      if (!this.$route.params.type) {
        this.open = false;
        this.$router.push({
          name: "MainTree",
          params: { id: this.$route.params.id }
        });
      }
    },
    showUpdateForm(formd) {
      this.open = false;
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
      if (num == "gender") {
        if (this.data.gender == "1") {
          num = "b";
        } else {
          num = "a";
        }
      }
      this.open = false;
      console.log(num);
      if (this.$route.query.hasMate) {
        this.$router.push({
          name: "AddMember",
          params: { type: num },
          query: {
            parent_id: this.data.is_mate ? this.data.parent_id : this.data._id,
            hasMate: true
          }
        });
      } else {
        this.$router.push({
          name: "AddMember",
          params: { type: num },
          query: {
            parent_id: this.data.is_mate ? this.data.parent_id : this.data._id
          }
        });
      }
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

    slideMe() {
      console.log("Slideme");
      if (this.$route.params.member) {
        this.open = false;
        setTimeout(() => {
          this.$router.push({
            name: "MainTree",
            params: this.$route.params.id
          });
        }, 300);
      }
    },

    disable() {
      console.log("Disabled");
    }
  }
};
</script>

<style>
.vue-simple-drawer {
  left: 70% !important;
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
  color: white;
  font-size: 10px;
  /* padding: 2px 4px; */
}
</style>