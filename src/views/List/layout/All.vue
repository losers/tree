<template>
  <div>
    <form
      v-on:submit.prevent="search"
      :style="{ width: $device.mobile ? '90%' : '80%' }"
      class="search-box"
    >
      <input
        type="text"
        style="height: 45px"
        :class="{ 'desktop-search': $device.mobile }"
        v-model="searchText"
        :placeholder="`Find in ${totalFamilies} families..`"
        class="form-control input-lg search-bar float-left"
      />
      <button
        type="submit"
        class="btn"
        style="float: right; margin-right: 10px; margin-top: -40px"
      >
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
        class="container div-box"
        :style="{
          'border-radius': '10px',
          'margin-top': $device.mobile ? '20px' : '30px',
        }"
        :class="{
          'cur-family': curFamily == data._id,
          'normal-family': curFamily != data._id,
        }"
        @click="
          showAuth(data.surname, data.title, data.celeb, data._id, data.contact)
        "
      >
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

        <!-- Family Title Box -->
        <div style="width: 85%">
          <div
            class="award-bg theme-primary-bgdark"
            :style="{ right: $device.mobile ? '15px' : '150px' }"
          >
            <i class="icofont-badge h5"></i>
          </div>
          <span
            class="title"
            :style="{ 'font-size': $device.mobile ? '25px' : '35px' }"
          >
            {{ data.title }}
          </span>
        </div>
        <p class="surname">Surname : {{ data.surname }}</p>
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
        Load more
        <i class="icofont-arrow-down ml-1"></i>
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
  name: "AllFamiliesList",
  data() {
    return {
      info: [],
      curFamily: {},
      totalFamilies: "",
      nextPage: {},
      hasNext: {},
      searchText: "",
      loading: true,
      loadingMore: false,
      showAuthBox: false,
      authPayload: {},
    };
  },
  components: {
    DualPage,
  },
  methods: {
    getAllList(page) {
      let url = `${ProdData.getHostURL()}/meta`;
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
    search() {
      if (this.searchText) {
        this.s_load = true;
        axios
          .get(ProdData.getHostURL() + "/meta/search?text=" + this.searchText)
          .then((response) => {
            this.info = response.data.list;
            this.curFamily = response.data.cur_family;
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => (this.s_load = false));
      } else {
        this.getAllList();
      }
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
  },
  mounted() {
    this.getAllList();
  },
};
</script>

<style>
/* Access Famili */
.cur-family {
  background-color: black;
}
.cur-family .surname {
  color: rgb(216, 216, 216);
}
.cur-family .title {
  color: rgb(216, 216, 216) !important;
}
/* All Normal Families */
.normal-family {
  background: white;
}
.award-bg {
  display: inline-block;
  height: 60px;
  margin-top: -25px;
  position: absolute;
  padding-top: 20px;
  width: 30px;
  color: white;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  box-shadow: 0px 0px 5px 0px rgb(255 0 0 / 75%);
}
.award-bg::after {
  border-top: 15px solid #ff5d5d;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  content: "";
  height: 0;
  left: 0;
  position: absolute;
  top: 60px;
  width: 30px;
}

.div-box {
  cursor: pointer;
  padding: 20px;
  word-break: break-word;
  -webkit-box-shadow: 0px 0px 18px -12px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 18px -12px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 18px -12px rgba(0, 0, 0, 0.75);
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.search-box {
  background: #f9f9f9;
  height: 40px;
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
.desktop-form {
  padding-left: 10%;
  padding-right: 10%;
}

.body-view {
  background-size: cover;
  width: 100%;
  /* background-color: black; */
  background-color: #f9f9f9;
}

.help {
  position: fixed;
  bottom: 20px;
  background: indianred;
  border-radius: 50%;
  color: white;
  right: 20px;
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.load-more {
  background-color: white;
  font-weight: bolder;
  border: solid black 1px;
  color: black;
}

a:hover {
  text-decoration: none !important;
}
.title {
  font-weight: bold;
  color: #6a6a6a;
}
/* a:not([href]) {
  color: #a0a0a0;
} */
.surname {
  font-size: 20px;
  font-weight: bold;
  color: #a4a4a4;
}
</style>