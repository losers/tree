<template>
  <div>
    <form v-on:submit.prevent="search" :style="{ width: $device.mobile ? '90%' : '80%' }" class="search-box">
      <input type="text" style="height: 45px" :class="{ 'desktop-search': $device.mobile }" v-model="searchText" :placeholder="`Find in ${totalFamilies} families..`" class="form-control input-lg rounded-lg float-left"/>
      <button type="submit" class="btn btn-danger btn-sm rounded-lg" style="float: right; margin-right: 10px; margin-top: -38px">
        <i class="icofont-search-2"></i> Search
      </button>
    </form>

    <!-- Loader -->
    <div v-if="loading">
      <center style="padding-top: 80px">
        <div class="spinner-border" style="height: 50px; width: 50px; color: black" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </center>
    </div>

    <!-- All Families List -->
    <div v-else v-for="data in info" :key="data.id">
      <div
        class="container div-box" :style="{ 'border-radius': '10px', 'margin-top': $device.mobile ? '20px' : '30px'}"
        :class="{'cur-family': curFamily == data._id,'normal-family': curFamily != data._id,}"
        @click="showAuth(data.surname,data.title,data.celeb,data._id,data.contact)"
      >
        <i
          class="icofont-unlocked rounded-lg"
          :class="{'bigscreen-lock': !$device.mobile,'mobile-lock': $device.mobile}"
          data-toggle="tooltip"
          title="UnLocked"
          v-if="data.celeb"
        ></i>
        <i class="icofont-lock rounded-lg" :class="{ 'bigscreen-lock': !$device.mobile, 'mobile-lock': $device.mobile}"
          data-toggle="tooltip"
          title="Locked"
          v-else
        ></i>

        <!-- Family Title Box -->
        <div style="width: 85%">
          <a class="title" :style="{ 'font-size': $device.mobile ? '25px' : '35px' }">
            {{ data.title }}
          </a>
        </div>
        <p class="surname">Surname : {{ data.surname }}</p>
      </div>
    </div>
    <div v-if="hasNext && info.length !== 0" style="margin-bottom: 20px; margin-top: 20px">
      <button type="button" @click="loadMore" v-if="!loadingMore" class="btn load-more">
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
      loadingMore: false
    };
  },
  methods: {
    getAllList(page) {
      let url = `${ProdData.getHostURL()}/meta`;
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
    }
  },
  mounted(){
    this.getAllList();
  }
};
</script>

<style scoped>
  .search-box{
    background: #f9f9f9;
    box-shadow: rgb(241 241 241) 0px 5px 10px 0px;
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

/* Access Famili */
.cur-family {
  background-color: black;
  color: white;
}
.cur-family .surname {
  color: #c7c7c7;
}
.cur-family .title {
  color: white !important;
}

/* All Normal Families */
.normal-family {
  background: white;
}
.div-box {
  cursor: pointer;
  padding: 20px;
  word-break: break-word;
  -webkit-box-shadow: 0px 0px 18px -12px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 18px -12px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 18px -12px rgba(0, 0, 0, 0.75);
}
a:hover {
  text-decoration: none !important;
}
.title {
  font-weight: bold;
  color: #6a6a6a !important;
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