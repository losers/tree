<template>
  <div>
    <router-view></router-view>
    <!-- <di class="row"> -->
    <!-- <div class="col-12" style="z-index:1000; color:red; height:100%; background-color:red;">_</div> -->
    <Drawer @close="toggle" align="right" :closeable="true" @click.stop="disable">
      <div v-if="open" class="draw">
        <section v-if="errored">
          <p>{{errored}}</p>
        </section>
        <section v-else>
          <div v-if="loading">Loading...</div>
          <div v-else>
            <img :src="previewImage" style="border-radius: 50%;width: 150px;" />
            <button @click="uploadImage">Upload Image</button>
            <!-- <input type="file" accept="image/*" @change="uploadImage"> -->
            <a class="btn" @click="show=true">Select Image</a>
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
            <!-- {{data}} -->
            <table class="table table-borderless table-hover mt-5 table-data">
              <tbody class="text-left">
                <tr class="text-center">
                  <td>{{data.short_name}}</td>
                </tr>
                <tr>
                  <td>{{data.name}}</td>
                </tr>
                <tr v-if="data.mobile">
                  <td><i class="icofont-address-book">&#xeea1;</i> {{data.mobile}}</td>
                </tr>
                <tr v-if="data.dob">
                  <td>{{data.dob}}</td>
                </tr>
                <tr v-if="data.gender">
                  <td>{{data.gender=="1"?"Male":"Female"}}</td>
                </tr>
                <tr>
                  <td>Add some description here</td>
                </tr>
              </tbody>
              <button @click="addMember(2)">Add Child</button>
              <span v-if="!$route.query.hasMate">
                <button @click="addMember(1)">Add Mate</button>
              </span>
              <button @click="deleteSwipe" class="btn btn-danger">Delete</button>
            </table>
          </div>
        </section>
      </div>
    </Drawer>
    <!-- </div> -->
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
      show: false
    };
  },
  mounted() {
    axios
      .get("http://localhost:5000/tree/" + this.surname + "/person/" + this.id)
      .then(data => {
        this.data = data.data;
        // this.previewImage = "data:image/png;base64, "+this.data.image_data;
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
          this.previewImage = "data:image/png;base64, " + this.data[0][this.id];
        }
      })
      .catch(err => {
        this.errored = err;
      });

    this.$root.$on("canceled", () => {
      this.open = true;
    });
    if (this.type === undefined) {
      this.open = true;
    }
  },
  methods: {
    uploadImage() {
      let params = {};
      params.image_data = this.imageData;
      let url =
        "http://localhost:5000/tree/" +
        this.surname +
        "/person/" +
        this.id +
        "/image";
      axios
        .post(url, params)
        .then(function(data) {
          console.log(data);
        })
        .catch(function(err) {
          console.log(err);
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
          // window.location.href = 'data:application/octet-stream;base64,' + this.imageData;
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
    addMember(num) {
      this.open = false;
      this.$router.push({
        name: "AddMember",
        params: { type: num },
        query: {
          parent_id: this.data.is_mate ? this.data.parent_id : this.data._id
        }
      });
    },
    deleteSwipe() {
      this.$modal.show(
        Delete,
        {},
        {
          height: "auto",
          clickToClose: false,
          scrollable: true
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

<style scoped>
.mask {
  height: 0 !important;
}
.swipe-button {
  width: 500px;
  background-color: #17255a;
  border: 1px solid #17255a;
}
</style>