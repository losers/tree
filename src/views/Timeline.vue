<template>
  <div id="app">
    <div v-if="$route.query.id">
      <h3>{{$route.query.id}}</h3>
      <div class="row">
        <div class="col-6" :class="{mymargin : !is_session}">
          <Timeline
            :timeline-items="dataTimeline"
            :unique-year="false"
            :show-day-and-month="true"
            order="desc"
            v-on:click="consoleme"
          />
        </div>
        <div class="col-5 mt-5 timeline_add_box pt-5" v-show="is_session">
          <form v-on:submit.prevent="sendData">
            <h3 class="mb-3">Add a Event</h3>
            <div class="row mt-3">
              <label class="col-3 mt-2">Date</label>
              <md-datepicker class="col-7 p-1 ml-2" v-model="line.date" placeholder="Event Date" />
            </div>
            <div class="row">
              <label class="col-3 mt-2">Title:</label>
              <input
                type="text"
                class="form-control col-7"
                placeholder="Enter Short Name"
                v-model="line.title"
              />
            </div>
            <div class="row mt-3">
              <label class="col-3 mt-2">Desciption</label>
              <textarea
                class="form-control col-7 rounded-2"
                rows="3"
                maxlength="150"
                v-model="line.description"
                placeholder="Event description"
              ></textarea>
            </div>
            <div class="row mt-3">
              <label class="col-3 mt-2">Link:</label>
              <input
                type="url"
                class="form-control col-7"
                placeholder="Photos Album link"
                v-model="line.link"
              />
            </div>
            <button type="submit" class="btn btn-success btn mt-4">Create</button>
          </form>
        </div>
      </div>
    </div>
    <div v-else>
      <h3>No timeline</h3>
    </div>
  </div>
</template>

<script>
import Timeline from "timeline-vuejs";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import Vue from "vue";
Vue.use(VueMaterial);
export default {
  name: "App",
  components: {
    Timeline
  },
  methods: {
    consoleme() {
      console.log("test");
    },
    sendData() {
      let eve = {
        from: this.line.date,
        title: this.line.title,
        description:
          this.line.description +
          `<br> <a class='timelinelinks' href='${this.line.link}' target='_blank'>${this.line.link}</a>`,
        showDayAndMonth: true
      };
      console.log(eve);
      this.dataTimeline.push(eve);
    }
  },
  data: () => ({
    line: {},
    is_session: false,
    dataTimeline: [
      {
        from: new Date(2017, 5, 22),
        title: "Name",
        showDayAndMonth: true,
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius earum architecto dolor, vitae magnam voluptate accusantium assumenda numquam error mollitia, officia facere consequuntur reprehenderit cum voluptates, ea tempore beatae unde. <br /> hello"
      },
      {
        from: new Date(2017, 8),
        title: "Name",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius earum architecto dolor, vitae magnam voluptate accusantium assumenda numquam error mollitia, officia facere consequuntur reprehenderit cum voluptates, ea tempore beatae unde."
      },
      {
        from: new Date(2016, 11),
        title: "Name",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius earum architecto dolor, vitae magnam voluptate accusantium assumenda numquam error mollitia, officia facere consequuntur reprehenderit cum voluptates, ea tempore beatae unde."
      },
      {
        from: new Date(2018, 7, 19),
        title: "Name",
        showDayAndMonth: true,
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius earum architecto dolor, vitae magnam voluptate accusantium assumenda numquam error mollitia, officia facere consequuntur reprehenderit cum voluptates, ea tempore beatae unde." +
          "<br>" +
          "<a class='timelinelinks' href=" +
          "#" +
          ">" +
          "Links" +
          "</a>"
      },
      {
        from: new Date(2016, 1),
        title: "Name",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius earum architecto dolor, vitae magnam voluptate accusantium assumenda numquam error mollitia, officia facere consequuntur reprehenderit cum voluptates, ea tempore beatae unde."
      },
      {
        from: new Date(2016, 6),
        title: "Name",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius earum architecto dolor, vitae magnam voluptate accusantium assumenda numquam error mollitia, officia facere consequuntur reprehenderit cum voluptates, ea tempore beatae unde."
      },
      {
        from: new Date(2013, 1),
        title: "Name",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius earum architecto dolor, vitae magnam voluptate accusantium assumenda numquam error mollitia, officia facere consequuntur reprehenderit cum voluptates, ea tempore beatae unde."
      },
      {
        from: new Date(2015, 1),
        title: "Name",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius earum architecto dolor, vitae magnam voluptate accusantium assumenda numquam error mollitia, officia facere consequuntur reprehenderit cum voluptates, ea tempore beatae unde."
      },
      {
        from: new Date(2012, 1),
        title: "Name",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius earum architecto dolor, vitae magnam voluptate accusantium assumenda numquam error mollitia, officia facere consequuntur reprehenderit cum voluptates, ea tempore beatae unde."
      }
    ]
  })
};
</script>

<style>
.mymargin{
    margin-left: 30%;
}
.timeline .wrapper-item {
  margin-bottom: 0 !important;
}
.title-item {
  margin: 10px 0 !important;
  font-weight: bold !important;
  font-size: 20px !important;
}
a.timelinelinks {
  position: absolute;
  font-weight: bold;
  margin-top: 5px !important;
}
.timeline_add_box {
  height: 450px;
  position: fixed;
  margin-left: 50%;
  -webkit-box-shadow: 11px 10px 34px -22px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 11px 10px 34px -22px rgba(0, 0, 0, 0.75);
  box-shadow: 11px 10px 34px -22px rgba(0, 0, 0, 0.75);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
