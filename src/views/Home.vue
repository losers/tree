<template>
  <div>
    <section v-if="errored">
      <p>{{errored}}</p>
    </section>
    <section v-else>
      <div v-if="loading" style="padding-top:240px">
        <center>
          <img src="@/assets/dna.gif" alt="Family Tree Loading" />
        </center>
      </div>
      <div v-else>
        <div class="heade">
          <!-- <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>-->
          <div id="title">
            <span style="font-weight: 500;">BloodLine</span>
            <br />
          </div>

          <center v-show="addFBtn">
            <vue-typer :text="['Decode Your DNA !', 'Find your Roots !', 'Have Fun !']"></vue-typer>
          </center>

          <!-- Create Family Button -->
          <center class="mt-3">
            <touch-ripple @click.native="addFamilyBtn" class="button-box" :speed="1.1">
              <button class="btn btn-success my-btn">+ Your Family Tree</button>
            </touch-ripple>
          </center>
        </div>

        <!-- Dual Page for Creating a Model -->
        <DualPage :reference="0" v-if="showModal == true" v-on:closed="showModal=false"></DualPage>

        <DualPage
          :payload="authPayload"
          :reference="5"
          v-if="showAuthBox == true"
          v-on:closed="showAuthBox=false"
        ></DualPage>

        <center>
          <form
            v-on:submit.prevent="search"
            class="container"
            style="display: flex;padding: 0px 0px 40px;"
          >
            <input type="text" v-model="text" class="form-control" placeholder="Search.." style="margin-right: 30px;"/>
            <button type="submit" class="btn btn-default" style="color: black;background-color: white;">
              <i class="icofont-search-2" style="padding-right: 10px;"></i>
              <span>Search</span>
            </button>
            <!-- <input type="submit" value="Search" /> -->
          </form>
        </center>

        <div v-if="s_load">
          <center style="padding-top: 80px;">
            <div
              class="spinner-border text-light"
              style="height: 100px;width: 100px;"
              role="status"
            >
              <span class="sr-only">Loading...</span>
            </div>
          </center>
        </div>
        <div v-for="data in info" :key="data.id" v-else>
          <center>
            <div
              class="container div-box"
              :class="{'cur-family': curFamily == data.surname}"
              @click="showAuth(data.surname, data.title, data.celeb)"
            >
              <i
                class="icofont-unlocked float-left"
                style="color:white; font-size:25px"
                data-toggle="tooltip"
                title="UnLocked"
                v-show="data.celeb"
              ></i>
              <i
                class="icofont-lock float-left"
                style="color:white; font-size:25px"
                data-toggle="tooltip"
                title="Locked"
                v-show="!data.celeb"
              ></i>
              <a class="title">{{data.title}}</a>
              <p class="surname">Surname : {{data.surname}}</p>
            </div>
          </center>
        </div>
        <div v-if="info.length === 0 && !s_load">
          <center>
            <img src="@/assets/no-data.png" style="height:140px;margin-top: 70px;" />
            <h4 style="color: white;margin-top: 30px;">Nothing matching...</h4>
          </center>
        </div>
      </div>

      <!-- Surname Tree -->
      <router-view></router-view>
    </section>
  </div>
</template>

<style scoped>
.cur-family {
  background-color: white;
  color: black;
}
.cur-family .surname {
  color: black;
}
.cur-family .title {
  color: black !important;
}
.div-box {
  cursor: pointer;
  border: 3px solid white;
  border-radius: 10px;
  margin-bottom: 40px;
  padding: 20px;
}
a:hover {
  text-decoration: none !important;
}
.title {
  font-size: 35px;
  font-weight: bold;
  color: #a0a0a0;
}
a:not([href]) {
  color: #a0a0a0;
}
.surname {
  font-size: 20px;
  font-weight: bold;
  color: white;
}
.heade {
  margin-bottom: 60px;
}
#title {
  left: 0;
  right: 0;
  top: 30px;
  margin-top: 30px;
  color: #fff;
  text-align: center;
  font-family: "lato", sans-serif;
  font-weight: 300;
  font-size: 50px;
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
  -webkit-box-shadow: 2px 7px 13px -2px rgba(0, 0, 0, 0.52);
  -moz-box-shadow: 2px 7px 13px -2px rgba(0, 0, 0, 0.52);
  box-shadow: 2px 7px 13px -2px rgba(0, 0, 0, 0.52);
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
      text: ""
    };
  },
  components: {
    DualPage,
    touchRipple,
    VueTyper
  },
  methods: {
    showAuth(surname, title, isCeleb) {
      if (surname === this.curFamily || isCeleb) {
        location.href = `/app/${surname}`;
      } else {
        this.authPayload.surname = surname;
        this.authPayload.title = title;
        this.showAuthBox = true;
      }
    },
    addFamilyBtn() {
      if (navigator.cookieEnabled) {
        this.showModal = true;
      } else {
        alert("Please enable cookies to Start creating a family");
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
    search() {
      if (this.text) {
        this.s_load = true;
        axios
          .get(ProdData.getHostURL() + "/meta/search?text=" + this.text)
          .then(response => {
            this.info = response.data.list;
            this.curFamily = response.data.cur_family;
          })
          .catch(error => {
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
        .then(response => {
          this.toggleBodyClass("addClass", "j-stars");
          this.info = response.data.list;
          this.curFamily = response.data.cur_family;
        })
        .catch(error => {
          this.errored = error;
          console.log(error);
        })
        .finally(() => (this.loading = false));
    }
  },
  destroyed() {
    this.toggleBodyClass("removeClass", "j-stars");
  },
  mounted() {
    if (this.$device.mobile) {
      this.addFBtn = false;
    }
    this.getAllList();
  }
};
</script>

