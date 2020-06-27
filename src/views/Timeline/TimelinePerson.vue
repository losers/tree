<template>
  <div id="app">
    <div v-if="$route.params.member">
      <section v-if="error">
        <h3>Something went wrong {{error}}</h3>
      </section>
      <section v-else>
        <section v-if="loading">Loading...</section>
        <section v-else>
          <!-- Titlebar -->
          <div class="timeline-titlebar">
            <router-link
              :to="{name:'MainTree', params:{id:$route.params.id}}"
              class="float-left mt-2 ml-1"
            >
              <i class="icofont-arrow-left"></i>
              Back
            </router-link>
            <b class="timeline-title">{{user.name }}'s Timeline</b>
          </div>

          <!-- Alert Modals -->
          <transition name="fade">
            <div
              v-show="show_alert"
              style="right: 30px;position: fixed;margin-top:50px;"
              class="alert float-right"
              :class="success_alert?'alert-success':'alert-danger'"
            >
              <p v-if="success_alert">
                <strong>Success!</strong>
                {{modal_msg}}.
              </p>
              <p v-else>
                <strong>Error!</strong>
                Something went wrong {{modal_msg}}.
              </p>
            </div>
          </transition>

          <div class="row pt-5" style="margin:0">
            <div class="col-md-6 col-sm-12">
              <div v-if="dataTimeline.length!=0">
                <!-- <select v-model="order">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>-->

                <!-- TImeline Componet -->
                <Timeline
                  class="mt-4"
                  :timeline-items="dataTimeline"
                  :unique-year="false"
                  :show-day-and-month="true"
                  :order="order"
                  :namesMap="namesMap"
                />
              </div>

              <!-- No Timeline found -->
              <img
                v-else
                src="@/assets/no_timeline-min.jpg"
                height="350px"
                width="200px"
                class="mt-5"
                alt="Blood Line Helper"
              />
            </div>

            <div class="timeline_add_box" v-show="!$device.mobile">
              <form v-on:submit.prevent="sendData">
                <h3 class="mt-3" style="margin-bottom:40px;">{{edit?"Update":"Create"}} Event</h3>
                <div class="row input-con">
                  <label class="col-3 label">Date</label>
                  <md-datepicker
                    class="col-7"
                    v-model="line.date"
                    placeholder="Event Date"
                    required="true"
                  />
                </div>
                <div class="row input-con">
                  <label class="col-3 label">Title</label>
                  <input
                    type="text"
                    class="form-control col-7"
                    placeholder="Enter Event Title"
                    v-model="line.title"
                    required="true"
                  />
                </div>
                <div class="row input-con">
                  <label class="col-3 label">Desciption</label>
                  <textarea
                    class="form-control col-7 rounded-2"
                    rows="3"
                    maxlength="1000"
                    v-model="line.content"
                    required="true"
                    placeholder="Event description"
                  ></textarea>
                </div>
                <div class="row input-con">
                  <label class="col-3 label">Share with</label>
                  <v-select
                    class="col-7"
                    style="height: 35px;"
                    multiple
                    :options="names"
                    v-model="shared_with"
                  ></v-select>
                </div>

                <div class="row input-con justify-content-around mb-4">
                  <button type="submit" class="btn btn-success btn" :disabled="reqload">
                    <span class="spinner-border spinner-border-sm" v-show="reqload"></span>
                    {{edit?"Update":"Create"}}
                  </button>
                  <button class="btn btn-cancel" type="reset" @click="cancelclk">Cancel</button>
                  <button
                    type="button"
                    @click="deleteItem()"
                    v-show="edit"
                    :disabled="del"
                    class="btn btn-danger btn"
                  >
                    <span class="spinner-border spinner-border-sm" v-show="del"></span>
                    Delete Permanently
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </section>
    </div>
    <div v-else>
      <h3>No timeline</h3>
    </div>
  </div>
</template>

<script>
import Timeline from "@/components/Timeline/Timeline";
import VueMaterial from "vue-material";
import Axios from "axios";
import Vue from "vue";
import "vue-material/dist/vue-material.min.css";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Store from "../../store/index";

// var emitData;

Vue.use(VueMaterial);
import ProData from "../../data.js";

export default {
  name: "App",
  components: {
    Timeline,
    vSelect
  },
  watch: {
    names() {
      if (this.names.length > 0) {
        this.getTimelineData();
      }
    }
  },
  mounted() {
    if (this.names.length > 0) {
      this.getTimelineData();
    }
    //Emit for listening edit timeline
    this.$root.$on("edit-timeline", (data, shared) => {
      this.line = Object.assign({}, data); //for form

      this.shared_with = shared;
      this.edit = true;
    });
  },
  methods: {
    getTimelineData() {
      Axios.get(
        ProData.getHostURL() +
          "/timeline/" +
          this.$route.params.id +
          "/" +
          this.$route.params.member
      )
        .then(data => {
          //Timeline Meta Data
          this.user.fullname = data.data[0].name;
          this.user.name = data.data[0].short_name;
          if (!data.data[0].timeline) {
            data.data[0].timeline = [];
          }
          this.dataTimeline = data.data[0].timeline;

          //Adding Birhday to Timeline
          if (data.data[0].dob) {
            let udob = {
              content: "Birthday Time",
              date: new Date(data.data[0].dob),
              fixed: true,
              title: "Birthday"
            };
            this.dataTimeline.push(udob);
          }

          //Adding Death date to Timline if exists
          if (data.data[0].died_on) {
            let udob = {
              content: "Died",
              date: new Date(data.data[0].died_on),
              fixed: true,
              title: "Died On"
            };
            this.dataTimeline.push(udob);
          }
          for (let i = 0; i < this.names.length; i++) {
            this.namesMap[this.names[i].value] = this.names[i].label;
          }
          this.loading = false;
        })
        .catch(err => {
          this.error = err;
        });
    },
    sendData() {
      if (this.line.date != null) {
        this.reqload = true;
        //eve is the final obj
        let eve = {
          date: this.line.date,
          title: this.line.title,
          content: this.line.content
        };
        eve.shared_with = [];
        if (this.shared_with.length > 0) {
          for (var i = 0; i < this.shared_with.length; i++) {
            eve.shared_with.push(this.shared_with[i].value);
          }
        }
        if (this.edit) {
          //Updating an event
          eve.id = this.line.id;
          Axios.put(
            ProData.getHostURL() +
              "/timeline/" +
              this.$route.params.id +
              "/" +
              this.$route.params.member,
            eve
          )
            .then(() => {
              for (let i = 0; i < this.dataTimeline.length; i++) {
                if (this.dataTimeline[i]["id"] == this.line.id) {
                  this.$set(this.dataTimeline, i, eve);
                }
              }
              this.cancelclk();
              this.alertStatus(true, "Updated an event");
            })
            .catch(err => {
              this.alertStatus(false, err);
            })
            .finally(() => (this.reqload = false));
        } else {
          //creating an event and pushing event to array locally
          Axios.post(
            ProData.getHostURL() +
              "/timeline/" +
              this.$route.params.id +
              "/" +
              this.$route.params.member,
            eve
          )
            .then(data => {
              eve.id = data.data;
              this.alertStatus(true, "Created a Event");
              this.dataTimeline.push(eve);
              this.line = {};
              this.shared_with = [];
            })
            .catch(err => {
              this.alertStatus(false, err);
            })
            .finally(() => (this.reqload = false));
        }
      } else {
        this.alertStatus(false, "Please select a date");
      }
    },

    //Alert Model showing function
    alertStatus(status, msg) {
      this.modal_msg = msg;
      this.show_alert = true;
      this.success_alert = status;
      setTimeout(() => {
        this.show_alert = false;
      }, 2000);
    },

    //Cancel btn function
    cancelclk() {
      this.line = {};
      this.edit = false;
      this.shared_with = [];
    },

    //Delete Btn Function
    deleteItem() {
      this.del = true;
      Axios.delete(
        ProData.getHostURL() +
          "/timeline/" +
          this.$route.params.id +
          "/" +
          this.$route.params.member,
        {
          data: { id: this.line.id }
        }
      )
        .then(() => {
          this.alertStatus(true, "Deleted a Event");
          let temparr = this.dataTimeline;
          temparr = temparr.filter(x => x.id !== this.line.id);
          this.dataTimeline = temparr;
          this.cancelclk();
        })
        .catch(err => {
          this.alertStatus(false, err);
        })
        .finally(() => (this.del = false));
    }
  },
  data: () => ({
    user: {},
    error: null,
    modal_msg: null,
    loading: true,
    show_alert: false,
    success_alert: false,
    line: {},
    order: "asc",
    edit: false,
    itemIndex: null,
    dataTimeline: [],
    shared_with: [],
    reqload: false,
    del: false,
    namesMap: {},
    emitData: {}
  }),
  computed: {
    names: {
      get() {
        var name = Store.getters.getAllMembers;
        name = name.filter(obj => {
          return obj.value !== this.$route.params.member;
        });
        return name;
      }
    }
  }
};
</script>

<style>
.btn-cancel {
  border: 1px solid black;
}
.input-con {
  display: flex;
  align-items: center;
  margin: 0px;
  margin-bottom: 30px !important;
}
.input-con .label {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px;
}
.input-con .md-field {
  padding: 0px;
  margin: 0px;
}
.input-con .v-select {
  padding: 0px;
}
.timeline-titlebar {
  position: fixed;
  width: 100%;
  z-index: 100;
  box-shadow: -1px 3px 20px -10px rgba(163, 163, 163, 0.75);
  padding: 5px;
  background-color: white;
  display: flex;
  align-items: center;
}
.timeline-title {
  font-size: 30px;
  color: black;
  font-weight: bold;
  flex: 1;
  margin: 10px;
}
.timeline_add_box {
  overflow: scroll;
  max-height: 600px;
  position: fixed;
  border-radius: 20px;
  top: 20%;
  right: 10%;
  width: 650px;
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
