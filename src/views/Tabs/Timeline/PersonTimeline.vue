<template>
  <div class="person-timeline-page">
    <section v-if="error" class="p-5 text-center">
      <div class="timeline-error-box">
        <i class="icofont-warning-alt text-warning" style="font-size: 36px;"></i>
        <h3 class="mt-3 text-white">Something went wrong</h3>
        <p class="text-white-50">{{ error }}</p>
      </div>
    </section>

    <section v-else>
      <!-- Loading State -->
      <section v-if="payload.loading.main" class="timeline-loading-wrapper">
        <div class="modern-timeline-loader"></div>
        <span class="mt-3 text-white-50 font-weight-500">Loading family timeline...</span>
      </section>

      <section v-else class="timeline-content-wrapper">
        <!-- Floating Toast Alert -->
        <transition name="toast-slide">
          <div
            v-show="show_alert"
            class="floating-timeline-toast"
            :class="success_alert ? 'toast-success' : 'toast-error'"
          >
            <div class="toast-icon">
              <i :class="success_alert ? 'icofont-check-circled' : 'icofont-close-circled'"></i>
            </div>
            <div class="toast-body">
              <strong>{{ success_alert ? 'Success' : 'Notice' }}</strong>
              <span>{{ modal_msg }}</span>
            </div>
          </div>
        </transition>

        <!-- Timeline Hero Header -->
        <div class="timeline-hero-header mb-4">
          <div class="hero-header-inner">
            <router-link
              :to="{ name: 'MainTree', params: { id: $route.params.id } }"
              class="hero-back-pill"
              title="Return to Tree"
            >
              <i class="icofont-arrow-left"></i>
              <span>Back to Tree</span>
            </router-link>

            <div class="hero-identity-card mt-3">
              <div class="hero-avatar-circle">
                <span>{{ user.name ? user.name.charAt(0) : 'T' }}</span>
              </div>
              <div class="hero-identity-text">
                <div class="hero-title-row">
                  <h1 class="ptimeline-hero-title">{{ user.name }}'s Life Timeline</h1>
                  <span class="hero-counter-badge">
                    <i class="icofont-sand-clock mr-1"></i>
                    {{ dataTimeline.length }} {{ dataTimeline.length === 1 ? 'Event' : 'Events' }}
                  </span>
                </div>
                <p class="ptimeline-hero-fullname" v-if="user.fullname && user.fullname !== user.name">
                  {{ user.fullname }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Layout: Timeline Stream (Left) & Sticky Event Box (Right) -->
        <div class="timeline-layout-container">
          <!-- Left: Timeline Stream -->
          <div class="timeline-stream-col">
            <div v-if="dataTimeline.length !== 0" class="timeline-container-box">
              <Timeline
                class="timeline-stream-view"
                :timeline-items="dataTimeline"
                :unique-year="false"
                :show-day-and-month="true"
                :order="order"
                :namesMap="namesMap"
              />
            </div>

            <!-- Empty State -->
            <div v-else class="empty-timeline-card">
              <div class="empty-icon-circle">
                <i class="icofont-sand-clock"></i>
              </div>
              <h3 class="empty-title">Timeline is Quiet</h3>
              <p class="empty-subtitle">
                No events recorded yet. Start building {{ user.name }}'s life story by adding memorable moments!
              </p>

              <div class="empty-guide-grid mt-4">
                <div class="guide-item">
                  <div class="guide-icon icon-heart"><i class="icofont-heart-alt"></i></div>
                  <div class="guide-text">
                    <strong>Milestones & Anniversaries</strong>
                    <span>Record birthdays, marriages, and memorable personal milestones.</span>
                  </div>
                </div>

                <div class="guide-item">
                  <div class="guide-icon icon-share"><i class="icofont-share-alt"></i></div>
                  <div class="guide-text">
                    <strong>Shared Family Memories</strong>
                    <span>Tag family members to have the event appear on their timelines too.</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mobile DualPage Swiper Modal -->
            <div v-if="$device.mobile">
              <DualPage
                v-if="showDualPage"
                :onlySwiper="true"
                :payload="payload"
                :reference="4"
                v-on:crudops="formEmit"
                ref="dualPageRef"
                v-on:closed="swiperDown"
              ></DualPage>

              <!-- Mobile Floating Add Event Button -->
              <div v-if="!view_only" class="mobile-action-bar">
                <button @click="wrapperUp" class="mobile-add-btn">
                  <i class="icofont-plus-circle mr-2"></i>
                  <span>Add Life Event</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Sticky Create/Edit Event Form Panel (Non-mobile screens) -->
          <aside
            class="timeline-form-col"
            v-if="!payload.loading.main && !view_only && !$device.mobile"
          >
            <div class="timeline-form-sticky-wrap">
              <TimelineForm
                :payload="payload"
                v-on:crudops="formEmit"
              ></TimelineForm>
            </div>
          </aside>
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
  name: "PersonTimeline",
  components: {
    Timeline,
    DualPage,
    TimelineForm,
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
        if (!name || name.length === 0) return null;
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

    // Emit listener for editing timeline
    this.$root.$on("edit-timeline", (data, shared) => {
      if (this.$device.mobile) {
        this.showDualPage = true;
      }
      this.payload.formData = Object.assign({}, data);
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
          if (data.data && data.data[0]) {
            this.user.fullname = data.data[0].name;
            this.user.name = data.data[0].short_name;
            if (!data.data[0].timeline) {
              data.data[0].timeline = [];
            }
            this.dataTimeline = data.data[0].timeline;

            // Birthday to Timeline
            if (data.data[0].dob) {
              let udob = {
                content: `[ Automatically created from ${this.user.fullname} data. ]`,
                date: new Date(data.data[0].dob),
                fixed: true,
                title: "Birthday",
              };
              this.dataTimeline.push(udob);
            }

            // Death date to Timeline
            if (data.data[0].died_on) {
              let udob = {
                content: `[ Automatically created from ${this.user.fullname} data. ]`,
                date: new Date(data.data[0].died_on),
                fixed: true,
                title: "Date of Demise",
              };
              this.dataTimeline.push(udob);
            }

            if (this.names) {
              for (let i = 0; i < this.names.length; i++) {
                this.namesMap[this.names[i].value] = this.names[i].label;
              }
            }
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
          // Updating event
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
                if (this.dataTimeline[i]["id"] === this.payload.formData.id) {
                  this.$set(this.dataTimeline, i, eve);
                }
              }
              this.cancelclk();
              this.alertStatus(true, "Updated event successfully");
            })
            .catch((err) => {
              this.alertStatus(false, err);
            })
            .finally(() => (this.payload.loading.change = false));
        } else {
          // Creating event
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
              this.alertStatus(true, "Created event successfully");
              this.dataTimeline.push(eve);
              this.cancelclk();
            })
            .catch((err) => {
              this.alertStatus(false, err);
            })
            .finally(() => (this.payload.loading.change = false));
        }
      } else {
        this.alertStatus(false, "Please select an event date");
      }
    },
    formEmit(type) {
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
    alertStatus(status, msg) {
      this.modal_msg = msg;
      this.show_alert = true;
      this.success_alert = status;
      setTimeout(() => {
        this.show_alert = false;
      }, 3000);
    },
    cancelclk() {
      if (this.$device.mobile && this.$refs.dualPageRef) {
        this.$refs.dualPageRef.swiperClose();
      }
      this.payload.formData.shared_with = [];
      this.payload.formData = {};
      this.payload.formData.isEdit = false;
    },
    swiperDown() {
      this.showDualPage = false;
    },
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
          this.alertStatus(true, "Event deleted");
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
};
</script>

<style>
.person-timeline-page {
  min-height: 100vh;
  padding: 0 16px 80px 16px;
  position: relative;
  text-align: left;
}

.timeline-content-wrapper {
  max-width: 1240px;
  margin: 0 auto;
  text-align: left;
}

/* Hero Header */
.timeline-hero-header {
  padding-top: 20px;
  text-align: left;
}

.hero-header-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.hero-back-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8 !important;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none !important;
  width: fit-content;
  transition: all 0.2s ease;
}
.hero-back-pill:hover {
  background: rgba(79, 142, 247, 0.15);
  border-color: rgba(79, 142, 247, 0.35);
  color: #fff !important;
  transform: translateX(-3px);
}

.hero-identity-card {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  gap: 16px;
}

.hero-avatar-circle {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
  flex-shrink: 0;
}

.hero-identity-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.hero-title-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  text-align: left;
}

.ptimeline-hero-title {
  font-size: 28px;
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: -0.5px;
  margin: 0;
  text-align: left;
}

.hero-counter-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 99px;
  background: rgba(79, 142, 247, 0.15);
  border: 1px solid rgba(79, 142, 247, 0.3);
  color: #60a5fa;
  font-size: 12px;
  font-weight: 700;
}

.ptimeline-hero-fullname {
  font-size: 14px;
  color: #94a3b8;
  margin: 4px 0 0 0;
  font-weight: 500;
  text-align: left;
  display: block;
  width: 100%;
}

/* Two-Column Layout: Stream on Left, Sticky Event Form on Right */
.timeline-layout-container {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  width: 100%;
  position: relative;
}

.timeline-stream-col {
  flex: 1 1 0;
  min-width: 0;
}

.timeline-form-col {
  width: 420px;
  max-width: 420px;
  flex: 0 0 420px;
  position: sticky;
  top: 100px;
  z-index: 20;
}

.timeline-form-sticky-wrap {
  width: 100%;
  max-height: calc(100vh - 130px);
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 24px;
}

.timeline-form-sticky-wrap::-webkit-scrollbar {
  width: 4px;
}
.timeline-form-sticky-wrap::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

@media (max-width: 900px) {
  .timeline-layout-container {
    flex-direction: column;
    gap: 0;
  }
  .timeline-form-col {
    display: none !important;
  }
}

/* Floating Toast */
.floating-timeline-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 16px;
  backdrop-filter: blur(20px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5);
  animation: toastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-success {
  background: rgba(16, 185, 129, 0.9);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast-error {
  background: rgba(239, 68, 68, 0.9);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast-icon {
  font-size: 22px;
}

.toast-body {
  display: flex;
  flex-direction: column;
  font-size: 13.5px;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateY(-20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}
.toast-slide-enter,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Empty State Card */
.empty-timeline-card {
  background: rgba(15, 20, 36, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(167, 139, 250, 0.15);
  border: 1px solid rgba(167, 139, 250, 0.3);
  color: #a78bfa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 22px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}

.empty-subtitle {
  font-size: 14px;
  color: #94a3b8;
  max-width: 440px;
  margin: 8px 0 0 0;
  line-height: 1.5;
}

.empty-guide-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 480px;
  text-align: left;
}

.guide-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.guide-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.icon-heart {
  background: rgba(236, 72, 153, 0.15);
  color: #f472b6;
}

.icon-share {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.guide-text {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #94a3b8;
}
.guide-text strong {
  color: #e2e8f0;
  font-size: 13.5px;
  margin-bottom: 2px;
}

/* Mobile Action Bar */
.mobile-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: rgba(10, 13, 26, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 99;
}

.mobile-add-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border-radius: 14px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
  cursor: pointer;
}

/* Modern Timeline Loader */
.timeline-loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.modern-timeline-loader {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(79, 142, 247, 0.2);
  border-top-color: #4f8ef7;
  border-radius: 50%;
  animation: loader-spin 1s linear infinite;
}

@keyframes loader-spin {
  100% { transform: rotate(360deg); }
}
</style>
