<template>
  <div>
    <div
      class="col-sm-12 col-md-9 text-muted guidelines mb-3 d-flex flex-column justify-content-start align-items-start"
    >
      <h5>How to create Demo Families ?</h5>
      <div>
        <strong class="mr-2">Step 1:</strong> Create a normal family tree by clicking above
        green button.
      </div>
      <div>
        <strong class="mr-2">Step 2:</strong> Send family tree name to
        <i>bloodline.helpline@gmail.com</i>
      </div>
      <div><strong class="mr-2">Step 3:</strong> Thats it. Your Demo tree will go live and will be listed below</div>
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
        :placeholder="`Find in ${totalFamilies} Demo families..`"
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
    <div v-if="s_load">
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

        <!-- Contributors List -->
        <div
          class="col-sm-12 contri col-md-6 p-2"
          style="z-index: 10; transition: 1s all"
          @click="toggle(data.surname)"
        >
          <b class="h5"
            >Contributors :
            {{ data.contributors ? data.contributors.length : 0 }}</b
          >
          <table class="table table-striped mt-2 text-muted">
            <tr v-for="helper in data.contributors" :key="helper.$index">
              <td>
                {{ helper.name }}
              </td>
              <td>
                {{ helper.email }}
              </td>
              <td>
                {{ helper.facebook }}
              </td>
            </tr>
          </table>
        </div>
        <button @click="goto(data.surname)" class="btn btn-success mt-3">
          <strong class="font-weight-bold mr-2"> View </strong>
          <i class="icofont-share-alt"></i>
        </button>
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
import ProdData from "../data.js";

export default {
  mounted() {
    console.log("demo");
    setTimeout(() => {
      this.s_load = false;
    }, 1000);
  },
  methods: {
    goto(surname) {
      location.href = `/app/${surname}`;
    },
    // toggle(surname) {
    //   var tempDom = document.querySelector(".toggle-" + surname);
    //   console.log(surname + "togg");
    //   if (tempDom.classList.contains("expand-list")) {
    //     tempDom.classList.remove("expand-list");
    //   } else {
    //     tempDom.classList.add("expand-list");
    //   }
    // },
    loadMore() {
      this.loadingMore = true;
      axios
        .get(ProdData.getHostURL() + "/meta?page=" + this.nextPage)
        .then((response) => {
          this.info = this.info.concat(response.data.list);
          this.nextPage = response.data.next_page;
          this.hasNext = response.data.has_next;
        })
        .catch((error) => {
          this.errored = error;
          console.log(error);
        })
        .finally(() => (this.loadingMore = false));
    },
  },
  data() {
    return {
      s_load: true,
      loadingMore: false,
      nextPage: 0,
      hasNext: true,
      text: "",
      totalFamilies: 10,
      info: [
        {
          _id: "5eadbe333003860004f01f3b",
          title: "Medam Mega Family",
          surname: "medam",
          created_at: "2020-05-02T18:38:42.905Z",
          updated_at:
            "Sat Dec 12 2020 17:57:17 GMT+0000 (Coordinated Universal Time)",
          __v: 0,
          is_private: true,
          contact: {
            name: "Jai",
            email: "saijayaprakash.m@gmail.com",
          },
          view_pin: "8754",
          id: "5eadbe333003860004f01f3b",
          contributors: [
            {
              name: "Test Raja",
              email: "gmail",
              facebook: "fb",
            },
            {
              name: "Test Raja 2",
              email: "gmail",
              facebook: "fb",
            },
            {
              name: "Test Raja 3",
              email: "gmail",
              facebook: "fb",
            },
          ],
        },
        {
          _id: "5eaed7b68a99f20004393d2c",
          title: "Nehru's Family",
          surname: "nehru",
          celeb: true,
          created_at: "2020-05-03T14:39:50.048Z",
          updated_at: "2020-05-03T14:39:50.048Z",
          __v: 0,
          is_private: true,
          id: "5eaed7b68a99f20004393d2c",
        },
        {
          _id: "5eb24baec3bb7d000477a8ab",
          title: "Royal Sowlam's Family",
          surname: "sowlam",
          created_at: "2020-05-06T05:31:25.775Z",
          updated_at: "2020-05-06T05:31:25.775Z",
          __v: 0,
          is_private: true,
          id: "5eb24baec3bb7d000477a8ab",
        },
        {
          _id: "5eb3a7022f36df0004b2830f",
          title: "Chitrala Family",
          surname: "chitrala",
          created_at: "2020-05-07T06:13:22.567Z",
          updated_at:
            "Tue Jan 19 2021 16:42:56 GMT+0000 (Coordinated Universal Time)",
          __v: 0,
          is_private: true,
          contact: {
            name: "Varun Kumar",
            email: "varunkumarmedam@gmail.com",
          },
          view_pin: "8765",
          id: "5eb3a7022f36df0004b2830f",
        },
        {
          _id: "5eb7f696e56f9e00046d0133",
          title: "Nakirikanti",
          surname: "nakirikanti",
          created_at: "2020-05-10T12:41:58.263Z",
          updated_at: "2020-05-13T12:23:09.788Z",
          __v: 0,
          is_private: true,
          id: "5eb7f696e56f9e00046d0133",
        },
        {
          _id: "5eb81791e56f9e00046d019c",
          title: "Maddirala",
          surname: "maddirala",
          created_at: "2020-05-10T15:02:40.724Z",
          updated_at: "2020-05-10T15:22:15.779Z",
          __v: 0,
          is_private: true,
          id: "5eb81791e56f9e00046d019c",
        },
        {
          _id: "5eba47038111f400040a1726",
          title: "KKC family",
          surname: "kavali",
          created_at: "2020-05-12T06:49:38.996Z",
          updated_at: "2020-05-13T12:22:32.966Z",
          __v: 0,
          is_private: true,
          id: "5eba47038111f400040a1726",
        },
        {
          _id: "5eba4f548111f400040a173c",
          title: "Chaitu's Family",
          surname: "annam",
          created_at: "2020-05-12T07:25:08.452Z",
          updated_at:
            "Mon Sep 28 2020 11:58:06 GMT+0000 (Coordinated Universal Time)",
          __v: 0,
          is_private: true,
          id: "5eba4f548111f400040a173c",
        },
        {
          _id: "5ed13cdc95786200044dd600",
          title: "Stark Family",
          surname: "stark",
          celeb: true,
          created_at: "2020-05-29T16:48:27.741Z",
          updated_at: "2020-05-29T18:39:22.553Z",
          __v: 0,
          is_private: true,
          id: "5ed13cdc95786200044dd600",
        },
        {
          _id: "5edefbf64e74a700044bd658",
          title: "Royal Komma's Family",
          surname: "komma",
          created_at: "2020-06-09T03:03:17.895Z",
          updated_at: "2020-06-09T03:03:17.895Z",
          __v: 0,
          is_private: true,
          id: "5edefbf64e74a700044bd658",
        },
      ],
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
.div-box {
  cursor: pointer;
  padding: 20px;
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
  border: solid grey 1px;
  border-radius: 10px;
  max-height: 40px;
  overflow: hidden;
  color: grey;
}
.contri:hover {
  max-height: 100px !important;
  overflow-y: scroll;
  box-shadow: 2px 2px 5px 2px rgba(171, 171, 171, 1);
}
</style>