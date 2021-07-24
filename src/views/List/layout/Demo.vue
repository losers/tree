<template>
  <div>
    <div
      class="
        text-muted
        container
        mb-3
        d-flex
        flex-column
        justify-content-start
        align-items-start
      "
    >
      <h5>How to create Demo Families ?</h5>
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
    <form v-on:submit.prevent="search" class="search-box container">
      <input
        type="text"
        style="height: 45px"
        :class="{ 'desktop-search': $device.mobile }"
        v-model="text"
        :placeholder="`Find in ${totalFamilies} Demo families..`"
        class="form-control input-lg float-left search-bar"
      />
      <button
        type="submit"
        class="btn"
        style="float: right; margin-right: 10px; margin-top: -40px"
      >
        <i class="icofont-search-2"></i>
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
        class="container family-box normal-family"
        :style="{
          margin: $device.mobile ? '20px' : '30px 100px 0 100px',
        }"
        @click="goto(data.surname)"
      >
        <i
          class="icofont-unlocked rounded-lg"
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

        <div v-if="data.contras">
          <span v-if="$device.mobile"
            ><i class="icofont-edit text-muted mr-2"></i
          ></span>
          <span v-else>Contributors: </span>
          <span v-for="(contra, i) in data.contras.slice(0, 1)" :key="i">
            <a :href="contra.link" @click.stop target="_blank">{{
              contra.name
            }}</a
            >,
          </span>
          <span
            style="color: #287efb"
            v-if="data.contras.length > 1"
            @click.stop
            @click.self="showContributorsModel"
          >
            +{{ data.contras.length - 1 }} more
          </span>
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
    showContributorsModel() {
      console.log("cdkvdfv");
    },
    getAllList(page) {
      let url = `${ProdData.getHostURL()}/meta?type=2`;
      if (page) {
        url += `?page=${page}`;
      }
      axios
        .get(url)
        .then((response) => {
          this.info = this.info.concat(response.data.list);
          this.curFamily = response.data.cur_family;
          this.totalFamilies = response.data.total_families;
          this.nextPage = response.data.next_page;
          this.hasNext = response.data.has_next;
        })
        .catch((error) => {
          this.errored = error;
        })
        .finally(() => ((this.loading = false), (this.loadingMore = false)));
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
      info: [],
    };
  },
};
</script>

<style scoped>
.btn:focus {
  box-shadow: none;
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
  box-shadow: 0px 2px 5px 0px rgb(255, 184, 184);
}
</style>