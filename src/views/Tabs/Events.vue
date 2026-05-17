<template>
  <div>
    <div class="main-title mt-3">
      <div class="header font-weight-bold" :class="{ 'f-19': $device.mobile }" style="color: #4f8ef7;">Today's Events</div>
      <div class="today font-weight-bold" :class="{ 'f-16': $device.mobile }" style="color: #a78bfa;">- {{ date.display }}</div>
    </div>
    <div class="load-con" v-if="loading">
      <div class="ml-3 spinner-border spinner-border-sm"></div>
    </div>
    <div v-else-if="events.length == 0">
      <center class="glass-card mt-5 p-5 mx-4" style="border-radius: 20px;">
        <img src="@/assets/events/empty_events.png" height="150px" style="filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.4)); opacity: 0.8;" />
        <div class="mt-4">
          <h3 class="mb-3 font-weight-bold" style="color: #4f8ef7;">It's quiet... too quiet.</h3>
          <h5 style="color: rgba(255, 255, 255, 0.7);">The ancestors are resting today. No events to show!</h5>
        </div>
      </center>
    </div>
    <!-- All Boxes List -->
    <div class="row" v-else style="padding-bottom: 50px">
      <div class="col-xs-12 col-sm-4 event-cont" v-for="(event, index) in events" :key="index">
        <!---------------- Birthday event --------------->
        <div class="event" v-if="event.type == 1">
          <!-- Background -->
          <img src="@/assets/events/bday.png" alt=" Birthday" width="" height="120" />

          <!-- Event Body -->
          <div class="event-body">
            <!-- Direct Picture -->
            <div class="person-img">
              <img
                :src="'data:image/png;base64, ' + store.state.images[event._id]"
                v-if="store.state.images && store.state.images[event._id]"
                alt="Bloodline User"
              />
              <img src="@/assets/dp.png" v-else alt="Bloodline User" />
            </div>

            <!-- Event Content -->
            <center style="z-index: 1;">
              <div class="name font-weight-bold" style="color: white;">{{ event.name }}</div>
              <div class="anniv" style="color: rgba(255,255,255,0.7);">
                <span class="anniv-num" style="color: #4f8ef7;">
                  {{ event.dob | anivCalc }}
                  <span class="a-th">th</span>
                </span>
                Birth Anniversary
              </div>

              <router-link
                :to="{
                  name: 'SubMemberData',
                  params: { subtree_id: event.subtree_id, member: event._id },
                }"
                class="btn mt-3 my-btn-outline"
                v-if="event.subtree_id"
              >View Profile</router-link>

              <router-link
                :to="{
                  name: 'MemberData',
                  params: { id: $route.params.id, member: event._id },
                }"
                class="btn mt-3 my-btn-outline"
                v-else
              >View Profile</router-link>

            </center>
          </div>
        </div>

        <!-------------- Memorial Event ------------->
        <div class="event death glass-card" v-if="event.type == 2">
          <!-- Background -->
          <div class="memorial-bg" style="background: transparent; filter: brightness(0.7) opacity(0.5); border-radius: 20px 20px 0 0;">
            <img src="@/assets/events/candle.jpeg" alt=" Birthday" width="50px" height="120" style="mix-blend-mode: screen;" />
          </div>

          <!-- Event body with DP -->
          <div class="event-body">
            <!-- DP -->

            <div class="person-img">
              <img
                :src="'data:image/png;base64, ' + store.state.images[event._id]"
                v-if="store.state.images && store.state.images[event._id]"
                alt="Bloodline User"
              />
              <img src="@/assets/dp.png" v-else alt="Bloodline User" />
            </div>

            <!-- Event Content -->
            <center style="z-index: 1;">
              <div class="name font-weight-bold" style="color: white;">{{ event.name }}</div>
              <div class="anniv" style="color: rgba(255,255,255,0.7);">
                <span class="anniv-num" style="color: #a78bfa;">
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
                class="btn mt-3 my-btn-outline-purple"
              >View Profile</router-link>
            </center>
          </div>
        </div>

        <!-- Timeline Event -->
        <div class="event glass-card" v-if="event.type == 3">
          <!-- Vertical Line -->
          <div class="timeline-line"></div>
          <!-- Timeline Dot -->
          <span class="timeline-dot"></span>
          <!-- Timeline Header -->
          <div class="timeline-header">
            <div class="person-img timeline-img">
              <img
                :src="'data:image/png;base64, ' + store.state.images[event._id]"
                v-if="store.state.images && store.state.images[event._id]"
                alt="Bloodline User"
              />
              <img src="@/assets/dp.png" v-else alt="Bloodline User" />
            </div>
            <div class="name font-weight-bold" style="margin-left: 120px; color: white;">{{ event.name }}</div>
          </div>
          <div class="timeline-body">
            <div class="timeline-title">{{ event.title }}</div>
            <div class="timeline-content">{{ event.content }}</div>
            <router-link
              :to="{
                name: 'PersonTimeline',
                params: { id: $route.params.id, member: event._id },
              }"
              class="btn mt-2 my-btn-outline"
            >View Timeline</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  background: rgba(15, 17, 35, 0.65);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  color: white;
}
.f-19 {
  font-size: 19px !important;
}
.f-16 {
  font-size: 16px !important;
}
.death {
  background: rgba(10, 5, 20, 0.7);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  border-color: rgba(167, 139, 250, 0.2);
}
.event-body {
  display: flex;
  margin-top: 15px;
  align-items: center;
  justify-content: center;
  position: relative;
}
.timeline-line {
  height: 300px;
  width: 4px;
  background: linear-gradient(to bottom, #4f8ef7, transparent);
  position: absolute;
  margin-left: 50px;
  border-radius: 2px;
}
.timeline-dot {
  height: 20px;
  width: 20px;
  position: absolute;
  background: #4f8ef7;
  border-radius: 20px;
  margin-left: 42px;
  margin-top: 120px;
  box-shadow: 0 0 15px #4f8ef7;
}
.memorial-bg {
  width: 100%;
  padding-left: 15px;
  position: absolute;
  top: 0;
  left: 0;
}
.timeline-header {
  padding-top: 45px;
  display: flex;
}
.timeline-header .person-img {
  margin-left: 22px;
  margin-top: -10px;
  width: 60px;
  top: auto;
  position: relative;
  box-shadow: 0 0 20px rgba(79, 142, 247, 0.5);
  border: 2px solid #4f8ef7;
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
  color: #a78bfa;
  font-size: 24px;
  font-weight: 600;
}
.timeline-content {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 250px;
  margin: 10px 0;
  color: rgba(255,255,255,0.7);
}
.person-img {
  width: 90px;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  top: 65px;
  border: 3px solid #4f8ef7;
  box-shadow: 0 0 25px rgba(79, 142, 247, 0.6);
  z-index: 2;
  background: #0f1123;
}
.death .person-img {
  border-color: #a78bfa;
  box-shadow: 0 0 25px rgba(167, 139, 250, 0.6);
}
.timeline-img {
  width: 60px;
  height: 60px;
}
.a-th {
  font-size: 14px;
}
.anniv-num {
  font-size: 36px;
  font-weight: 700;
}
.name {
  font-size: 28px;
  margin-top: 30px;
}
.load-con {
  display: flex;
  justify-content: center;
  margin-top: 90px;
}
.spinner-border-sm {
  font-size: 20px;
  color: #4f8ef7;
  width: 3rem;
  height: 3rem;
  border-width: 0.2em;
}
.main-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
}
.event-cont {
  padding: 20px;
}
.event {
  height: 300px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border-radius: 20px;
}
.event:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}
.my-btn-outline {
  background: transparent !important;
  border: 1px solid #4f8ef7 !important;
  padding: 6px 16px !important;
  border-radius: 8px !important;
  color: #4f8ef7 !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  z-index: 10;
  position: relative;
}
.my-btn-outline:hover {
  background: rgba(79, 142, 247, 0.1) !important;
  box-shadow: 0 0 15px rgba(79, 142, 247, 0.3) !important;
}
.my-btn-outline-purple {
  background: transparent !important;
  border: 1px solid #a78bfa !important;
  padding: 6px 16px !important;
  border-radius: 8px !important;
  color: #a78bfa !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  z-index: 10;
  position: relative;
}
.my-btn-outline-purple:hover {
  background: rgba(167, 139, 250, 0.1) !important;
  box-shadow: 0 0 15px rgba(167, 139, 250, 0.3) !important;
}
</style>

<script>
import ProdData from "@/data.js";
import axios from "axios";
import moment from "moment";
import { getNormalDisplayDate, getAPIFormat } from "@/util/helper";
import Store from "@/store/index";
export default {
  name: "Events",
  data() {
    return {
      date: {
        display: getNormalDisplayDate(),
        api: getAPIFormat()
      },
      loading: true,
      store: {}
    };
  },
  filters: {
    anivCalc: function(value) {
      let a = moment(value);
      let b = moment();
      return b.diff(a, "years");
    }
  },
  mounted() {
    this.store = Store;
    let eventsUrl = `${ProdData.getHostURL()}/events/?date=${this.date.api}`;
    axios
      .get(eventsUrl)
      .then(response => {
        this.events = response.data;
      })
      .finally(() => {
        this.loading = false;
      });
  }
};
</script>
