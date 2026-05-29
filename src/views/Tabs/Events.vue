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
        <img src="@/assets/events/empty_events.png" class="empty-state-img" height="150px" style="filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.4)); opacity: 0.8;" />
        <div class="mt-4">
          <h3 class="mb-3 font-weight-bold" style="color: #4f8ef7;">It's quiet... too quiet.</h3>
          <h5 style="color: rgba(255, 255, 255, 0.7);">The ancestors are resting today. No events to show!</h5>
        </div>
      </center>
    </div>
    <!-- All Boxes List -->
    <div class="row" v-else style="padding-bottom: 50px">
      <div class="col-xs-12 col-sm-4 event-cont" v-for="(event, index) in events" :key="index" :style="{ 'animation-delay': (index * 0.12) + 's' }">
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
        <div class="event glass-card timeline-event" v-if="event.type == 3">
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
            <div class="name font-weight-bold">{{ event.name }}</div>
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
.timeline-event {
  padding: 20px 0;
}
.timeline-line {
  height: 100%;
  width: 3px;
  background: linear-gradient(to bottom, #4f8ef7, #a78bfa, transparent);
  background-size: 100% 200%;
  position: absolute;
  top: 0;
  left: 40px;
  border-radius: 2px;
  animation: flowLine 3s infinite linear;
}
@keyframes flowLine {
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 200%; }
}
.timeline-dot {
  height: 14px;
  width: 14px;
  position: absolute;
  background: #4f8ef7;
  border-radius: 50%;
  left: 34.5px;
  top: 110px;
  box-shadow: 0 0 15px #4f8ef7;
  animation: pulseGlow 2s infinite alternate;
}
@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 10px #4f8ef7, 0 0 20px #4f8ef7;
    transform: scale(1);
  }
  100% {
    box-shadow: 0 0 20px #a78bfa, 0 0 40px #a78bfa;
    transform: scale(1.3);
    background: #a78bfa;
  }
}
.memorial-bg {
  width: 100%;
  padding-left: 15px;
  position: absolute;
  top: 0;
  left: 0;
}
.timeline-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.timeline-header .person-img {
  width: 46px;
  height: 46px;
  position: absolute;
  left: 18.5px;
  top: 20px;
  box-shadow: 0 0 15px rgba(79, 142, 247, 0.5);
  border: 2px solid #4f8ef7;
  margin: 0;
}

.timeline-body {
  margin-left: 80px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.timeline-title {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  color: #a78bfa;
  font-size: 20px;
  font-weight: 700;
  margin-top: 5px;
}
.timeline-content {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  margin: 8px 0 15px 0;
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  line-height: 1.4;
  word-break: break-all;
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
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.person-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.death .person-img {
  border-color: #a78bfa;
  box-shadow: 0 0 25px rgba(167, 139, 250, 0.6);
}
.timeline-img {
  width: 46px;
  height: 46px;
}
.a-th {
  font-size: 14px;
}
.anniv-num {
  font-size: 36px;
  font-weight: 700;
}
.name {
  font-size: 22px;
  color: white;
  margin-left: 80px;
  margin-top: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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
  opacity: 0;
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideUpFade {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.event {
  height: 300px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 20px;
}
.event::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 20px;
  box-shadow: inset 0 0 0px rgba(79, 142, 247, 0);
  pointer-events: none;
  transition: all 0.4s ease;
}
.event:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
}
.event:hover::before {
  animation: borderPulse 1.5s infinite alternate;
}
@keyframes borderPulse {
  0% { box-shadow: inset 0 0 15px rgba(79, 142, 247, 0.3); }
  100% { box-shadow: inset 0 0 35px rgba(167, 139, 250, 0.6); }
}
.event:hover .person-img {
  transform: scale(1.1) rotate(5deg);
}
.event:hover .person-img img {
  transform: scale(1.15);
}
.empty-state-img {
  animation: floatEmpty 4s ease-in-out infinite;
}
@keyframes floatEmpty {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px) scale(1.05); }
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
  transform: translateY(-2px);
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
  transform: translateY(-2px);
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
