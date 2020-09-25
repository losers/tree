<template>
  <form class="p-5" v-on:submit.prevent="formEmit(0)">
    <h3 style="margin-bottom:40px;">{{payload.formData.isEdit?"Update":"Create"}} Event</h3>
    <div class="row" style="align-items: center;">
      <label class="col-md-3 d-none d-sm-block label">Date</label>
      <md-datepicker class="col-xs-9 col-md-7" v-model="payload.formData.date" readonly required="true">
        <label>Event Date</label>
      </md-datepicker>
    </div>
    <div class="row mb-4">
      <label class="col-md-3 d-none d-sm-block label">Title</label>
      <input
        type="text"
        class="form-control col-sm-10 col-md-7"
        placeholder="Enter Event Title"
        v-model="payload.formData.title"
        required="true"
      />
    </div>
    <div class="row mb-4">
      <label class="col-3 d-none d-sm-block label">Desciption</label>
      <textarea
        class="form-control col-md-7 col-xs-12 rounded-2"
        rows="3"
        maxlength="1000"
        v-model="payload.formData.content"
        required="true"
        placeholder="Event description"
      ></textarea>
    </div>

    <!-- Share with Selector -->
    <div class="row mb-4">
      <label class="col-3 d-none d-sm-block label">Share with</label>
      <v-select
        class="col-sm-10 col-md-7"
        style="height:40px;padding:0px;"
        multiple
        :placeholder="$device.mobile?'Share With':''"
        :options="payload.names"
        v-model="payload.formData.shared_with"
      ></v-select>
    </div>

    <div class="row justify-content-around">
      <button type="submit" class="btn btn-success btn" :disabled="payload.loading.change">
        <span class="spinner-border spinner-border-sm" v-show="payload.loading.change"></span>
        {{payload.formData.isEdit?"Update":"Create"}}
      </button>
      <button class="btn btn-cancel" type="reset" @click="formEmit(1)">Cancel</button>
      <button
        type="button"
        @click="formEmit(2)"
        v-show="payload.formData.isEdit"
        :disabled="payload.loading.delete"
        class="btn btn-danger btn"
      >
        <span class="spinner-border spinner-border-sm" v-show="payload.loading.delete"></span>
        Delete Permanently
      </button>
    </div>
  </form>
</template>

<script>
import vSelect from "vue-select";
import VueMaterial from "vue-material";
import Vue from "vue";
import "@/assets/css/vue-material.min.css";
import "vue-select/dist/vue-select.css";

Vue.use(VueMaterial);

export default {
  props: ["payload"],
  components: {
    vSelect
  },
  data() {
    return {};
  },
  methods: {
    formEmit: function(type) {
      this.$emit("crudops", type);
    }
  }
};
</script>

<style>
.vs__search {
  color: #5e5e5e;
}
.timeline_add_box {
  overflow: hidden !important;
  top: 100px !important;
}
</style>