<template>
  <div>
    <div
      class="
        container
        text-muted
        mb-3
        d-flex
        flex-column
        justify-content-start
        align-items-start
      "
    >
      <h5>What are Super Families ?</h5>
      <div class="mt-2">
        Families who donate and support Bloodline become super families
      </div>
      <div>
        For more, write to
        <strong>hello@bloodline.app</strong>
      </div>
    </div>
    <!-- Search Bar -->
    <form v-on:submit.prevent="search" class="search-box container">
      <input
        type="text"
        style="height: 45px"
        :class="{ 'desktop-search': $device.mobile }"
        v-model="text"
        :placeholder="`Find in ${totalFamilies} Super families..`"
        class="form-control input-lg float-left search-bar"
      />
      <button
        type="submit"
        class="btn"
        style="float: right; margin-right: 10px; margin-top: -40px"
ge    >
        <i class="icofont-search-2"></i>
      </button>
    </form>
    <DualPage
      :payload="authPayload"
      :reference="5"
      v-if="showAuthBox == true"
      v-on:closed="showAuthBox = false"
    ></DualPage>
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
        class="
          container
          family-box
          d-flex
          align-items-start
          justify-content-between
        "
        :class="{
          'cur-family': curFamily == data._id,
          'normal-family': curFamily != data._id,
        }"
        @click="
          showAuth(data.surname, data.title, data.celeb, data._id, data.contact)
        "
      >
        <!-- Lock and Unlock Symbol -->
        <i
          class="icofont-unlocked rounded-lg"
          :class="{
            'bigscreen-lock': !$device.mobile,
            'mobile-lock': $device.mobile,
          }"
          data-toggle="tooltip"
          title="UnLocked"
          v-if="data.celeb"
        ></i>
        <i
          class="icofont-lock rounded-lg"
          :class="{
            'bigscreen-lock': !$device.mobile,
            'mobile-lock': $device.mobile,
          }"
          data-toggle="tooltip"
          title="Locked"
          v-else
        ></i>

        <div>
          <span
            class="title"
            :style="{ 'font-size': $device.mobile ? '25px' : '35px' }"
          >
            {{ data.title }}
          </span>
          <p class="surname">Surname : {{ data.surname }}</p>
        </div>

        <div class="award-bg theme-primary-bgdark">
          <i class="icofont-badge h5"></i>
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
import DualPage from "@/modals/DualPage";

export default {
  mounted() {
    this.getAllList();
  },
  components: {
    DualPage,
  },
  methods: {
    goto(surname) {
      location.href = `/app/${surname}`;
    },
    showAuth(surname, title, isCeleb, family_id, contact) {
      if (family_id === this.curFamily || isCeleb) {
        location.href = `/app/${surname}`;
      } else {
        this.authPayload.surname = surname;
        this.authPayload.title = title;
        this.authPayload.contact = contact;
        this.showAuthBox = true;
      }
    },
    getAllList(page) {
      let url = `${ProdData.getHostURL()}/meta?type=3`;
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
      authPayload: {},
      showAuthBox: false,
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