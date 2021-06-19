<template>
  <div>
    <div
      class="col-sm-12 col-md-9 text-muted guidelines mb-3 d-flex flex-column justify-content-start align-items-start"
    >
      <h5>How to create Super Families ?</h5>
      <div>
        <strong class="mr-2">Step 1:</strong> Create a normal family tree
      </div>
      <div>
        <strong class="mr-2">Step 2:</strong> Send surname to
        <i>hello@bloodline.app</i>
      </div>
      <div class="mt-2">
        <strong class="mr-2">Thats it, Your Demo Family will go live</strong> 
      </div>
    </div>
    <!-- Search Bar -->
    <form
      v-on:submit.prevent="search"
      :style="{ width: $device.mobile ? '90%' : '80%' }"
      style="
        background: #f9f9f9;
        box-shadow: rgb(241 241 241) 0px 5px 10px 0px;
        height: 40px;
      "
    >
      <input
        type="text"
        style="height: 45px"
        :class="{ 'desktop-search': $device.mobile }"
        v-model="text"
        :placeholder="`Find in ${totalFamilies} Super families..`"
        class="form-control input-lg rounded-lg float-left"
      />
      <button
        type="submit"
        class="btn btn-danger btn-sm rounded-lg"
        style="float: right; margin-right: 10px; margin-top: -38px"
      >
        <i class="icofont-search-2"></i> Search
      </button>
    </form>
    <!-- Loader -->
    <div v-if="loading">
      <center style="padding-top: 80px">
        <div
          class="spinner-border"
          style="height: 50px; width: 50px; color: black"
          role="status"
        >
          <span class="sr-only">Loading...</span>
        </div>
      </center>
    </div>

    <!-- All Families List -->
    <div v-else v-for="data in info" :key="data.id">
      <div
        class=""
        :style="{
          'border-radius': '20px',
          margin: $device.mobile ? '20px' : '30px 100px 0 100px',
        }"
      >
        <div class="clickable-box" @click="goto(data.surname)">
          <i
            class="icofont-lock rounded-lg"
            :class="{
              'bigscreen-lock': !$device.mobile,
              'mobile-lock': $device.mobile,
            }"
            data-toggle="tooltip"
            title="UnLocked"
          ></i>

          <!-- Family Title Box -->
          <div style="width: 85%">
            <a
              class="title"
              :style="{ 'font-size': $device.mobile ? '25px' : '35px' }"
            >
              {{ data.title }}
            </a>
          </div>

          <!-- Family Surname -->
          <p class="surname">Surname : {{ data.surname }}</p>
        </div>

        <!-- Contributors List -->

        <div
          class="contri p-2"
          style="z-index: 10; transition: 1s all; overflow-y: scroll"
          @click="toggle(data.surname)"
          v-if="$device.mobile"
        >
          <b class="h5"
            >Contributors
            {{ data.contributors ? data.contributors.length : 0 }}</b
          >
          <div
            v-for="(helper, i) in data.contributors"
            :key="i"
            style="float-left"
            class="d-flex"
          >
            {{ i + 1 }} - {{ helper.name }}
          </div>
        </div>
        <div
          v-else
          class="contri p-2 d-flex align-items-center justify-content-between"
        >
          <div>
            <b class="mr-2"
              >Contributors (
              {{ data.contributors ? data.contributors.length : 0 }} ) -
            </b>
            <span v-for="helper in data.contributors" :key="helper.$index"
              >{{ helper.name }},
            </span>
          </div>
          <div>
            <i class="icofont-clock-time"></i>
            Last Updated: {{ new Date(data.updated_at).toDateString() }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="hasNext && info.length !== 0"
      style="margin-bottom: 20px; margin-top: 20px"
    >
      <button
        type="button"
        @click="loadMore"
        v-if="!loadingMore"
        class="btn load-more"
      >
        Load more <i class="icofont-arrow-down ml-1"></i>
      </button>
      <div
        v-if="loadingMore"
        class="spinner-border"
        style="height: 50px; width: 50px; color: black"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ProdData from "@/data.js";

export default {
  mounted() {
    this.getAllList();
  },
  methods: {
    goto(surname) {
      location.href = `/app/${surname}`;
    },
    getAllList(page) {
      let url = `${ProdData.getHostURL()}/meta?type=3`;
      if(page){
        url += `?page=${page}`;
      }
      axios
        .get(url)
        .then(response => {
          this.info = this.info.concat(response.data.list);
          this.curFamily = response.data.cur_family;
          this.totalFamilies = response.data.total_families;
          this.nextPage = response.data.next_page;
          this.hasNext = response.data.has_next;
        })
        .catch(error => {
          this.errored = error;
        })
        .finally(() => (this.loading = false,this.loadingMore = false));
    },
    loadMore() {
      this.loadingMore = true;
      this.getAllList(this.nextPage);
    },
  },
  data() {
    return {
      loading: true,
      loadingMore: false,
      nextPage: 0,
      hasNext: true,
      text: "",
      totalFamilies: 0,
      info: []
    };
  },
};
</script>

<style scoped>
.guidelines {
  border: solid grey 1px;
  border-radius: 10px;
  padding: 10px;
}
.bigscreen-lock {
  color: white;
  font-size: 25px;
  background: #6a6a6a;
  padding: 10px;
  float: left;
  left: 25px;
  box-shadow: 0px 5px 18px -12px rgba(0, 0, 0, 0.75);
}
.mobile-lock {
  color: #6a6a6a;
  font-size: 20px;
  float: left;
  left: 25px;
}
.load-more {
  background-color: white;
  font-weight: bolder;
  border: solid black 1px;
  color: black;
}

/* All Normal Families */
.clickable-box {
  padding: 20px;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
  word-break: break-word;
  -webkit-box-shadow: 0px 0px 18px -12px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 18px -12px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 18px -12px rgba(0, 0, 0, 0.75);
  background: white;
}

.title {
  font-weight: bold;
  color: #6a6a6a !important;
}

.surname {
  font-size: 20px;
  font-weight: bold;
  color: #a4a4a4;
}

.contri {
  background: grey;
  border-radius: 0 0 10px 10px;
  max-height: 40px;

  color: white;
}
.contri:hover {
  max-height: 100px !important;

  box-shadow: 2px 2px 5px 2px rgba(171, 171, 171, 1);
}
</style>