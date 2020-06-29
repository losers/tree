<template>
  <div style="z-index:10">
    <form v-on:submit.prevent="formEmit(0)">
      <h3
        class="mt-3"
        style="margin-bottom:40px;"
      >{{payload.formData.isEdit?"Update":"Create"}} Event</h3>
      <div class="row input-con">
        <label class="col-3 label">Date</label>
        <md-datepicker
          class="col-7"
          v-model="payload.formData.date"
          placeholder="Event Date"
          required="true"
        />
      </div>
      <div class="row input-con">
        <label class="col-3 label">Title</label>
        <input
          type="text"
          class="form-control col-7"
          placeholder="Enter Event Title"
          v-model="payload.formData.title"
          required="true"
        />
      </div>
      <div class="row input-con">
        <label class="col-3 label">Desciption</label>
        <textarea
          class="form-control col-7 rounded-2"
          rows="3"
          maxlength="1000"
          v-model="payload.formData.content"
          required="true"
          placeholder="Event description"
        ></textarea>
      </div>
      <div class="row input-con">
        <label class="col-3 label">Share with</label>
        <v-select
          class="col-7"
          style="height: 35px;"
          multiple
          :options="payload.names"
          v-model="payload.formData.shared_with"
        ></v-select>
      </div>

      <div class="row input-con justify-content-around mb-4">
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
  </div>
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
  // mounted(){
  //   console.log(this.payload.names);
  // },
  methods: {
    formEmit: function(type) {
      this.$emit("crudops", type);
    }
  }
};
</script>