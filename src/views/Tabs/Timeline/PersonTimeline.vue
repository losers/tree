<template>
  <div id="app">
    <section v-if="error">
      <h3>Something went wrong {{ error }}</h3>
    </section>
    <section v-else style="margin-top: -35px">
      <section v-if="payload.loading.main">
        <center style="padding-top: 240px">
          <img src="@/assets/dna.gif" alt="Bloodline Loader" />
        </center>
      </section>
      <section v-else>
        <!-- Titlebar -->
        <!-- <div class="timeline-titlebar">
          <router-link
            :to="{ name: 'MainTree', params: { id: $route.params.id } }"
            class="float-left ml-1"
          >
            <i class="icofont-arrow-left"></i>
            Back
          </router-link>
          <b class="timeline-title">{{ user.name }}'s Timeline</b>
        </div> -->

        <!-- Alert Modals -->
        <transition name="fade">
          <div
            v-show="show_alert"
            style="right: 10px; position: fixed; margin-top: 10px; z-index: 10"
            class="alert float-right"
            :class="success_alert ? 'alert-success' : 'alert-danger'"
          >
            <p v-if="success_alert">
              <strong>Success!</strong>
              {{ modal_msg }}.
            </p>
            <p v-else>
              <strong>Error!</strong>
              Something went wrong {{ modal_msg }}.
            </p>
          </div>
        </transition>

        <div class="row pt-5 justify-content-center" style="margin: 0; display: flex; gap: 40px;">
          <div class="col-md-7 col-sm-12" style="max-width: 650px;">
            <b class="timeline-title">{{ user.name }}'s Timeline</b>

            <div v-if="dataTimeline.length != 0">
              <Timeline
                class="mt-4 pb-5 mb-5"
                :timeline-items="dataTimeline"
                :unique-year="false"
                :show-day-and-month="true"
                :order="order"
                :namesMap="namesMap"
              />
            </div>

            <!-- No Timeline found -->
            <div v-else class="timeline-intro col-md-10 glass-card-form p-5 text-left">
              <h4 style="color: #a78bfa; font-weight: bold; margin-bottom: 25px; font-family: 'Comfortaa', sans-serif;">
                <i class="icofont-info-circle"></i> Timeline is Empty
              </h4>
              <div class="intro-item">
                <span class="intro-icon"><i class="icofont-heart-alt"></i></span>
                <p>Add special life events like Birthdays, Anniversaries, and milestones to build your story.</p>
              </div>
              <div class="intro-item mt-4">
                <span class="intro-icon"><i class="icofont-share-alt"></i></span>
                <p>Events like family trips, marriages, and reunions can be added and shared with other family members, instantly appearing on their timelines too!</p>
              </div>
              <div class="intro-item mt-4">
                <span class="intro-icon"><i class="icofont-notification"></i></span>
                <p>Smart notifications will keep everyone in the loop when special anniversaries roll around.</p>
              </div>
            </div>

            <div v-if="$device.mobile">
              <!-- Swiper and modal -->
              <DualPage
                v-if="showDualPage"
                :onlySwiper="true"
                :payload="payload"
                :reference="4"
                v-on:crudops="formEmit"
                ref="dualPageRef"
                v-on:closed="swiperDown"
              ></DualPage>

              <!-- Add Event Button for Mobile -->
              <div
                v-if="!view_only"
                class="mobile-action-bar"
              >
                <button
                  @click="wrapperUp"
                  class="btn my-action-btn glass-success w-100"
                >
                  <i class="icofont-plus-circle mr-2" style="font-size: 20px;"></i> Add Event
                </button>
              </div>
            </div>
          </div>

          <div
            class="col-md-5 d-none d-md-block"
            v-if="!payload.loading.main && !view_only"
          >
            <div class="timeline_add_box">
            <TimelineForm
              :payload="payload"
              v-on:crudops="formEmit"
            ></TimelineForm>
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import Timeline from "@/components/Timeline/Timeline";
import Axios from "axios";
import Store from "@/store/index";
import DualPage from "@/modals/DualPage";
import ProData from "@/data.js";
import TimelineForm from "@/components/TimelineForm";

export default {
  name: "App",
  components: {
    Timeline,
    DualPage,
    TimelineForm,
  },
  watch: {
    names() {
      if (this.names != null) {
        this.getTimelineData();
      }
    },
  },
  mounted() {
    if (this.names != null) {
      this.getTimelineData();
    }

    //Emit for listening edit timeline
    this.$root.$on("edit-timeline", (data, shared) => {
      if (this.$device.mobile) {
        this.showDualPage = true;
      }
      this.payload.formData = Object.assign({}, data); //for creating a new object eliminating a reference
      this.payload.formData.shared_with = shared;
      this.payload.formData.isEdit = true;
    });
  },
  methods: {
    getTimelineData() {
      this.payload.names = this.names;
      Axios.get(
        ProData.getHostURL() +
          "/timeline/" +
          this.$route.params.id +
          "/" +
          this.$route.params.member
      )
        .then((data) => {
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
              content: `[ Automatically created from ${this.user.fullname} data. ]`,
              date: new Date(data.data[0].dob),
              fixed: true,
              title: "Birthday",
            };
            this.dataTimeline.push(udob);
          }

          //Adding Death date to Timline if exists
          if (data.data[0].died_on) {
            let udob = {
              content: `[ Automatically created from ${this.user.fullname} data. ]`,
              date: new Date(data.data[0].died_on),
              fixed: true,
              title: "Date of Demise",
            };
            this.dataTimeline.push(udob);
          }
          for (let i = 0; i < this.names.length; i++) {
            this.namesMap[this.names[i].value] = this.names[i].label;
          }
          this.payload.loading.main = false;
        })
        .catch((err) => {
          this.error = err;
        });
    },
    sendData() {
      if (this.payload.formData.date != null) {
        this.payload.loading.change = true;
        //eve is the final obj
        let eve = {
          date: this.payload.formData.date,
          title: this.payload.formData.title,
          content: this.payload.formData.content,
        };
        eve.shared_with = [];
        if (
          this.payload.formData.shared_with &&
          this.payload.formData.shared_with.length > 0
        ) {
          for (var i = 0; i < this.payload.formData.shared_with.length; i++) {
            eve.shared_with.push(this.payload.formData.shared_with[i].value);
          }
        }
        if (this.payload.formData.isEdit) {
          //Updating an event
          eve.id = this.payload.formData.id;
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
                if (this.dataTimeline[i]["id"] == this.payload.formData.id) {
                  this.$set(this.dataTimeline, i, eve);
                }
              }
              this.cancelclk();
              this.alertStatus(true, "Updated an event");
            })
            .catch((err) => {
              this.alertStatus(false, err);
            })
            .finally(() => (this.payload.loading.change = false));
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
            .then((data) => {
              eve.id = data.data;
              this.alertStatus(true, "Created a Event");
              this.dataTimeline.push(eve);
              this.cancelclk();
            })
            .catch((err) => {
              this.alertStatus(false, err);
            })
            .finally(() => (this.payload.loading.change = false));
        }
      } else {
        this.alertStatus(false, "Please select a date");
      }
    },

    //Called when the TImeline form Emits Callback
    formEmit(type) {
      console.log(type);
      switch (type) {
        case 0:
          this.sendData();
          break;
        case 1:
          this.cancelclk();
          break;
        case 2:
          this.deleteItem();
          break;
        default:
          break;
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
      if (this.$device.mobile) {
        this.$refs.dualPageRef.swiperClose();
      }
      this.payload.formData.shared_with = [];
      this.payload.formData = {};
      this.payload.formData.isEdit = false;
    },

    //Listens for Swiper to Down
    swiperDown() {
      this.showDualPage = false;
    },

    //Delete Btn Function
    deleteItem() {
      this.payload.loading.delete = true;
      Axios.delete(
        ProData.getHostURL() +
          "/timeline/" +
          this.$route.params.id +
          "/" +
          this.$route.params.member,
        {
          data: { id: this.payload.formData.id },
        }
      )
        .then(() => {
          this.alertStatus(true, "Deleted a Event");
          let temparr = this.dataTimeline;
          temparr = temparr.filter((x) => x.id !== this.payload.formData.id);
          this.dataTimeline = temparr;
          this.cancelclk();
        })
        .catch((err) => {
          this.alertStatus(false, err);
        })
        .finally(() => (this.payload.loading.delete = false));
    },

    wrapperUp() {
      this.payload.names = this.names;
      this.showDualPage = true;
    },
  },
  data: () => ({
    user: {},
    error: null,
    modal_msg: null,
    show_alert: false,
    success_alert: false,
    order: "asc",
    itemIndex: null,
    dataTimeline: [],
    namesMap: {},
    emitData: {},
    showDualPage: false,
    payload: {
      formData: { isEdit: false, shared_with: [] },
      loading: { main: true, delete: false, change: false },
    },
  }),
  computed: {
    names: {
      get() {
        var name = Store.getters.getAllMembers;
        if (name.length == 0) return null;
        name = name.filter((obj) => {
          return obj.value !== this.$route.params.member;
        });

        return name;
      },
    },
    view_only: {
      get() {
        return Store.state.view_only;
      },
    },
  },
};
</script>

<style>
.timeline-intro .icofont-arrow-right {
  color: indianred;
}
.timeline-intro {
  margin-top: 50px !important;
}
.intro-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}
.intro-icon {
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
}
.intro-item p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
}
.card {
  z-index: 10;
}
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
  height: 50px;
  position: fixed;
  width: 100%;
  z-index: 1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 5px;
  background-color: rgba(15, 17, 35, 0.8);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
}
.timeline-title {
  font-size: 32px;
  color: white !important;
  font-family: 'Comfortaa', sans-serif;
  font-weight: 700;
  margin: 10px 0 30px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  white-space: nowrap;
}
.mobile-action-bar {
  position: fixed;
  bottom: 0px;
  left: 0;
  width: 100%;
  padding: 16px 24px;
  background: rgba(15, 17, 35, 0.85);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 99;
}
.timeline_add_box {
  position: sticky;
  top: 100px;
  border-radius: 20px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  background: rgba(15, 17, 35, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.timeline_add_box::-webkit-scrollbar {
  display: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
