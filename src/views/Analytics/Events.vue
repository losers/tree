<template>
  <div>
    <div class="main-title">
      <div class="header">Today's Events</div>
      <div class="today">- {{ date.display }}</div>
    </div>
    <div class="load-con" v-if="loading">
      <div class="ml-3 spinner-border spinner-border-sm"></div>
    </div>

    <!-- All Boxes List -->
    <div class="row" v-else>
      <div
        class="col-xs-12 col-sm-4 event-cont"
        v-for="(event, index) in events"
        :key="index"
      >
        <!-- Birthday event -->
        <div class="event" v-if="event.type == 1">
          <!-- Background -->
          <img
            src="@/assets/events/birthdaybg.png"
            alt=" Birthday"
            width="100%"
            height="120"
          />

          <!-- Event Body -->
          <div class="event-body">
            <!-- Direct Picture -->
            <div class="person-img">
              <img
                :src="'data:image/png;base64, ' + store.state.images[event._id]"
                v-if="store.state.images[event._id]"
                alt="Blood Line User"
              />
              <img src="@/assets/dp.png" v-else alt="Blood Line User" />
            </div>

            <!-- Event Content -->
            <center>
              <div class="name">{{ event.name }}</div>
              <div class="anniv">
                <span class="anniv-num">
                  {{ event.dob | anivCalc }}
                  <span class="a-th">th</span>
                </span>
                Birth Anniversary
              </div>

              <button
                class="btn mt-2"
                style="border: solid 1px green; color: green"
              >
                Send Wishes
              </button>
            </center>
          </div>
        </div>

        <!-- Memorial Event -->
        <div class="event" v-if="event.type == 2">
          <!-- Background -->
          <div style="width: 100%; background: black">
            <img
              src="@/assets/events/candle.jpeg"
              alt=" Birthday"
              width="50px"
              height="120"
            />
          </div>

          <!-- Event body with DP -->
          <div class="event-body">
            <!-- DP -->
            <div class="person-img">
              <img
                :src="'data:image/png;base64, ' + store.state.images[event._id]"
                v-if="store.state.images[event._id]"
                alt="Blood Line User"
              />
              <img src="@/assets/dp.png" v-else alt="Blood Line User" />
            </div>

            <!-- Event Content -->
            <center>
              <div class="name">{{ event.name }}</div>
              <div class="anniv">
                <span class="anniv-num"
                  >{{ event.dob | anivCalc }}<span class="a-th">th</span></span
                >
                Memorial day
              </div>
              <button
                class="btn mt-2"
                style="border: solid 1px black; color: black"
              >
                Share
              </button>
            </center>
          </div>
        </div>

        <!-- Timeline Event -->
        <div class="event" v-if="event.type == 3">
          <!-- Vertical Line -->
          <div
            style="
              height: 300px;
              width: 4px;
              background: grey;
              position: absolute;
              margin-left: 50px;
            "
          ></div>
          <span
            style="
              height: 20px;
              width: 20px;
              position: absolute;
              background: #286b8b;
              border-radius: 20px;
              margin-left: 42px;
              margin-top: 170px;
            "
          >
          </span>
          <div style="padding-top: 70px; display: flex">
            <div class="person-img" style="margin-left: 10px">
              <img
                :src="'data:image/png;base64, ' + store.state.images[event._id]"
                v-if="store.state.images[event._id]"
                alt="Blood Line User"
              />
              <img src="@/assets/dp.png" v-else alt="Blood Line User" />
            </div>
            <div class="name" style="margin-left: 120px">{{ event.name }}</div>
          </div>
          <div class="anniv" style="margin-left: 80px; margin-top: 45px;">
            <!-- <div>{{ event.heading }}</div>
            <div style="height: 50px; width:60%">{{ event.content }}</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-body {
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: center;
}
.person-img {
  box-shadow: 10px 10px 22px -13px rgba(0, 0, 0, 0.75);
  width: 90px;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  top: 55px;
  border: 1px solid;
}
.a-th {
  font-size: 10px;
}
.anniv-num {
  color: indianred;
  font-size: 30px;
}
.name {
  font-size: 30px;
}
.load-con {
  display: flex;
  justify-content: center;
  margin-top: 90px;
}
.spinner-border-sm {
  font-size: 20px;
  color: indianred;
  width: 5rem;
  height: 5rem;
  border-width: 0.2em;
}
.today {
  color: indianred;
  font-size: 20px;
}
.header {
  font-size: 30px;
}
.main-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.event-cont {
  padding: 10px;
}
.event {
  height: 300px;
  -webkit-box-shadow: 2px 4px 9px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 2px 4px 9px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 2px 4px 9px 0px rgba(0, 0, 0, 0.75);
}
</style>

<script>
import ProdData from "@/data.js";
import axios from "axios";
import moment from "moment";
import { getNormalDisplayDate, getAPIFormat } from "../../util/helper";
import Store from "../../store/index";
export default {
  name: "Events",
  data() {
    return {
      date: {
        display: getNormalDisplayDate(),
        api: getAPIFormat(),
      },
      events: [
        {
          type: 1,
          name: "test name",
          dob: "Jan 32",
        },
        {
          type: 2,
          name: "test name",
          dob: "Jan 32",
        },
        {
          type: 3,
          name: "Person 1",
          heading: "Timeline Heading",
          content:
            "cmvlsmv;fmbfdlmb.fmdfbmdbm;bmd;bmgbmd;bmd;fbcmvlsmv;fmbfdlmb.fmdfbmdbm;bmd;bmgbmd;bmd;fbcmvlsmv;fmbfdlmb.fmdfbmdbm;bmd;bmgbmd;bmd;fb",
        },
        {
          type: 2,
          name: "test name",
          dob: "Jan 32",
        },
      ],
      loading: true,
      store: {},
    };
  },
  filters: {
    anivCalc: function (value) {
      let a = moment(value);
      let b = moment();
      return b.diff(a, "years");
    },
  },
  mounted() {
    this.store = Store;
    let eventsUrl = `${ProdData.getHostURL()}/events/?date=${this.date.api}`;
    axios
      .get(eventsUrl)
      .then((response) => {
        this.events = response.data;
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>