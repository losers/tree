<template>
  <div class="FormData glass-card-form">
    <h3 class="mb-3 text-center" style="color: #4f8ef7; font-weight: bold; padding: 20px 16px 4px;">
      {{ payload.memData ? "Edit" : "Add" }} Member
    </h3>

    <form v-on:submit.prevent="sendData">
      <div class="form-fields-wrap">

        <!-- ALWAYS VISIBLE: BASIC INFO -->
        <div class="form-section-card mb-4">
          <div class="input-group-modern mb-3">
            <span class="modern-addon"><i class="icofont-user-alt-3"></i></span>
            <div class="modern-input-wrapper">
              <input type="text" class="modern-input" v-model="data.name"
                @input="autoFillShortName"
                placeholder="Full Name *" required />
            </div>
          </div>

          <div class="input-group-modern mb-3">
            <span class="modern-addon"><i class="icofont-tag"></i></span>
            <div class="modern-input-wrapper">
              <input type="text" class="modern-input" v-model="data.short_name"
                @input="shortNameEdited = true"
                placeholder="Short Name (shown in tree)" />
            </div>
          </div>

          <div v-if="type_data != 'gender'" class="gender-segmented-control mb-3 d-flex align-items-center">
            <label class="modern-label mb-0 mr-3 pl-1" style="min-width: 65px; font-size: 14px; text-transform: capitalize;">Gender <span class="text-warning">*</span></label>
            <div class="segmented-wrapper flex-grow-1">
              <label class="segment-btn" :class="{ 'active': data.gender == '1' }">
                <input type="radio" name="gender" v-model="data.gender" value="1" required class="d-none" />
                <i class="icofont-business-man"></i> Male
              </label>
              <label class="segment-btn" :class="{ 'active-female': data.gender == '0' }">
                <input type="radio" name="gender" v-model="data.gender" value="0" class="d-none" />
                <i class="icofont-girl"></i> Female
              </label>
            </div>
          </div>
        </div>

        <div class="modern-accordion">
          <div class="accordion-item" :class="{ 'is-open': showOptional }">
            <div class="accordion-header" @click="showOptional = !showOptional">
              <div class="header-title"><i class="icofont-list text-info"></i> Optional Fields</div>
              <i class="icofont-rounded-down toggle-icon"></i>
            </div>

            <div class="accordion-body" v-show="showOptional">

              <h6 class="mt-3 mb-3 text-success text-uppercase" style="font-size: 11px; font-weight: bold; letter-spacing: 1px;"><i class="icofont-history"></i> Origin &amp; Dates</h6>

              <div class="input-group-modern mb-3" v-if="xtraParent.show">
                <span class="modern-addon"><i class="icofont-users-alt-2"></i></span>
                <div class="modern-input-wrapper">
                  <vSelect :options="xtraParent.options" v-model="xtraParent.selected" :placeholder="data.gender == 0 ? 'Daughter Of (Select Parent)' : 'Son Of (Select Parent)'" class="modern-vselect"></vSelect>
                </div>
              </div>

              <!-- Smart DD/MM/YYYY date input -->
              <div class="input-group-modern mb-3">
                <span class="modern-addon"><i class="icofont-ui-calendar"></i></span>
                <div class="modern-input-wrapper">
                  <input
                    type="text"
                    class="modern-input"
                    v-model="dobText"
                    @input="onDobInput"
                    placeholder="DD/MM/YYYY"
                    maxlength="10"
                    inputmode="numeric"
                  />
                </div>
              </div>

              <div class="life-status-wrapper mb-3">
                <label class="modern-label d-flex align-items-center mb-0 mr-3">Is Alive?</label>
                <toggle-button v-model="is_alive" :value="is_alive" :sync="true" :width="60" :height="30" :color="{checked: '#2ed573', unchecked: '#ff4757'}" />
              </div>

              <!-- Smart DD/MM/YYYY date input for demise -->
              <div class="input-group-modern mb-4" v-show="!is_alive">
                <span class="modern-addon"><i class="icofont-tombstone"></i></span>
                <div class="modern-input-wrapper">
                  <input
                    type="text"
                    class="modern-input"
                    v-model="dodText"
                    @input="onDodInput"
                    placeholder="DD/MM/YYYY"
                    maxlength="10"
                    inputmode="numeric"
                  />
                </div>
              </div>

              <h6 class="mb-3 text-warning text-uppercase" style="font-size: 11px; font-weight: bold; letter-spacing: 1px;"><i class="icofont-address-book"></i> Contact Details</h6>

              <div class="input-group-modern mb-3">
                <span class="modern-addon"><i class="icofont-smart-phone"></i></span>
                <div class="modern-input-wrapper">
                  <input type="tel" class="modern-input" v-model="data.mobile" placeholder="Mobile Number" />
                </div>
              </div>

              <div class="input-group-modern mb-3">
                <span class="modern-addon"><i class="icofont-email"></i></span>
                <div class="modern-input-wrapper">
                  <input type="email" class="modern-input" v-model="data.email" placeholder="Email Address" />
                </div>
              </div>

              <div class="input-group-modern mb-3">
                <span class="modern-addon"><i class="icofont-location-pin"></i></span>
                <div class="modern-input-wrapper">
                  <input type="text" class="modern-input" v-model="data.address" placeholder="Full Address" />
                </div>
              </div>

              <div class="input-group-modern mb-3">
                <span class="modern-addon"><i class="icofont-globe"></i></span>
                <div class="modern-input-wrapper">
                  <vSelect :options="countries" placeholder="Select Country" v-model="data.country" class="modern-vselect"></vSelect>
                </div>
              </div>

              <div class="input-group-modern mb-4">
                <span class="modern-addon" style="align-items: flex-start; padding-top: 15px;"><i class="icofont-file-document"></i></span>
                <div class="modern-input-wrapper">
                  <textarea class="modern-input" rows="3" v-model="data.description" :placeholder="`Description: What do you think of ${data.gender ? (data.gender == 1 ? 'him' : 'her') : 'him/her'}?`"></textarea>
                </div>
              </div>

              <h6 class="mb-3 text-info text-uppercase" style="font-size: 11px; font-weight: bold; letter-spacing: 1px;"><i class="icofont-share-alt"></i> Social Links</h6>

              <div class="input-group-modern social-input mb-3 fb">
                <span class="modern-addon"><i class="icofont-facebook"></i></span>
                <div class="modern-input-wrapper">
                  <input type="url" class="modern-input" v-model="data.fb" placeholder="Facebook Profile URL" />
                </div>
              </div>

              <div class="input-group-modern social-input mb-3 insta">
                <span class="modern-addon"><i class="icofont-instagram"></i></span>
                <div class="modern-input-wrapper">
                  <input type="url" class="modern-input" v-model="data.insta" placeholder="Instagram Profile URL" />
                </div>
              </div>

              <div class="input-group-modern social-input mb-3 twitter">
                <span class="modern-addon"><i class="icofont-twitter"></i></span>
                <div class="modern-input-wrapper">
                  <input type="url" class="modern-input" v-model="data.twitter" placeholder="Twitter Profile URL" />
                </div>
              </div>

              <div class="input-group-modern social-input mb-2 site">
                <span class="modern-addon"><i class="icofont-web"></i></span>
                <div class="modern-input-wrapper">
                  <input type="url" class="modern-input" v-model="data.site" placeholder="Personal Website URL" />
                </div>
              </div>

            </div>
          </div>
        </div>

        <div v-show="is_error" class="alert alert-danger mt-3">{{ is_error }}</div>
      </div>
      <!-- end .form-fields-wrap -->

      <!-- STICKY action bar — always visible at bottom -->
      <div class="form-action-bar">
        <button type="button" @click="goBack" class="btn modern-btn-cancel">Cancel</button>
        <button type="submit" class="btn modern-btn-submit" :disabled="loading">
          <span class="spinner-border spinner-border-sm mr-2" v-show="loading"></span>
          Save Member
        </button>
      </div>

    </form>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { ToggleButton } from "vue-js-toggle-button";
import Axios from "axios";
import ProdData from "../data.js";
import Store from "@/store/index";
import Algos from "@/algos/analytics/relation-finder";

export default {
  components: {
    ToggleButton,
    vSelect,
  },
  props: ["payload"],
  data() {
    return {
      data: {},
      type_data: this.payload.type,
      loading: false,
      is_error: false,
      is_alive: true,
      showOptional: true,
      shortNameEdited: false,
      dobText: '',
      dodText: '',
      xtraParent: {
        show: false,
        selected: {},
        options: [],
      },
      countries: ProdData.countries,
    };
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

    //Editing
    if (this.payload.memData) {
      this.data = JSON.parse(JSON.stringify(this.payload.memData));

      isChild = this.data.is_mate ? false : true;
      parentId = this.data.parent_id;
      xtra_parent_id = this.data.xtra_parent_id;

      // Convert stored YYYY-MM-DD → display DD/MM/YYYY
      if (this.data.dob) {
        const p = this.data.dob.split('-');
        if (p.length === 3) this.dobText = `${p[2]}/${p[1]}/${p[0]}`;
      }

      if (this.payload.memData.is_died) {
        this.is_alive = false;
        if (this.payload.memData.died_on) {
          this.data.died_on = this.payload.memData.died_on;
          const p = this.data.died_on.split('-');
          if (p.length === 3) this.dodText = `${p[2]}/${p[1]}/${p[0]}`;
        }
      }
    } else {
      //Adding Member
      isChild = this.payload.type != "gender" ? true : false;
      parentId = this.payload.parent_id;
      xtra_parent_id = this.payload.xtra_parent_id;
    }

    this.checkMultiParents(parentId, isChild, xtra_parent_id);
  },
  methods: {
    autoFillShortName() {
      if (this.shortNameEdited) return;
      const first = (this.data.name || '').trim().split(/\s+/)[0] || '';
      this.$set(this.data, 'short_name', first);
    },
    smartDate(raw) {
      const d = raw.replace(/\D/g, '').slice(0, 8);
      if (d.length > 4) return `${d.slice(0,2)}/${d.slice(2,4)}/${d.slice(4)}`;
      if (d.length > 2) return `${d.slice(0,2)}/${d.slice(2)}`;
      return d;
    },
    onDobInput(e) {
      this.dobText = this.smartDate(e.target.value);
    },
    onDodInput(e) {
      this.dodText = this.smartDate(e.target.value);
    },
    dmyToIso(dmy) {
      // "DD/MM/YYYY" → "YYYY-MM-DD" for the API
      const p = dmy.split('/');
      return (p.length === 3 && p[2].length === 4) ? `${p[2]}-${p[1]}-${p[0]}` : dmy;
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
      this.loading = true;
      // Convert DD/MM/YYYY display values → YYYY-MM-DD for API
      if (this.dobText) this.data.dob = this.dmyToIso(this.dobText);
      if (this.dodText) this.data.died_on = this.dmyToIso(this.dodText);
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
          //Update
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
        //ADDING Member
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
/* --- Accordion Form UI --- */
.glass-card-form {
  background: rgba(15, 17, 35, 0.95);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  color: white;
}

.modern-form {
  display: flex;
  flex-direction: column;
}

/* Accordion Styles */
.modern-accordion {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.accordion-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.accordion-item.is-open {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  overflow: visible;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
  transition: background 0.3s ease;
}

.accordion-header:hover {
  background: rgba(255, 255, 255, 0.02);
}

.header-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.toggle-icon {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.4);
  transition: transform 0.3s ease;
}

.accordion-item.is-open .toggle-icon {
  transform: rotate(180deg);
  color: #4f8ef7;
}

.accordion-body {
  padding: 0 20px 20px 20px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Input Styles */
.input-group-modern {
  display: flex;
  background: rgba(15, 17, 35, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: visible;
  transition: all 0.3s ease;
}

.input-group-modern:focus-within {
  border-color: #4f8ef7;
  box-shadow: 0 0 0 3px rgba(79, 142, 247, 0.2);
}

.modern-addon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  border-top-left-radius: 11px;
  border-bottom-left-radius: 11px;
  transition: all 0.3s ease;
}

.input-group-modern:focus-within .modern-addon {
  color: #4f8ef7;
  background: rgba(79, 142, 247, 0.1);
}

.modern-input-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
}

.modern-label {
  font-size: 10px;
  text-transform: uppercase;
  color: #a78bfa;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.modern-input {
  background: transparent;
  border: none;
  color: white;
  font-size: 15px;
  padding: 4px 0;
  outline: none;
  width: 100%;
}

.modern-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* Native Date Input fixes */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.6;
  cursor: pointer;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* Segmented Control */
.segmented-wrapper {
  display: flex;
  background: rgba(15, 17, 35, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  padding: 4px;
  gap: 4px;
}

.segment-btn {
  flex: 1;
  text-align: center;
  padding: 10px;
  margin: 0;
  border-radius: 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 14px;
}

.segment-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.segment-btn.active {
  background: #4f8ef7;
  color: white;
  box-shadow: 0 4px 10px rgba(79, 142, 247, 0.4);
}

.segment-btn.active-female {
  background: #f965ec;
  color: white;
  box-shadow: 0 4px 10px rgba(253, 164, 175, 0.4);
}

/* Specific Social Colors */
.social-input.fb:focus-within .modern-addon { color: #1877F2; background: rgba(24, 119, 242, 0.1); }
.social-input.fb:focus-within { border-color: #1877F2; box-shadow: 0 0 0 3px rgba(24, 119, 242, 0.2); }

.social-input.insta:focus-within .modern-addon { color: #E4405F; background: rgba(228, 64, 95, 0.1); }
.social-input.insta:focus-within { border-color: #E4405F; box-shadow: 0 0 0 3px rgba(228, 64, 95, 0.2); }

.social-input.twitter:focus-within .modern-addon { color: #1DA1F2; background: rgba(29, 161, 242, 0.1); }
.social-input.twitter:focus-within { border-color: #1DA1F2; box-shadow: 0 0 0 3px rgba(29, 161, 242, 0.2); }

.social-input.site:focus-within .modern-addon { color: #00b894; background: rgba(0, 184, 148, 0.1); }
.social-input.site:focus-within { border-color: #00b894; box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.2); }

/* VSelect Overrides */
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
  color: white !important;
  padding: 0 !important;
  margin: 0 !important;
  font-size: 15px;
}
.modern-vselect .vs__actions { padding: 0 !important; }
.modern-vselect .vs__dropdown-menu {
  background: #1a1c2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  color: white;
  margin-top: 5px;
  padding: 5px 0;
}
.modern-vselect .vs__dropdown-option {
  color: rgba(255, 255, 255, 0.8);
  padding: 10px 15px;
}
.modern-vselect .vs__dropdown-option--highlight {
  background: rgba(79, 142, 247, 0.2);
  color: #4f8ef7;
}

.form-fields-wrap {
  padding: 0 16px 8px;
}

.form-action-bar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(8, 9, 20, 0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.modern-btn-cancel, .modern-btn-submit {
  flex: 1;
  border-radius: 12px;
  padding: 14px;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s ease;
}

.modern-btn-cancel {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
  border: 1px solid rgba(255, 71, 87, 0.2);
}
.modern-btn-cancel:hover {
  background: rgba(255, 71, 87, 0.2);
  transform: translateY(-2px);
}

.modern-btn-submit {
  background: linear-gradient(135deg, #4f8ef7, #00a8ff);
  color: white;
  border: none;
  box-shadow: 0 8px 20px rgba(79, 142, 247, 0.3);
}
.modern-btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(79, 142, 247, 0.5);
}

.life-status-wrapper {
  display: flex;
  align-items: center;
  background: rgba(15, 17, 35, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 15px;
}
</style>
