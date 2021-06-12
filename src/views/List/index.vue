<template>
  <div>
    <section v-if="errored">
      <p>{{ errored }}</p>
    </section>
    <section v-else>
      <!-- Main Loader -->
      <!-- <div v-if="loading" style="padding-top: 240px">
        <center>
          <img src="@/assets/dna.gif" alt="Family Tree Loading" />
        </center>
      </div>-->

      <!-- Entire Body view -->
      <div
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
            v-if="$device.mobile && notificationsIcon == true"
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
            <span
              style="font-weight: 500; color: white"
              :style="{
                'font-size': $device.mobile ? '40px' : '50px',
              }"
            >BloodLine</span>
            <br />
          </div>

          <!-- Typer for Big Devices -->
          <center v-show="!$device.mobile">
            <vue-typer :text="['Decode Your DNA !', 'Find your Roots !', 'Have Fun !']"></vue-typer>
          </center>

          <!-- Create Family Button -->
          <center class="mt-3">
            <touch-ripple @click.native="addFamilyBtn" class="button-box" :speed="1.1">
              <button class="btn btn-success my-btn">+ Your Family Tree</button>
            </touch-ripple>
          </center>
        </div>

        <!-- Popups -->

        <!-- 1 - For Creating a Tree -->
        <DualPage :reference="0" v-if="showModal == true" v-on:closed="showModal = false"></DualPage>

        <!-- 2 - For Entering PIN -->
        <DualPage
          :payload="authPayload"
          :reference="5"
          v-if="showAuthBox == true"
          v-on:closed="showAuthBox = false"
        ></DualPage>

        <!-- 3 - For Showing Help Content in mobile web -->
        <DualPage
          :payload="{}"
          :reference="6"
          v-if="helper.show == true"
          v-on:closed="helper.show = false"
        ></DualPage>

        <!-- All Families List View -->
        <div style="background: #f9f9f9; padding: 40px 0px">
          <center>
            <!-- Tab Bar -->
            <TabBar style="position: sticky; top: 10px; margin-bottom: 30px"></TabBar>

            <!-- All Families List and Search Bar-->
            <div v-if="!$route.hash">
              <AllFamilies></AllFamilies>
            </div>

            <div v-else-if="$route.hash == '#demo'">
              <DemoFamilies></DemoFamilies>
            </div>
            <div v-else-if="$route.hash == '#super'">
              <SuperFamilies></SuperFamilies>
            </div>
          </center>
        </div>
      </div>

      <!-- Surname Tree -->
      <router-view></router-view>
    </section>
  </div>
</template>

<style scoped>
#title {
  left: 0;
  right: 0;
  top: 30px;
  padding-top: 50px;
  color: #fff;
  text-align: center;
  font-family: "lato", sans-serif;
  font-weight: 300;
  letter-spacing: 10px;
}
#title span {
  background: -webkit-linear-gradient(white, #38495a);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
// import axios from "axios";
import DualPage from "@/modals/DualPage";
import { touchRipple } from "vue-touch-ripple";
import { VueTyper } from "vue-typer";
import "vue-touch-ripple/dist/vue-touch-ripple.css";
import TabBar from "./components/TabBar";
// import ProdData from "@/data.js";
import SuperFamilies from "./layout/Super";
import DemoFamilies from "./layout/Demo";
import AllFamilies from "./layout/All";

export default {
  data() {
    return {
      errored: false,
      callMe: false,
      showModal: false,
      curFamily: "",
      showAuthBox: false,
      authPayload: {},
      text: "",
      totalFamilies: null,
      nextPage: 1,
      hasNext: false,
      loadingMore: false,
      helper: {
        show: false
      },
      notificationsIcon: false
    };
  },
  components: {
    DualPage,
    touchRipple,
    VueTyper,
    TabBar,
    SuperFamilies,
    DemoFamilies,
    AllFamilies
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
    // loadMore() {
    //   this.loadingMore = true;
    //   axios
    //     .get(ProdData.getHostURL() + "/meta?page=" + this.nextPage)
    //     .then(response => {
    //       this.info = this.info.concat(response.data.list);
    //       this.nextPage = response.data.next_page;
    //       this.hasNext = response.data.has_next;
    //     })
    //     .catch(error => {
    //       this.errored = error;
    //       console.log(error);
    //     })
    //     .finally(() => (this.loadingMore = false));
    // },
    // search() {
    //   if (this.text) {
    //     this.s_load = true;
    //     axios
    //       .get(ProdData.getHostURL() + "/meta/search?text=" + this.text)
    //       .then(response => {
    //         this.info = response.data.list;
    //         this.curFamily = response.data.cur_family;
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       })
    //       .finally(() => (this.s_load = false));
    //   } else {
    //     this.getAllList();
    //   }
    // }
    // getAllList() {
    //   axios
    //     .get(ProdData.getHostURL() + "/meta")
    //     .then((response) => {
    //       this.toggleBodyClass("addClass");
    //       this.info = response.data.list;
    //       this.curFamily = response.data.cur_family;
    //       this.totalFamilies = response.data.total_families;
    //       this.nextPage = response.data.next_page;
    //       this.hasNext = response.data.has_next;
    //     })
    //     .catch((error) => {
    //       this.errored = error;
    //       console.log(error);
    //     })
    //     .finally(() => (this.loading = false));
    // },
  },
  destroyed() {
    this.toggleBodyClass("removeClass");
  },
  mounted() {
    this.toggleBodyClass("addClass");
    try {
      print.postMessage("show Notifications");
      this.notificationsIcon = true;
    } catch (error) {
      // console.log();
    }
    // this.getAllList();
  }
};
</script>

