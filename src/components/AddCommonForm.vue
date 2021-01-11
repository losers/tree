<template>
  <div class="FormData p-5">
    <h3 class="mb-3" style="color: black">{{ payload.memData ? "Edit" : "Add" }} Member</h3>
    <form v-on:submit.prevent="sendData">
      <div class="row">
        <label class="d-none d-sm-block col-md-4">
          <span class="text-warning mr-1">*</span>Name :
        </label>
        <input
          type="text"
          class="form-control col-md-7 col-sm-12"
          v-model="data.name"
          placeholder="Enter Full Name"
          required
        />
      </div>

      <!-- payload.gender Selection -->
      <div v-if="type_data == 'gender'"></div>
      <div class="row" v-else>
        <div class="form-check col-3 ml-3">
          <input
            class="form-check-input col-3 mt-2"
            type="radio"
            name="gender"
            v-model="data.gender"
            value="1"
            checked
            id="male"
            required
          />
          <label for="male" class="form-check-label ml-2" style="color: black">Male</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input col-3 mt-2"
            type="radio"
            name="gender"
            id="female"
            v-model="data.gender"
            value="0"
          />
          <label for="female" class="form-check-label ml-2" style="color: black">Female</label>
        </div>
      </div>

      <!-- Optional Params -->
      <div v-if="!payload.is_root">
        <hr class="mt-5 mb-3" style="background-color: white" />
        <p style="margin-top: -29px">
          <center>
            <span style="background-color: white; padding: 20px; color: #969696">Optional Details</span>
          </center>
        </p>

        <div class="row">
          <label class="d-none d-sm-block col-md-4">Short Name:</label>
          <input
            type="text"
            class="form-control col-md-7 col-sm-12"
            placeholder="Enter Short Name"
            v-model="data.short_name"
          />
        </div>
        <p class="info">Short Name will be shown in Family Tree</p>

        <div class="row" v-if="xtraParent.show">
          <label class="d-none d-sm-flex col-md-4">
            <span v-if="data.gender == 0">D/O :</span>
            <span v-else>S/O :</span>
          </label>
          <vSelect
            :options="xtraParent.options"
            v-model="xtraParent.selected"
            :placeholder="$device.mobile ? 'Select Parent' : ''"
            class="col-md-7 col-sm-12 myselect"
          ></vSelect>
        </div>
        <div class="row">
          <label class="col-md-4 d-none d-sm-flex flexy">DOB :</label>
          <md-datepicker class="col-md-7 col-xs-12 cus" v-model="data.dob" :md-model-type="String">
            <label>Date of Birth</label>
          </md-datepicker>
        </div>

        <div class="row mb-2">
          <label class="col-4 flexy" style="color: black">Is Alive :</label>
          <toggle-button v-model="is_alive" :value="is_alive" :sync="true" class="flexy col-4" />
          <div class="form-inline col-md-6 col-xs-12" v-show="!is_alive">
            <md-datepicker
              v-model="data.died_on"
              required="true"
              class="cus"
              id="demise"
              :md-model-type="String"
            >
              <label>Date of Demise</label>
            </md-datepicker>
          </div>
        </div>

        <div class="row">
          <label class="d-none d-sm-flex col-md-4">Mobile :</label>
          <input
            type="tel"
            class="form-control col-md-7 col-sm-12"
            v-model="data.mobile"
            placeholder="Mobile Number"
          />
        </div>
        <div class="row">
          <label class="d-none d-sm-flex col-md-4">Email :</label>
          <input
            type="email"
            class="form-control col-md-7 col-sm-12"
            v-model="data.email"
            placeholder="Email Id"
          />
        </div>
        <div class="row">
          <label class="d-none d-sm-flex col-md-4">Address :</label>
          <input
            type="text"
            class="form-control col-md-7 col-sm-12"
            v-model="data.address"
            placeholder="Address"
          />
        </div>
        <div class="row">
          <label class="d-none d-sm-flex col-md-4">Country :</label>
          <vSelect
            :options="countries"
            placeholder="Select Country"
            v-model="data.country"
            class="mb-3 col-md-7 col-sm-12 p-0"
          ></vSelect>
        </div>

        <!-- Description -->
        <div class="row">
          <label class="d-none d-sm-flex col-md-4">Description :</label>
          <textarea
            class="form-control col-md-7 col-sm-12"
            rows="3"
            v-model="data.description"
            :placeholder="`What do you think of ${
              data.gender ? (data.gender == 1 ? 'him' : 'her') : 'him / her'
            }`"
          ></textarea>
        </div>

        <hr class="mt-5 mb-3" style="background-color: white" />
        <p style="margin-top: -29px">
          <center>
            <span style="background-color: white; padding: 20px; color: #969696">Social Media</span>
          </center>
        </p>

        <div class="md-form input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text md-addon">
              <i class="icofont-facebook"></i>
            </span>
          </div>
          <input
            type="url"
            class="form-control rounded-0"
            v-model="data.fb"
            placeholder="https://www.facebook.com/elonmusk"
          />
        </div>
        <div class="md-form input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text md-addon">
              <i class="icofont-instagram"></i>
            </span>
          </div>
          <input
            type="url"
            class="form-control rounded-0"
            v-model="data.insta"
            placeholder="https://www.instagram.com/elonmusk"
          />
        </div>
        <div class="md-form input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text md-addon">
              <i class="icofont-twitter"></i>
            </span>
          </div>
          <input
            type="url"
            class="form-control rounded-0"
            v-model="data.twitter"
            placeholder="https://www.twitter.com/elonmusk"
          />
        </div>
        <div class="md-form input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text md-addon">
              <i class="icofont-web"></i>
            </span>
          </div>
          <input
            type="url"
            class="form-control rounded-0"
            v-model="data.site"
            placeholder="http://www.usainbolt.com/"
          />
        </div>
      </div>

      <div class="d-flex justify-content-between mt-5">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span class="spinner-border spinner-border-sm" v-show="loading"></span>
          Submit
        </button>
        <button type="button" @click="goBack" class="btn btn-danger">Cancel</button>
      </div>
      <div v-show="is_error" class="mt-3">{{ is_error }}</div>
    </form>
  </div>
</template>

<script>
import vSelect from "vue-select";

import { ToggleButton } from "vue-js-toggle-button";
import Axios from "axios";
import ProdData from "../data.js";
import Vue from "vue";
import VueMaterial from "vue-material";
import "@/assets/css/vue-material.min.css";
import Store from "@/store/index";
import Algos from "@/algos/analytics/relation-finder";

// var emitData;

Vue.use(VueMaterial);
export default {
  components: {
    ToggleButton,
    vSelect
  },
  props: ["payload"],
  data() {
    return {
      data: {},
      type_data: this.payload.type,
      loading: false,
      is_error: false,
      is_alive: true,
      xtraParent: {
        show: false,
        selected: {},
        options: []
      },
      countries: ProdData.countries
    };
  },
  watch: {
    is_alive() {
      this.data.is_died = !this.is_alive;
    }
  },
  mounted() {
    this.is_alive = true;
    let isChild = false;
    let parentId;
    let xtra_parent_id;
    this.$material.locale.startYear = 1000;
    document
      .querySelector(".md-datepicker")
      .querySelector(".md-input")
      .setAttribute("onfocus", "blur()");
    document
      .querySelector("#demise")
      .querySelector(".md-input")
      .setAttribute("onfocus", "blur()");

    //Editing
    if (this.payload.memData) {
      this.data = this.payload.memData;
      isChild = this.data.is_mate ? false : true;
      parentId = this.data.parent_id;
      xtra_parent_id = this.data.xtra_parent_id;

      if (this.payload.memData.is_died) {
        this.is_alive = false;
        if (this.payload.memData.died_on) {
          this.data.died_on = this.payload.memData.died_on;
        }
      }
    } else {
      //Adding Member

      //Direct Child - Not Mate
      isChild = this.payload.type != "gender" ? true : false;
      parentId = this.payload.parent_id;
      xtra_parent_id = this.payload.xtra_parent_id;
    }

    this.checkMultiParents(parentId, isChild, xtra_parent_id);
  },
  methods: {
    checkMultiParents(parentId, isChild, xtra_parent_id) {
      let tree = Algos.getSubTree(Store.getters.getTreeData, parentId);
      if (isChild && tree && tree.mate && tree.mate.length > 1) {
        this.xtraParent.show = true;
        for (let mate of tree.mate) {
          let x = {};
          x.label = mate.name;
          x.value = mate.id;
          this.xtraParent.options.push(x);
          if (xtra_parent_id && xtra_parent_id == mate.id) {
            this.xtraParent.selected = x;
          }
        }
      }
    },
    sendData() {
      this.loading = true;
      if (this.xtraParent.selected) {
        this.data.xtra_parent_id = this.xtraParent.selected.value;
      }
      if (!this.data.short_name) {
        this.data.short_name = this.data.name;
      }
      if (this.payload.memData) {
        if (this.$route.params.subtree_id) {
          let url = `${ProdData.getHostURL()}/subtree/${this.$route.params.id}/${this.$route.params.subtree_id}/${this.data._id}`;
          Axios.put(
            url,
            this.data
          ).then(() => {
              this.goBack();
            })
            .catch(errr => console.log(errr));
        } else {
          //Update
          Axios.put(
            ProdData.getHostURL() +
              "/tree/" +
              this.$route.params.id +
              "/person",
            this.data
          )
            .then(() => {
              this.goBack();
            })
            .catch(errr => console.log(errr));
        }
      } else {
        //ADDING Member
        if (this.payload.type == "gender") {
          this.data.type = 1;
          if (this.payload.gender == "male") {
            this.data.gender = "1";
          } else {
            this.data.gender = "0";
          }
        } else if (this.payload.type == 1) {
          this.data.type = 2;
        } else if (this.payload.type == 0) {
          this.data.type = 0;
        }

        this.data.parent_id = this.payload.parent_id;
        this.$emit("form-submit", this.data);
      }
    },
    goBack() {
      this.$emit("form-cancel");
    }
  }
};
</script>

<style scoped>
/* .cus.md-field{
  min-height: auto;
  padding-top: 0px;
}
.cus.md-field label{
  top: 5px;
  margin-bottom: 0px;
} */
.flexy {
  display: flex;
  align-items: center;
}
.info {
  margin-top: -10px;
  font-size: 12px;
  color: rgb(160, 160, 160);
}
.form-btns {
  margin-left: -20px;
}
label {
  size: 22px;
  font-weight: bold;
  margin-top: 8px;
}
input {
  margin-bottom: 15px;
}
input[type="radio"] {
  width: 100%;
  height: 1.2em;
}
</style>
