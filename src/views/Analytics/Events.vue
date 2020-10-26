<template>
  <div>
    <div class="main-title">
      <div class="header">Today's Events</div>
      <div class="today">- {{ date.display }}</div>
    </div>
    <div class="load-con" v-if="loading">
      <div class="ml-3 spinner-border spinner-border-sm"></div>
    </div>
    <div v-else-if="events.length == 0">
      <center>
        <img src="@/assets/events/empty_events.png" height="150px" />
        <div style="color: indianred">
          <h3 class="m-4 mt-5">No Events Today</h3>
          <h5>Birthdays, Timeline Events etc.., will be displayed here</h5>
        </div>
      </center>
    </div>
    <!-- All Boxes List -->
    <div class="row" v-else style="padding-bottom: 50px">
      <div
        class="col-xs-12 col-sm-4 event-cont"
        v-for="(event, index) in events"
        :key="index"
      >
        <!---------------- Birthday event --------------->
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
                v-if="store.state.images && store.state.images[event._id]"
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

              <router-link
                :to="{
                  name: 'MemberData',
                  params: { id: $route.params.id, member: event._id },
                }"
                class="btn mt-2 event-btn"
                >View Profile</router-link
              >
            </center>
          </div>
        </div>

        <!-------------- Memorial Event ------------->
        <div class="event death" v-if="event.type == 2">
          <!-- Background -->
          <div class="memorial-bg">
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
                v-if="store.state.images && store.state.images[event._id]"
                alt="Blood Line User"
              />
              <img src="@/assets/dp.png" v-else alt="Blood Line User" />
            </div>

            <!-- Event Content -->
            <center>
              <div class="name">{{ event.name }}</div>
              <div class="anniv">
                <span class="anniv-num">
                  {{ event.died_on | anivCalc }}
                  <span class="a-th">th</span>
                </span>
                Memorial day
              </div>
              <router-link
                :to="{
                  name: 'MemberData',
                  params: { id: $route.params.id, member: event._id },
                }"
                class="btn mt-2 event-btn"
                >View Profile</router-link
              >
            </center>
          </div>
        </div>

        <!-- Timeline Event -->
        <div class="event" v-if="event.type == 3">
          <!-- Vertical Line -->
          <div class="timeline-line"></div>
          <!-- Timeline Dot -->
          <span class="timeline-dot"></span>
          <!-- Timeline Header -->
          <div class="timeline-header">
            <div class="person-img">
              <img
                :src="'data:image/png;base64, ' + store.state.images[event._id]"
                v-if="store.state.images && store.state.images[event._id]"
                alt="Blood Line User"
              />
              <img src="@/assets/dp.png" v-else alt="Blood Line User" />
            </div>
            <div class="name" style="margin-left: 120px">{{ event.name }}</div>
          </div>
          <div class="timeline-body">
            <div class="timeline-title">{{ event.title }}</div>
            <div class="timeline-content">{{ event.content }}</div>
            <router-link
              :to="{
                name: 'TimelinePerson',
                params: { id: $route.params.id, member: event._id },
              }"
              class="btn event-btn"
              >View Timeline</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.death {
  background-color: black;
  color: white;
  overflow: hidden;
}
.event-body {
  display: flex;
  margin-top: 25px;
  align-items: center;
  justify-content: center;
}
.event-btn {
  border: solid 1px indianred;
  color: indianred;
}
.timeline-line {
  height: 300px;
  width: 4px;
  background: grey;
  position: absolute;
  margin-left: 50px;
}
.timeline-dot {
  height: 20px;
  width: 20px;
  position: absolute;
  background: #286b8b;
  border-radius: 20px;
  margin-left: 42px;
  margin-top: 120px;
}
.memorial-bg {
  width: 100%;
  background: black;
  padding-left: 15px;
}
.timeline-header {
  padding-top: 45px;
  display: flex;
}
.timeline-header .person-img {
  margin-left: 22px;
  margin-top: -10px;
  width: 60px;
}

.timeline-body {
  margin-left: 80px;
  margin-top: 25px;
  display: inline-block;
}
.timeline-title {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 250px;
  color: grey;
  font-size: 24px;
}
.timeline-content {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 250px;
  margin: 10px;
}
.person-img {
  box-shadow: 10px 10px 22px -13px rgba(0, 0, 0, 0.75);
  width: 90px;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  top: 65px;
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
  width: 3rem;
  height: 3rem;
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
  padding: 20px;
}
.event {
  height: 300px;
  border-radius: 10px;
  -webkit-box-shadow: 2px 4px 9px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 2px 4px 9px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 2px 4px 9px 0px rgb(213 213 213 / 75%);
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
