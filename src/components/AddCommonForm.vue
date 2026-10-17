<template>
  <div class="member-form-container">
    <!-- Header -->
    <div class="form-header">
      <div class="header-left">
        <div class="header-avatar-badge">
          <i :class="payload.memData ? 'icofont-edit-alt' : 'icofont-ui-user'"></i>
        </div>
        <div class="header-title-box">
          <h3 class="header-title">{{ payload.memData ? "Edit Member" : "Add Member" }}</h3>
          <p class="header-sub" v-if="payload.memData && data.name">{{ data.name }}</p>
        </div>
      </div>
      <button type="button" class="header-close-btn" @click="goBack" aria-label="Close form">
        <i class="icofont-close-line"></i>
      </button>
    </div>

    <!-- Main Form -->
    <form v-on:submit.prevent="sendData" class="form-content">
      <!-- Scrollable Form Body -->
      <div class="form-scroll-body">
      
      <!-- CARD 1: ESSENTIAL INFO -->
      <div class="form-card essential-card mb-3">
        <div class="card-banner">
          <i class="icofont-id-card card-banner-icon"></i>
          <span>Basic Information</span>
        </div>

        <!-- Full Name -->
        <div class="field-item mb-3">
          <label class="field-label field-label-mobile-hide">
            <span>Full Name</span>
            <span class="required-star">*</span>
          </label>
          <div class="input-control">
            <div class="input-icon"><i class="icofont-user-alt-3"></i></div>
            <input
              type="text"
              class="form-input"
              v-model="data.name"
              placeholder="Full Name *"
              required
              autocomplete="off"
              spellcheck="false"
            />
          </div>
        </div>

        <!-- Short Name / Tree Name -->
        <div class="field-item mb-3">
          <label class="field-label field-label-mobile-hide">
            <span>Short / Tree Name</span>
            <span class="field-hint">(Shown on tree nodes)</span>
          </label>
          <div class="input-control">
            <div class="input-icon"><i class="icofont-tag"></i></div>
            <input
              type="text"
              class="form-input"
              v-model="data.short_name"
              :placeholder="data.name ? data.name : 'Short / Tree Name'"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
        </div>

        <!-- Gender Selector -->
        <div v-if="type_data != 'gender'" class="field-item">
          <label class="field-label">
            <span>Gender</span>
            <span class="required-star">*</span>
          </label>
          <div class="gender-selector-grid">
            <button
              type="button"
              class="gender-pill gender-male"
              :class="{ selected: data.gender == '1' }"
              @click="setGender('1')"
            >
              <div class="gender-symbol"><i class="icofont-business-man"></i></div>
              <span class="gender-label">Male</span>
              <i class="icofont-check-circled check-indicator" v-show="data.gender == '1'"></i>
            </button>
            <button
              type="button"
              class="gender-pill gender-female"
              :class="{ selected: data.gender == '0' }"
              @click="setGender('0')"
            >
              <div class="gender-symbol"><i class="icofont-girl"></i></div>
              <span class="gender-label">Female</span>
              <i class="icofont-check-circled check-indicator" v-show="data.gender == '0'"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- CARD 2: OPTIONAL FIELDS ACCORDION -->
      <div class="form-card collapsible-card mb-3" :class="{ 'is-open': showOptional }">
        <div class="collapsible-header" @click="showOptional = !showOptional">
          <div class="header-main-group">
            <div class="collapsible-icon-box">
              <i class="icofont-options"></i>
            </div>
            <div class="collapsible-text">
              <span class="collapsible-title">Additional Details</span>
            </div>
          </div>
          <div class="header-action-group">
            <span class="counter-badge" :class="{ 'has-values': filledOptionalCount > 0 }">
              {{ filledOptionalCount > 0 ? filledOptionalCount + ' added' : 'Optional' }}
            </span>
            <i class="icofont-rounded-down chevron-icon"></i>
          </div>
        </div>

        <!-- Accordion Body -->
        <div class="collapsible-body" v-show="showOptional">
          
          <!-- SUBSECTION: LIFE & DATES -->
          <div class="sub-section mb-3">
            <div class="sub-section-title text-success">
              <i class="icofont-history mr-1"></i> Origin & Dates
            </div>

            <!-- Multi-Parent Selector -->
            <div class="field-item mb-3" v-if="xtraParent.show">
              <label class="field-label">
                <span>{{ data.gender == 0 ? 'Daughter Of (Parent Link)' : 'Son Of (Parent Link)' }}</span>
              </label>
              <div class="input-control">
                <div class="input-icon"><i class="icofont-users-alt-2"></i></div>
                <div class="vselect-container">
                  <vSelect
                    :options="xtraParent.options"
                    v-model="xtraParent.selected"
                    :placeholder="data.gender == 0 ? 'Select parent link' : 'Select parent link'"
                    class="modern-vselect"
                  ></vSelect>
                </div>
              </div>
            </div>

            <!-- Date of Birth -->
            <div class="field-item mb-3">
              <label class="field-label field-label-mobile-hide">
                <span>Date of Birth</span>
              </label>
              <div class="input-control">
                <div class="input-icon"><i class="icofont-ui-calendar"></i></div>
                <input
                  type="text"
                  inputmode="numeric"
                  class="form-input"
                  :value="dob_input"
                  @input="handleDateInput('dob', $event)"
                  placeholder="Date of Birth (DD/MM/YYYY)"
                  maxlength="10"
                  autocomplete="off"
                />
              </div>
            </div>

            <!-- Life Status Segmented Selector -->
            <div class="field-item mb-3">
              <label class="field-label">
                <span>Life Status</span>
              </label>
              <div class="life-status-selector">
                <button
                  type="button"
                  class="life-pill"
                  :class="{ 'active-living': is_alive }"
                  @click="is_alive = true"
                >
                  <i class="icofont-heart-beat mr-1"></i>
                  <span>Living</span>
                </button>
                <button
                  type="button"
                  class="life-pill"
                  :class="{ 'active-deceased': !is_alive }"
                  @click="is_alive = false"
                >
                  <i class="icofont-candle mr-1"></i>
                  <span>In Memory</span>
                </button>
              </div>
            </div>

            <!-- Date of Demise (Shown if passed away) -->
            <transition name="fade-slide">
              <div class="field-item mb-2" v-show="!is_alive">
                <label class="field-label text-warning font-weight-bold field-label-mobile-hide">
                  <span>Date of Demise</span>
                </label>
                <div class="input-control warning-border">
                  <div class="input-icon warning-icon"><i class="icofont-tombstone"></i></div>
                  <input
                    type="text"
                    inputmode="numeric"
                    class="form-input"
                    :value="died_on_input"
                    @input="handleDateInput('died_on', $event)"
                    placeholder="Date of Demise (DD/MM/YYYY)"
                    maxlength="10"
                    autocomplete="off"
                  />
                </div>
              </div>
            </transition>
          </div>

          <!-- SUBSECTION: CONTACT & LOCATION -->
          <div class="sub-section mb-3">
            <div class="sub-section-title text-warning">
              <i class="icofont-address-book mr-1"></i> Contact & Location
            </div>

            <!-- Mobile Phone -->
            <div class="field-item mb-3">
              <label class="field-label field-label-mobile-hide">
                <span>Mobile Phone</span>
              </label>
              <div class="input-control">
                <div class="input-icon"><i class="icofont-smart-phone"></i></div>
                <input
                  type="tel"
                  inputmode="tel"
                  class="form-input"
                  v-model="data.mobile"
                  placeholder="Mobile / Phone (+91 98765 43210)"
                  autocomplete="off"
                />
              </div>
            </div>

            <!-- Email Address -->
            <div class="field-item mb-3">
              <label class="field-label field-label-mobile-hide">
                <span>Email Address</span>
              </label>
              <div class="input-control">
                <div class="input-icon"><i class="icofont-email"></i></div>
                <input
                  type="email"
                  inputmode="email"
                  class="form-input"
                  v-model="data.email"
                  placeholder="Email Address (name@example.com)"
                  autocomplete="off"
                  spellcheck="false"
                />
              </div>
            </div>

            <!-- Full Address -->
            <div class="field-item mb-3">
              <label class="field-label field-label-mobile-hide">
                <span>Residential Address</span>
              </label>
              <div class="input-control">
                <div class="input-icon"><i class="icofont-location-pin"></i></div>
                <input
                  type="text"
                  class="form-input"
                  v-model="data.address"
                  placeholder="Residential Address (Street, City, State)"
                  autocomplete="off"
                />
              </div>
            </div>

            <!-- Country Dropdown -->
            <div class="field-item mb-3">
              <label class="field-label">
                <span>Country</span>
              </label>
              <div class="input-control">
                <div class="input-icon"><i class="icofont-globe"></i></div>
                <div class="vselect-container">
                  <vSelect
                    :options="countries"
                    placeholder="Select Country"
                    v-model="data.country"
                    class="modern-vselect"
                  ></vSelect>
                </div>
              </div>
            </div>

            <!-- Biography / Description -->
            <div class="field-item mb-2">
              <label class="field-label field-label-mobile-hide">
                <span>Biography / Personal Note</span>
              </label>
              <div class="input-control textarea-control">
                <div class="input-icon top-icon"><i class="icofont-file-document"></i></div>
                <textarea
                  class="form-input form-textarea"
                  rows="3"
                  v-model="data.description"
                  :placeholder="`Biography / Notes about ${data.gender ? (data.gender == 1 ? 'him' : 'her') : 'them'} (profession, memories)...`"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- SUBSECTION: SOCIAL LINKS -->
          <div class="sub-section">
            <div class="sub-section-title text-info">
              <i class="icofont-share-alt mr-1"></i> Social Profiles & Web
            </div>

            <div class="social-input-list">
              <!-- Facebook -->
              <div class="input-control social-control fb mb-2">
                <div class="input-icon icon-fb"><i class="icofont-facebook"></i></div>
                <input
                  type="url"
                  inputmode="url"
                  class="form-input"
                  v-model="data.fb"
                  placeholder="Facebook profile URL"
                  autocomplete="off"
                />
              </div>

              <!-- Instagram -->
              <div class="input-control social-control insta mb-2">
                <div class="input-icon icon-insta"><i class="icofont-instagram"></i></div>
                <input
                  type="url"
                  inputmode="url"
                  class="form-input"
                  v-model="data.insta"
                  placeholder="Instagram profile URL"
                  autocomplete="off"
                />
              </div>

              <!-- Twitter / X -->
              <div class="input-control social-control twitter mb-2">
                <div class="input-icon icon-twitter"><i class="icofont-twitter"></i></div>
                <input
                  type="url"
                  inputmode="url"
                  class="form-input"
                  v-model="data.twitter"
                  placeholder="Twitter / X profile URL"
                  autocomplete="off"
                />
              </div>

              <!-- Website -->
              <div class="input-control social-control site mb-2">
                <div class="input-icon icon-site"><i class="icofont-web"></i></div>
                <input
                  type="url"
                  inputmode="url"
                  class="form-input"
                  v-model="data.site"
                  placeholder="Personal website or blog URL"
                  autocomplete="off"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>

      <!-- Sticky Action Buttons Bar -->
      <div class="form-actions-bar">
        <!-- Error notification -->
        <div v-show="is_error" class="alert alert-danger form-error-alert mb-2">{{ is_error }}</div>

        <div class="actions-buttons-row">
          <button type="button" @click="goBack" class="btn-action-cancel">
            Cancel
          </button>
          <button type="submit" class="btn-action-save" :disabled="isSaveDisabled">
            <span class="spinner-border spinner-border-sm mr-2" v-if="loading"></span>
            <span>{{ payload.memData ? "Save Changes" : "Save Member" }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import vSelect from "vue-select";
import Axios from "axios";
import ProdData from "../data.js";
import Store from "@/store/index";
import Algos from "@/algos/analytics/relation-finder";

export default {
  name: "AddCommonForm",
  components: {
    vSelect,
  },
  props: ["payload"],
  data() {
    return {
      data: {
        gender: "1",
      },
      dob_input: "",
      died_on_input: "",
      type_data: this.payload.type,
      loading: false,
      is_error: false,
      is_alive: true,
      showOptional: true,
      xtraParent: {
        show: false,
        selected: {},
        options: [],
      },
      countries: ProdData.countries,
    };
  },
  computed: {
    filledOptionalCount() {
      let count = 0;
      if (this.dob_input || this.data.dob) count++;
      if (!this.is_alive) count++;
      if (this.died_on_input || this.data.died_on) count++;
      if (this.data.mobile) count++;
      if (this.data.email) count++;
      if (this.data.address) count++;
      if (this.data.country) count++;
      if (this.data.description) count++;
      if (this.data.fb) count++;
      if (this.data.insta) count++;
      if (this.data.twitter) count++;
      if (this.data.site) count++;
      if (this.xtraParent.selected && this.xtraParent.selected.value) count++;
      return count;
    },
    isSaveDisabled() {
      return Boolean(this.loading || !this.data.name || !String(this.data.name).trim());
    },
  },
  watch: {
    is_alive() {
      this.data.is_died = !this.is_alive;
    },
  },
  mounted() {
    this.is_alive = true;
    let isChild = false;
    let parentId;
    let xtra_parent_id;

    // Editing Existing Member
    if (this.payload.memData) {
      this.data = JSON.parse(JSON.stringify(this.payload.memData));
      
      // Ensure gender is defined and reactive
      if (this.data.gender !== undefined && this.data.gender !== null) {
        this.$set(this.data, "gender", String(this.data.gender));
      } else {
        this.$set(this.data, "gender", "1");
      }

      // Convert stored dates to DD/MM/YYYY text input
      if (this.data.dob) {
        this.dob_input = this.toDisplayDate(this.data.dob);
      }
      if (this.data.died_on) {
        this.died_on_input = this.toDisplayDate(this.data.died_on);
      }

      isChild = this.data.is_mate ? false : true;
      parentId = this.data.parent_id;
      xtra_parent_id = this.data.xtra_parent_id;

      if (this.payload.memData.is_died) {
        this.is_alive = false;
        if (this.payload.memData.died_on) {
          this.died_on_input = this.toDisplayDate(this.payload.memData.died_on);
        }
      }
    } else {
      // Adding New Member - default male
      this.$set(this.data, "gender", "1");
      isChild = this.payload.type != "gender" ? true : false;
      parentId = this.payload.parent_id;
      xtra_parent_id = this.payload.xtra_parent_id;
    }

    this.checkMultiParents(parentId, isChild, xtra_parent_id);
  },
  methods: {
    setGender(val) {
      this.$set(this.data, "gender", String(val));
    },
    toDisplayDate(str) {
      if (!str) return "";
      let cleaned = String(str).split("T")[0];
      let parts = cleaned.split("-");
      if (parts.length === 3) {
        let y = parts[0];
        let m = parts[1].padStart(2, "0");
        let d = parts[2].padStart(2, "0");
        return `${d}/${m}/${y}`;
      }
      return str;
    },
    toIsoDate(str) {
      if (!str) return "";
      let parts = str.split("/");
      if (parts.length === 3) {
        let d = parts[0].padStart(2, "0");
        let m = parts[1].padStart(2, "0");
        let y = parts[2];
        return `${y}-${m}-${d}`;
      }
      return str;
    },
    formatDateInput(val, prevVal, isDeleting) {
      if (!val) return "";

      // If user pressed backspace when previous ended with slash, drop the preceding digit too
      if (isDeleting && prevVal && prevVal.endsWith("/") && val === prevVal.slice(0, -1)) {
        val = val.slice(0, -1);
      }

      let digits = val.replace(/\D/g, "").slice(0, 8);
      if (digits.length === 0) return "";

      let day = digits.slice(0, 2);
      let month = digits.slice(2, 4);
      let year = digits.slice(4, 8);

      // Validate day (01-31)
      if (day.length === 2) {
        let dNum = parseInt(day, 10);
        if (dNum > 31) day = "31";
        if (dNum === 0) day = "01";
      }

      // Validate month (01-12)
      if (month.length === 2) {
        let mNum = parseInt(month, 10);
        if (mNum > 12) month = "12";
        if (mNum === 0) month = "01";
      }

      let res = day;
      if (digits.length > 2) {
        res += "/" + month;
      } else if (digits.length === 2 && !isDeleting) {
        res += "/";
      }

      if (digits.length > 4) {
        res += "/" + year;
      } else if (digits.length === 4 && !isDeleting) {
        res += "/";
      }

      return res;
    },
    handleDateInput(field, e) {
      let currentVal = e.target.value;
      let prev = field === "dob" ? (this.dob_input || "") : (this.died_on_input || "");
      let isDeleting =
        (e.inputType && e.inputType.startsWith("delete")) ||
        (prev.length > currentVal.length);

      let formatted = this.formatDateInput(currentVal, prev, isDeleting);
      e.target.value = formatted;

      if (field === "dob") {
        this.dob_input = formatted;
        this.data.dob = this.toIsoDate(formatted);
      } else if (field === "died_on") {
        this.died_on_input = formatted;
        this.data.died_on = this.toIsoDate(formatted);
      }
    },
    checkMultiParents(parentId, isChild, xtra_parent_id) {
      let tree = Algos.getSubTree(Store.getters.getTreeData, parentId);
      if (isChild && tree && tree.mate && tree.mate.length > 1) {
        this.xtraParent.show = true;
        for (let mate of tree.mate) {
          let x = {};
          x.label = mate.name;
          x.value = mate.id;
          this.xtraParent.options.push(x);
          if (xtra_parent_id && xtra_parent_id == mate.id) {
            this.xtraParent.selected = x;
          }
        }
      }
    },
    sendData() {
      if (this.isSaveDisabled) return;
      this.loading = true;
      if (this.dob_input) {
        this.data.dob = this.toIsoDate(this.dob_input);
      }
      if (this.died_on_input) {
        this.data.died_on = this.toIsoDate(this.died_on_input);
      }
      if (this.xtraParent.selected) {
        this.data.xtra_parent_id = this.xtraParent.selected.value;
      }
      if (!this.data.short_name) {
        this.data.short_name = this.data.name;
      }
      if (this.payload.memData) {
        if (this.$route.params.subtree_id) {
          let url = `${ProdData.getHostURL()}/subtree/${
            this.$route.params.id
          }/${this.$route.params.subtree_id}/${this.data._id}`;
          Axios.put(url, this.data)
            .then(() => {
              this.goBack();
            })
            .catch((errr) => console.log(errr));
        } else {
          // Update
          Axios.put(
            ProdData.getHostURL() +
              "/tree/" +
              this.$route.params.id +
              "/person",
            this.data
          )
            .then(() => {
              this.goBack();
            })
            .catch((errr) => console.log(errr));
        }
      } else {
        // ADDING Member
        if (this.payload.type == "gender") {
          this.data.type = 1;
          if (this.payload.gender == "male") {
            this.data.gender = "1";
          } else {
            this.data.gender = "0";
          }
        } else if (this.payload.type == 1) {
          this.data.type = 2;
        } else if (this.payload.type == 0) {
          this.data.type = 0;
        }

        this.data.parent_id = this.payload.parent_id;
        this.$emit("form-submit", this.data);
      }
    },
    goBack() {
      this.$emit("form-cancel");
    },
  },
};
</script>

<style>
/* Main Container - Optimized for high performance and low-end mobile devices */
.member-form-container {
  background: #0f1424;
  border-radius: 20px;
  color: #fff;
  padding: 20px 24px 0 24px;
  box-sizing: border-box;
  width: 100%;
  max-width: 580px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  display: flex;
  flex-direction: column;
  max-height: min(85vh, 760px);
  position: relative;
  overflow: hidden;
}

@media (min-width: 769px) {
  .member-form-container {
    background: rgba(15, 20, 36, 0.96);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  }
}

@media (max-width: 768px) {
  .member-form-container {
    padding: 12px 14px 0 14px;
    border-radius: 0;
    background: transparent;
    max-height: none !important;
    height: auto !important;
    display: block !important;
    overflow: visible !important;
  }

  .form-content {
    display: block !important;
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
    flex: none !important;
  }

  .form-scroll-body {
    display: block !important;
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
    flex: none !important;
    padding-right: 0 !important;
    padding-bottom: 84px !important;
  }

  .field-label-mobile-hide {
    display: none !important;
  }

  .form-card {
    padding: 14px 12px !important;
    margin-bottom: 12px !important;
  }

  .form-actions-bar {
    position: sticky !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 50;
    background: #0f1424 !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.6);
    padding: 12px 14px max(18px, env(safe-area-inset-bottom)) 14px !important;
    margin-left: -14px !important;
    margin-right: -14px !important;
    margin-bottom: 0 !important;
  }
}

/* Header */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

/* Form Content and Scroll Body */
.form-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.form-scroll-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  padding-right: 4px;
  padding-bottom: 12px;
}

.form-scroll-body::-webkit-scrollbar {
  width: 5px;
}
.form-scroll-body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
}
.form-scroll-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.16);
  border-radius: 4px;
}
.form-scroll-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.28);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-avatar-badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.2), rgba(167, 139, 250, 0.2));
  border: 1px solid rgba(79, 142, 247, 0.35);
  color: #60a5fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.header-title-box {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
  letter-spacing: -0.3px;
}

.header-sub {
  font-size: 12.5px;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.header-close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  flex-shrink: 0;
}
.header-close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

/* Form Cards */
.form-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 18px 16px;
  box-sizing: border-box;
}

.card-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #60a5fa;
  margin-bottom: 16px;
}
.card-banner-icon {
  font-size: 16px;
}

/* Fields & Labels */
.field-item {
  display: flex;
  flex-direction: column;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 6px;
}

.required-star {
  color: #f43f5e;
  font-size: 13px;
}

.field-hint {
  font-size: 11px;
  color: #64748b;
  font-weight: 400;
  margin-left: 4px;
}

/* Inputs & Controls */
.input-control {
  display: flex;
  align-items: center;
  background: rgba(10, 14, 26, 0.7);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  min-height: 48px;
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input-control:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.warning-border:focus-within {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.input-icon {
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 18px;
  flex-shrink: 0;
}

.input-control:focus-within .input-icon {
  color: #60a5fa;
}

.warning-icon {
  color: #f59e0b !important;
}

.top-icon {
  align-self: flex-start;
  padding-top: 14px;
}

.form-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 15px;
  padding: 10px 14px 10px 0;
  box-sizing: border-box;
  width: 100%;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.form-textarea {
  resize: vertical;
  min-height: 70px;
  line-height: 1.5;
}

/* Date input styling */
input[type="date"].form-input {
  color-scheme: dark;
  font-family: inherit;
  font-size: 15px;
}

/* Gender Selector Grid */
.gender-selector-grid {
  display: flex;
  gap: 10px;
}

.gender-pill {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(10, 14, 26, 0.7);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.gender-symbol {
  font-size: 18px;
}

.gender-male.selected {
  background: rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
  color: #60a5fa;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.gender-female.selected {
  background: rgba(236, 72, 153, 0.15);
  border-color: #ec4899;
  color: #f472b6;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.25);
}

.check-indicator {
  font-size: 16px;
  margin-left: 2px;
}

/* Collapsible Card */
.collapsible-card {
  padding: 0;
  overflow: hidden;
}

.collapsible-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px;
  cursor: pointer;
  user-select: none;
  background: rgba(255, 255, 255, 0.02);
  transition: background 0.15s ease;
}

.collapsible-header:hover {
  background: rgba(255, 255, 255, 0.04);
}

.header-main-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapsible-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #c084fc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.collapsible-text {
  display: flex;
  flex-direction: column;
}

.collapsible-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #f1f5f9;
}

.collapsible-caption {
  font-size: 11.5px;
  color: #64748b;
  margin-top: 1px;
}

.header-action-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.counter-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
}

.counter-badge.has-values {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.chevron-icon {
  font-size: 16px;
  color: #64748b;
  transition: transform 0.2s ease;
}

.collapsible-card.is-open .chevron-icon {
  transform: rotate(180deg);
  color: #60a5fa;
}

.collapsible-body {
  padding: 16px 16px 18px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.sub-section {
  padding-bottom: 8px;
}

.sub-section:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 18px;
}

.sub-section-title {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 14px;
}

/* Life Status Selector */
.life-status-selector {
  display: flex;
  gap: 10px;
}

.life-pill {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  background: rgba(10, 14, 26, 0.7);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #94a3b8;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.life-pill.active-living {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #34d399;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.life-pill.active-deceased {
  background: rgba(245, 158, 11, 0.15);
  border-color: #f59e0b;
  color: #fbbf24;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
}

/* Social Inputs */
.social-input-list {
  display: flex;
  flex-direction: column;
}

.social-control {
  min-height: 44px;
}

.social-control.fb:focus-within {
  border-color: #1877f2;
  box-shadow: 0 0 0 3px rgba(24, 119, 242, 0.2);
}
.icon-fb { color: #1877f2 !important; }

.social-control.insta:focus-within {
  border-color: #e4405f;
  box-shadow: 0 0 0 3px rgba(228, 64, 95, 0.2);
}
.icon-insta { color: #e4405f !important; }

.social-control.twitter:focus-within {
  border-color: #1da1f2;
  box-shadow: 0 0 0 3px rgba(29, 161, 242, 0.2);
}
.icon-twitter { color: #1da1f2 !important; }

.social-control.site:focus-within {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}
.icon-site { color: #10b981 !important; }

/* VSelect Dark Overrides */
.vselect-container {
  flex: 1;
  padding-right: 10px;
}

.modern-vselect {
  width: 100%;
}

.modern-vselect .vs__dropdown-toggle {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.modern-vselect .vs__search,
.modern-vselect .vs__search:focus,
.modern-vselect .vs__selected {
  color: #fff !important;
  padding: 0 !important;
  margin: 0 !important;
  font-size: 15px;
}

.modern-vselect .vs__actions {
  padding: 0 !important;
}

.modern-vselect .vs__open-indicator {
  fill: #64748b;
}

.modern-vselect .vs__dropdown-menu {
  background: #151b30 !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 12px !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6) !important;
  color: white !important;
  margin-top: 6px !important;
  padding: 6px 0 !important;
  max-height: 240px !important;
}

.modern-vselect .vs__dropdown-option {
  color: #cbd5e1 !important;
  padding: 10px 16px !important;
  font-size: 14px !important;
}

.modern-vselect .vs__dropdown-option--highlight {
  background: rgba(59, 130, 246, 0.2) !important;
  color: #60a5fa !important;
}

/* Actions Bar - Sticky Bottom */
.form-actions-bar {
  flex-shrink: 0;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 25;
  background: rgba(15, 20, 36, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.45);
  padding: 14px 0 max(16px, env(safe-area-inset-bottom)) 0;
  margin-top: auto;
}

.form-error-alert {
  border-radius: 10px;
  font-size: 13px;
  padding: 8px 12px;
  margin-bottom: 10px;
}

.actions-buttons-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.btn-action-cancel,
.btn-action-save {
  flex: 1;
  border-radius: 12px;
  padding: 13px 20px;
  min-height: 48px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action-cancel {
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.btn-action-cancel:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-action-save {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff;
  border: none;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35);
}
.btn-action-save:hover {
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  transform: translateY(-1px);
}
.btn-action-save:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none !important;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter {
  opacity: 0;
  transform: translateY(-6px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
