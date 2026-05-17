<template>
  <form class="p-5 glass-card-form" v-on:submit.prevent="formEmit(0)">
    <h3 style="color: #4f8ef7; font-weight: bold; margin-bottom: 20px;">
      {{ payload.formData.isEdit ? "Update" : "Create" }} Event
    </h3>
    <div class="row" style="align-items: center">
      <label class="col-md-3 d-none d-sm-block label" style="color: rgba(255,255,255,0.8)">Date</label>
      <md-datepicker
        class="col-xs-9 col-md-7 dark-datepicker"
        v-model="payload.formData.date"
        :md-model-type="String"
        required="true"
      >
        <label style="color: rgba(255,255,255,0.5)">Event Date</label>
      </md-datepicker>
    </div>
    <div class="row mb-4">
      <label class="col-md-3 d-none d-sm-block label" style="color: rgba(255,255,255,0.8)">Title</label>
      <input
        type="text"
        class="form-control col-sm-10 col-md-7 dark-input"
        placeholder="Enter Event Title"
        v-model="payload.formData.title"
        required="true"
      />
    </div>
    <div class="row mb-4">
      <label class="col-3 d-none d-sm-block label" style="color: rgba(255,255,255,0.8)">Desciption</label>
      <textarea
        class="form-control col-md-7 col-xs-12 rounded-2 dark-input"
        rows="3"
        maxlength="1000"
        v-model="payload.formData.content"
        required="true"
        placeholder="Event description"
      ></textarea>
    </div>

    <!-- Share with Selector -->
    <div class="row mb-4">
      <label class="col-3 d-none d-sm-block label" style="color: rgba(255,255,255,0.8)">Share with</label>
      <v-select
        class="col-sm-10 col-md-7 dark-vselect"
        style="height: 40px; padding: 0px"
        multiple
        :placeholder="$device.mobile ? 'Share With' : ''"
        :options="payload.names"
        v-model="payload.formData.shared_with"
      ></v-select>
    </div>

    <div class="row justify-content-around mt-4">
      <button
        type="submit"
        class="btn my-action-btn glass-success"
        :disabled="payload.loading.change"
      >
        <span
          class="spinner-border spinner-border-sm"
          v-show="payload.loading.change"
        ></span>
        {{ payload.formData.isEdit ? "Update" : "Create" }}
      </button>
      <button class="btn my-action-btn" type="reset" @click="formEmit(1)">
        Cancel
      </button>
      <button
        type="button"
        @click="formEmit(2)"
        v-show="payload.formData.isEdit"
        :disabled="payload.loading.delete"
        class="btn my-action-btn glass-danger"
      >
        <span
          class="spinner-border spinner-border-sm"
          v-show="payload.loading.delete"
        ></span>
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
    vSelect,
  },
  data() {
    return {};
  },
  methods: {
    formEmit: function (type) {
      this.$emit("crudops", type);
    },
  },
  mounted() {
    this.$material.locale.startYear = 1000;
    const dateInput = document.querySelector(".md-datepicker .md-input");
    if (dateInput) {
      dateInput.setAttribute("onfocus", "blur()");
      dateInput.addEventListener("click", function () {
        const toggleBtn = this.closest(".md-datepicker").querySelector("button");
        if (toggleBtn) {
          toggleBtn.click();
        }
      });
    }
  },
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
<style>
.dark-input {
  background: rgba(15, 17, 35, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}
.dark-input:focus {
  border-color: #4f8ef7 !important;
  box-shadow: 0 0 10px rgba(79, 142, 247, 0.2) !important;
}
.dark-datepicker input {
  color: white !important;
  -webkit-text-fill-color: white !important;
}
</style>