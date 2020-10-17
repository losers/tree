<template>
  <div>
    <div class="main-title">
      <div class="header">Today's Events</div>
      <div class="today">- {{date.display}}</div>
    </div>
    <div class="load-con" v-if="loading">
      <div class="ml-3 spinner-border spinner-border-sm"></div>
    </div>
    <div class="row" v-else>
      <div class="col-xs-12 col-sm-4 event-cont" v-for="(event, index) in events" :key="index">
        <div class="event" v-if="event.type == 1">
          <div class="event-head">
            <div class="test">
              <img src="@/assets/cake.jpg" alt="Cake for Family Birthday" width="70" height="70" />
              <div class="content">
                <div class="name">{{event.nae}}</div>
                <div class="anniv">
                  <span class="anniv-num">
                    {{event.dob | anivCalc}}
                    <span class="a-th">th</span>
                  </span> Birth Anniversary
                </div>
              </div>
            </div>
            <div class="person-img">
              <img
                :src="'data:image/png;base64, '+store.state.images[event._id]"
                v-if="store.state.images[event._id]"
                alt="Blood Line User"
              />
              <img src="@/assets/dp.png" v-else alt="Blood Line User" />
            </div>
          </div>
          <div class="event-body"></div>
        </div>
        <!-- <div class="event" v-if="event.type == 2">
          <img src="@/assets/candle.png" alt="Candle for Death Day" width="70" height="70" />
          <div class="content">
            <div class="name">{{event.name}}</div>
            <div class="anniv">
              <span class="anniv-num">{{event.dob | anivCalc}}<span class="a-th">th</span></span> Memorial day
            </div>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>

<style scoped>
.test {
  display: flex;
  width: 100%;
  align-items: center;
}
.event-head {
  display: flex;
  height: 110px;
  padding: 10px;
  align-items: center;
  justify-content: center;
}
.person-img {
  width: 118px;
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
.content {
  margin-left: 20px;
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
        api: getAPIFormat()
      },
      events: [],
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