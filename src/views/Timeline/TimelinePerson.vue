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
          <div class="titlebar">
            <router-link
              :to="{name:'MainTree', params:{id:$route.params.id}}"
              class="float-left mt-2 ml-1"
            >
              <i class="icofont-arrow-left"></i>
              Back
            </router-link>
            <p class="title pt-3">{{user.name }}'s Timeline</p>
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

          <div class="row pt-5">
            <div class="col-6">
              <div v-if="dataTimeline.length!=0">
                <!-- <select v-model="order">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>-->

                <!-- TImeline Componet -->
                <Timeline
                  :timeline-items="dataTimeline"
                  :unique-year="false"
                  :show-day-and-month="true"
                  :order="order"
                />
              </div>

              <!-- No Timeline found -->
              <img
                v-else
                src="@/assets/no_timeline-min.jpg"
                height="350px"
                width="200px"
                class="mt-5"
              />
            </div>
            <div class="col-5 mt-5 timeline_add_box pt-5">
              <form v-on:submit.prevent="sendData">
                <h3 class="mb-3">{{edit?"Update":"Create"}} a Event</h3>
                <div class="row mt-3">
                  <label class="col-3 mt-2">Date</label>
                  <md-datepicker
                    class="col-7 p-1 ml-2"
                    v-model="line.date"
                    placeholder="Event Date"
                    required="true"
                  />
                </div>
                <div class="row">
                  <label class="col-3 mt-2">Title:</label>
                  <input
                    type="text"
                    class="form-control col-7"
                    placeholder="Enter Short Name"
                    v-model="line.title"
                    required="true"
                  />
                </div>
                <div class="row mt-3">
                  <label class="col-3 mt-2">Desciption</label>
                  <textarea
                    class="form-control col-7 rounded-2"
                    rows="3"
                    maxlength="150"
                    v-model="line.content"
                    required="true"
                    placeholder="Event description"
                  ></textarea>
                </div>

                <div class="row justify-content-around">
                  <button type="submit" class="btn btn-success btn mt-4">{{edit?"Update":"Create"}}</button>
                  <button class="btn btn-warning mt-4" type="reset" @click="cancelclk">Cancel</button>
                  <button
                    type="button"
                    @click="deleteItem()"
                    v-show="edit"
                    class="btn btn-danger btn mt-4"
                  >Delete Permanently</button>
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
import "vue-material/dist/theme/default.css";

Vue.use(VueMaterial);
import ProData from "../../data.js";

export default {
  name: "App",
  components: {
    Timeline
  },
  mounted() {
    Axios.get(
      ProData.getHostURL() +
        "/timeline/" +
        this.$route.params.id +
        "/" +
        this.$route.params.member
    )
      .then(data => {
        this.user.fullname = data.data[0].name;
        this.user.name = data.data[0].short_name;
        if (!data.data[0].timeline) {
          data.data[0].timeline = [];
        }
        this.dataTimeline = data.data[0].timeline;

        if (data.data[0].dob) {
          let udob = {
            content: "Birthday Time",
            date: new Date(data.data[0].dob),
            fixed: true,
            title: "Birthday"
          };
          this.dataTimeline.push(udob);
        }
        if (data.data[0].died_on) {
          let udob = {
            content: "Died",
            date: new Date(data.data[0].died_on),
            fixed: true,
            title: "Died On"
          };
          this.dataTimeline.push(udob);
        }
        this.loading = false;
      })
      .catch(err => {
        this.error = err;
      });

    //Emit for listening edit timeline
    this.$root.$on("edit-timeline", data => {
      this.line = data;
      this.edit = true;
    });
  },
  methods: {
    sendData() {
      if (this.line.date != null) {
        let eve = {
          date: this.line.date,
          title: this.line.title,
          content: this.line.content
        };
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
              this.cancelclk();
              this.alertStatus(true, "Updated an event");
            })
            .catch(err => {
              this.alertStatus(false, err);
            });
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
            })
            .catch(err => {
              this.alertStatus(false, err);
            });
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
    },

    //Delete Btn Function
    deleteItem() {
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
        });
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
    dataTimeline: []
  })
};
</script>

<style>
.titlebar { 
  position: fixed;
  width: 100%;
  z-index: 100;
  box-shadow: -1px 3px 20px -10px rgba(163, 163, 163, 0.75);
  padding: 5px;
  background-color: white;
  height: 50px;
}
.title {
  font-size: 30px;
  color: black;
  font-weight: bold;
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
