<template>
  <div>
    <section v-if="errored">
      <p>{{ errored }}</p>
    </section>
    <section v-else>
      <!-- Main Loader -->
      <div v-if="loading" style="padding-top: 240px">
        <center>
          <img src="@/assets/dna.gif" alt="Family Tree Loading" />
        </center>
      </div>

      <!-- Entire Body view -->
      <div
        v-else
        class="body-view"
        :style="{
          height: $device.mobile ? '220px' : '300px',
        }"
      >
        <!-- Vue Particles Component -->
        <div
          style="position: absolute; width: 100%; background-color: black color:black"
          :style="{
            height: $device.mobile ? '200px' : '280px',
          }"
        >
          <vue-particles
            style="z-index: 0; height: 100%; width: 100%"
            color="#dedede"
            :particleOpacity="1"
            :particlesNumber="50"
            shapeType="circle"
            :particleSize="5"
            linesColor="#dedede"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.5"
            :linesDistance="150"
            :moveSpeed="3"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
          ></vue-particles>
        </div>

        <!-- Page Head -->
        <div
          style="background: black"
          :style="{
            height: $device.mobile ? '220px' : '300px',
          }"
        >
          <i
            class="icofont-alarm"
            style="
              font-size: 25px;
              color: white;
              position: absolute;
              right: 0;
              padding: 20px;
            "
            v-if="$device.mobile && notificationsIcon"
            @click="showNotifications"
          ></i>
          <!-- Bloodline Title -->
          <div id="title">
            <div class="help" v-if="$device.mobile">
              <i
                class="icofont-chat"
                style="margin-right: -10px; font-size: 35px"
                @click="helperFunc"
              ></i>
            </div>
            <span style="font-weight: 500; color: white">BloodLine</span>
            <br />
          </div>

          <!-- Typer for Big Devices -->
          <center v-show="addFBtn">
            <vue-typer
              :text="['Decode Your DNA !', 'Find your Roots !', 'Have Fun !']"
            ></vue-typer>
          </center>

          <!-- Create Family Button -->
          <center class="mt-3">
            <touch-ripple
              @click.native="addFamilyBtn"
              class="button-box"
              :speed="1.1"
            >
              <button class="btn btn-success my-btn">+ Your Family Tree</button>
            </touch-ripple>
          </center>
        </div>

        <!-- Dual Page for Creating a Model -->
        <DualPage
          :reference="0"
          v-if="showModal == true"
          v-on:closed="showModal = false"
        ></DualPage>

        <DualPage
          :payload="authPayload"
          :reference="5"
          v-if="showAuthBox == true"
          v-on:closed="showAuthBox = false"
        ></DualPage>

        <DualPage
          :payload="{}"
          :reference="6"
          v-if="helper.show == true"
          v-on:closed="helper.show = false"
        ></DualPage>

        <!-- Search Box -->
        <center>
          <form
            v-on:submit.prevent="search"
            :style="{ width: $device.mobile ? '90%' : '80%' }"
            style="
              background: #f9f9f9;
              box-shadow: rgb(241 241 241) 0px 5px 10px 0px;
            "
          >
            <input
              type="text"
              style="height: 45px; margin-top: -25px"
              :class="{ 'desktop-search': $device.mobile }"
              v-model="text"
              :placeholder="`Find in ${totalFamilies} families..`"
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
        </center>
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

        <!-- Families List View -->
        <div
          v-else
          style="background: #f9f9f9; padding: 10px; padding-top: 20px"
        >
          <center>
            <div v-for="data in info" :key="data.id">
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
                  showAuth(
                    data.surname,
                    data.title,
                    data.celeb,
                    data._id,
                    data.contact
                  )
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
                  v-if="data.celeb || curFamily == data._id"
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
                  <a
                    class="title"
                    :style="{ 'font-size': $device.mobile ? '25px' : '35px' }"
                  >
                    {{ data.title }}
                  </a>
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
          </center>
        </div>
        <div v-if="info.length === 0 && !s_load">
          <center>
            <img
              src="@/assets/no-data.png"
              style="height: 140px; margin-top: 70px"
            />
            <h4 style="color: white; margin-top: 30px">Nothing matching...</h4>
          </center>
        </div>
      </div>

      <!-- Surname Tree -->
      <router-view></router-view>
    </section>
  </div>
</template>

<style scoped>
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
#title {
  left: 0;
  right: 0;
  top: 30px;
  padding-top: 50px;
  color: #fff;
  text-align: center;
  font-family: "lato", sans-serif;
  font-weight: 300;
  font-size: 40px;
  letter-spacing: 10px;
}
#title span {
  background: -webkit-linear-gradient(white, #38495a);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes animStar {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-2000px);
  }
}

.my-btn {
  cursor: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/9632/happy.png"),
    auto !important;
  border-radius: 0px;
  -webkit-box-shadow: #cccccc 0px 2px 6px 0px;
  -moz-box-shadow: #cccccc 0px 2px 6px 0px;
  box-shadow: #cccccc 0px 2px 6px 0px;
}
</style>

<script>
import axios from "axios";
import DualPage from "../modals/DualPage";
import { touchRipple } from "vue-touch-ripple";
import { VueTyper } from "vue-typer";
import "vue-touch-ripple/dist/vue-touch-ripple.css";

import ProdData from "../data.js";

export default {
  data() {
    return {
      info: null,
      loading: true,
      s_load: false,
      errored: false,
      callMe: false,
      showModal: false,
      addFBtn: true,
      curFamily: "",
      showAuthBox: false,
      authPayload: {},
      text: "",
      totalFamilies: null,
      nextPage: 1,
      hasNext: false,
      loadingMore: false,
      helper: {
        show: false,
      },
      notificationsIcon: false,
    };
  },
  components: {
    DualPage,
    touchRipple,
    VueTyper,
  },
  methods: {
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
    helperFunc() {
      try {
        print.postMessage("teddy");
      } catch (e) {
        this.helper.show = true;
      }
    },
    addFamilyBtn() {
      if (navigator.cookieEnabled) {
        this.showModal = true;
      } else {
        alert("Please enable cookies to Start creating a family");
      }
    },
    showNotifications() {
      try {
        print.postMessage("notifications");
      } catch (error) {
        console.log();
      }
    },
    toggleBodyClass(addRemoveClass, className) {
      const el = document.body;
      if (addRemoveClass === "addClass") {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },
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
    search() {
      if (this.text) {
        this.s_load = true;
        axios
          .get(ProdData.getHostURL() + "/meta/search?text=" + this.text)
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
    getAllList() {
      axios
        .get(ProdData.getHostURL() + "/meta")
        .then((response) => {
          this.toggleBodyClass("addClass");
          this.info = response.data.list;
          this.curFamily = response.data.cur_family;
          this.totalFamilies = response.data.total_families;
          this.nextPage = response.data.next_page;
          this.hasNext = response.data.has_next;
        })
        .catch((error) => {
          this.errored = error;
          console.log(error);
        })
        .finally(() => (this.loading = false));
    },
  },
  destroyed() {
    this.toggleBodyClass("removeClass");
  },
  mounted() {
    if (this.$device.mobile) {
      this.addFBtn = false;
    }
    try {
      this.notificationsIcon = true;
      print.postMessage("show Notifications");
    } catch (error) {
      console.log();
    }
    this.getAllList();
  },
};
</script>

