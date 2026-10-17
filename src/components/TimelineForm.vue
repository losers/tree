<template>
  <form class="timeline-form-card" v-on:submit.prevent="formEmit(0)">
    <!-- Form Ambient Glow Effect -->
    <div class="form-glow-accent"></div>

    <!-- Header -->
    <div class="form-header-box mb-4">
      <div class="header-icon-pill">
        <i :class="payload.formData.isEdit ? 'icofont-edit-alt' : 'icofont-magic'"></i>
      </div>
      <div>
        <h3 class="form-main-title">
          {{ payload.formData.isEdit ? "Update Event" : "Create Event" }}
        </h3>
        <p class="form-subtitle">
          {{ payload.formData.isEdit ? "Modify this family memory" : "Capture a milestone on the timeline" }}
        </p>
      </div>
    </div>

    <!-- Quick Preset Suggestion Chips (Only on Create) -->
    <div class="preset-chips-section mb-4" v-if="!payload.formData.isEdit">
      <span class="preset-label">Quick Suggestions</span>
      <div class="chips-container">
        <button
          type="button"
          v-for="chip in presetChips"
          :key="chip.title"
          class="preset-chip"
          @click="applyPreset(chip)"
        >
          <span class="chip-emoji">{{ chip.emoji }}</span>
          <span>{{ chip.title }}</span>
        </button>
      </div>
    </div>

    <!-- Field 1: Date -->
    <div class="form-group-item mb-3">
      <label class="form-item-label">
        <i class="icofont-ui-calendar text-primary mr-1"></i>
        <span>Event Date</span>
        <span class="required-star">*</span>
      </label>
      <div class="modern-input-box">
        <input
          type="text"
          inputmode="numeric"
          class="form-native-input"
          placeholder="DD/MM/YYYY"
          maxlength="10"
          :value="date_input"
          @input="handleDateInput"
          required
          autocomplete="off"
        />
      </div>
    </div>

    <!-- Field 2: Title -->
    <div class="form-group-item mb-3">
      <label class="form-item-label">
        <i class="icofont-tag text-info mr-1"></i>
        <span>Event Title</span>
        <span class="required-star">*</span>
      </label>
      <div class="modern-input-box">
        <input
          type="text"
          class="form-native-input"
          placeholder="e.g., 50th Golden Jubilee, Graduated..."
          v-model="payload.formData.title"
          required
          autocomplete="off"
        />
      </div>
    </div>

    <!-- Field 3: Description -->
    <div class="form-group-item mb-3">
      <label class="form-item-label">
        <i class="icofont-file-document text-warning mr-1"></i>
        <span>Event Story & Description</span>
        <span class="required-star">*</span>
      </label>
      <div class="modern-input-box textarea-box">
        <textarea
          class="form-native-input form-native-textarea"
          rows="3"
          maxlength="1000"
          v-model="payload.formData.content"
          required
          placeholder="Tell the story, memories, who attended, and memorable moments..."
        ></textarea>
      </div>
    </div>

    <!-- Field 4: Share with Selector -->
    <div class="form-group-item mb-4">
      <label class="form-item-label">
        <i class="icofont-users-alt-4 text-success mr-1"></i>
        <span>Share with Family Members</span>
        <span class="optional-hint">(Also appears on their timelines)</span>
      </label>
      <div class="modern-input-box vselect-box">
        <v-select
          class="timeline-vselect"
          multiple
          placeholder="Select family members to tag..."
          :options="payload.names"
          v-model="payload.formData.shared_with"
        ></v-select>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="form-actions-row">
      <!-- Create / Update -->
      <button
        type="submit"
        class="btn-event-submit"
        :disabled="payload.loading.change"
      >
        <span
          class="spinner-border spinner-border-sm mr-2"
          v-show="payload.loading.change"
        ></span>
        <i :class="payload.formData.isEdit ? 'icofont-check-circled' : 'icofont-plus-circle'" v-show="!payload.loading.change" class="mr-1"></i>
        {{ payload.formData.isEdit ? "Update Event" : "Create Event" }}
      </button>

      <!-- Cancel -->
      <button
        type="button"
        class="btn-event-cancel"
        @click="formEmit(1)"
      >
        Cancel
      </button>

      <!-- Delete Button (Only on Edit) -->
      <button
        type="button"
        @click="formEmit(2)"
        v-if="payload.formData.isEdit"
        :disabled="payload.loading.delete"
        class="btn-event-delete"
        title="Permanently remove event"
      >
        <span
          class="spinner-border spinner-border-sm mr-1"
          v-show="payload.loading.delete"
        ></span>
        <i class="icofont-ui-delete" v-show="!payload.loading.delete"></i>
        Delete
      </button>
    </div>
  </form>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  name: "TimelineForm",
  props: ["payload"],
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      date_input: "",
      presetChips: [
        { emoji: "🎂", title: "Birthday Celebration", desc: "Celebrated another blessed year with family!" },
        { emoji: "💍", title: "Wedding Anniversary", desc: "Celebrating love, togetherness, and beautiful years of marriage." },
        { emoji: "🎓", title: "Graduation", desc: "Proud milestone achieving graduation and academic success!" },
        { emoji: "🏡", title: "New Home", desc: "Housewarming celebration and new family beginnings." },
        { emoji: "✈️", title: "Family Vacation", desc: "Memorable holiday trip together creating lifelong memories." },
        { emoji: "👶", title: "Newborn Arrival", desc: "Welcomed our newest beloved family blessing into the world!" }
      ]
    };
  },
  mounted() {
    if (this.payload && this.payload.formData && this.payload.formData.date) {
      this.date_input = this.toDisplayDate(this.payload.formData.date);
    }
  },
  watch: {
    "payload.formData.date"(newVal) {
      if (newVal) {
        let display = this.toDisplayDate(newVal);
        if (this.toIsoDate(this.date_input) !== newVal) {
          this.date_input = display;
        }
      } else {
        this.date_input = "";
      }
    }
  },
  methods: {
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
      if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
        let d = parts[0];
        let m = parts[1];
        let y = parts[2];
        return `${y}-${m}-${d}`;
      }
      return "";
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
    handleDateInput(e) {
      let currentVal = e.target.value;
      let prev = this.date_input || "";
      let isDeleting =
        (e.inputType && e.inputType.startsWith("delete")) ||
        (prev.length > currentVal.length);

      let formatted = this.formatDateInput(currentVal, prev, isDeleting);
      e.target.value = formatted;
      this.date_input = formatted;

      let iso = this.toIsoDate(formatted);
      if (iso) {
        this.$set(this.payload.formData, "date", iso);
      } else {
        this.$set(this.payload.formData, "date", "");
      }
    },
    formEmit(type) {
      if (type === 0 && this.date_input) {
        let iso = this.toIsoDate(this.date_input);
        if (iso) {
          this.$set(this.payload.formData, "date", iso);
        }
      }
      this.$emit("crudops", type);
    },
    applyPreset(chip) {
      this.$set(this.payload.formData, "title", chip.title);
      if (!this.payload.formData.content) {
        this.$set(this.payload.formData, "content", chip.desc);
      }
    }
  }
};
</script>

<style>
/* Main Form Card */
.timeline-form-card {
  position: relative;
  background: rgba(15, 20, 36, 0.94);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 28px 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  color: #fff;
  overflow: hidden;
  transition: all 0.3s ease;
  text-align: left !important;
}

/* Ambient Accent Glow */
.form-glow-accent {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(79, 142, 247, 0.3), rgba(167, 139, 250, 0.1), transparent 70%);
  filter: blur(20px);
  pointer-events: none;
}

/* Header */
.form-header-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  gap: 14px;
}

.form-header-box > div {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.header-icon-pill {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.25), rgba(167, 139, 250, 0.25));
  border: 1px solid rgba(79, 142, 247, 0.4);
  color: #60a5fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(79, 142, 247, 0.2);
}

.form-main-title {
  font-size: 22px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.3px;
  margin: 0;
  text-align: left;
}

.form-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 3px 0 0 0;
  text-align: left;
}

/* Quick Suggestion Chips */
.preset-chips-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 8px;
}

.preset-label {
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: #a78bfa;
  text-align: left;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 6px;
}

.preset-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.preset-chip:hover {
  background: rgba(79, 142, 247, 0.15);
  border-color: rgba(79, 142, 247, 0.4);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 142, 247, 0.2);
}

.chip-emoji {
  font-size: 14px;
}

/* Form Items & Inputs */
.form-group-item {
  display: flex;
  flex-direction: column;
}

.form-item-label {
  display: flex;
  align-items: center;
  font-size: 12.5px;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 6px;
}

.required-star {
  color: #f43f5e;
  margin-left: 4px;
}

.optional-hint {
  font-size: 11px;
  color: #64748b;
  font-weight: 400;
  margin-left: 6px;
}

.modern-input-box {
  background: rgba(10, 14, 26, 0.7);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 4px 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.modern-input-box:focus-within {
  border-color: #4f8ef7;
  box-shadow: 0 0 0 3px rgba(79, 142, 247, 0.25);
}

.form-native-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14.5px;
  padding: 8px 0;
}

.form-native-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.date-native {
  color-scheme: dark;
  font-family: inherit;
}

.textarea-box {
  padding: 10px 14px;
}

.form-native-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

/* VSelect Dark Theme */
.vselect-box {
  padding: 4px 8px;
}

.timeline-vselect .vs__dropdown-toggle {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.timeline-vselect .vs__search,
.timeline-vselect .vs__search:focus {
  color: #fff !important;
  font-size: 14px;
  margin: 4px 0 !important;
}

.timeline-vselect .vs__selected {
  background: linear-gradient(135deg, rgba(79, 142, 247, 0.3), rgba(167, 139, 250, 0.3)) !important;
  border: 1px solid rgba(167, 139, 250, 0.4) !important;
  border-radius: 99px !important;
  color: #fff !important;
  font-size: 12.5px !important;
  padding: 3px 10px !important;
}

.timeline-vselect .vs__deselect {
  fill: #fff !important;
  margin-left: 4px !important;
}

.timeline-vselect .vs__open-indicator {
  fill: #64748b !important;
}

.timeline-vselect .vs__dropdown-menu {
  background: #141a2e !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 14px !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6) !important;
  color: #fff !important;
  margin-top: 6px !important;
  padding: 6px 0 !important;
  max-height: 220px !important;
}

.timeline-vselect .vs__dropdown-option {
  color: #cbd5e1 !important;
  padding: 10px 16px !important;
  font-size: 13.5px !important;
}

.timeline-vselect .vs__dropdown-option--highlight {
  background: rgba(79, 142, 247, 0.2) !important;
  color: #60a5fa !important;
}

/* Actions Row */
.form-actions-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-event-submit,
.btn-event-cancel,
.btn-event-delete {
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-event-submit {
  flex: 2;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  color: #fff;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
}
.btn-event-submit:hover {
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.6);
  transform: translateY(-2px);
}
.btn-event-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.btn-event-cancel {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}
.btn-event-cancel:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.btn-event-delete {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}
.btn-event-delete:hover {
  background: rgba(239, 68, 68, 0.25);
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
}
</style>