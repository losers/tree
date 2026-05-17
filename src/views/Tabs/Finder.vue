<template>
  <div>
    <div class="glass-card mt-4 p-4" style="position: relative; z-index: 10;">
      <h3 class="mb-4 text-center" style="color: #4f8ef7;">Relation Finder</h3>
      <div class="row align-items-center justify-content-center">
        <div class="col-md-auto text-md-right mb-2 mb-md-0" v-if="!$device.mobile">
          <span style="color: #a78bfa; font-weight: 600;">Person 1 :</span>
        </div>
        <div class="col-10 col-md-3 mb-3 mb-md-0">
          <vSelect
            :options="names"
            v-model="p1"
            :placeholder="$device.mobile ? 'Select Person 1' : ''"
            class="dark-vselect"
          ></vSelect>
        </div>
        
        <div class="col-md-auto text-md-right mb-2 mb-md-0" v-if="!$device.mobile">
          <span style="color: #a78bfa; font-weight: 600;">Person 2 :</span>
        </div>
        <div class="col-10 col-md-3 mb-3 mb-md-0">
          <vSelect
            :options="names"
            v-model="p2"
            :placeholder="$device.mobile ? 'Select Person 2' : ''"
            class="dark-vselect"
          ></vSelect>
        </div>
        
        <div class="col-12 col-md-auto mt-3 mt-md-0 text-center">
          <button class="my-btn" @click="submit" :disabled="!(p1 && p2)">
            <i class="icofont-search-2 mr-2"></i> Find Relation
          </button>
        </div>
      </div>
    </div>
    
    <center class="mt-5">
      <img
        v-if="same == null"
        src="@/assets/finder.jpg"
        style="margin-top: 70px"
        height="250px"
        alt="Bloodline Helper"
      />
      <div v-else-if="same">
        <img
          src="@/assets/same.jpg"
          height="300px"
          style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);"
          class="mt-4"
          alt="Bloodline Helper"
        />
        <h3 class="mt-4" style="color: #ff4757;">L.H.S = R.H.S</h3>
        <h5 style="color: #a78bfa;">Congratulations, you found yourself! Time to buy a mirror.</h5>
      </div>
      <div v-else class="mt-4 glass-card p-4">
        <p>
          {{ p.p2.label }} is {{ p.p1.label }}'s
          <span
            v-if="loading"
            class="ml-3"
            style="color: #4f8ef7; font-style: italic;"
          >
            <span class="spinner-border spinner-border-sm mr-2"></span>
            Consulting the Ancestor Spirits... calculating DNA overlaps...
          </span>
          <span v-else class="ml-1 relationName" style="color: #a78bfa;">{{ relationName }}</span>
          <br v-if="$device.mobile" />
          <button
            class="ml-3 btn btn-sm my-btn-outline"
            :class="{ 'mt-3': $device.mobile }"
            @click="opts = !opts"
          >
            <i class="icofont-globe mr-1"></i> Change Language
          </button>
        </p>
        <div v-show="opts" class="lang-pills mt-3">
          <label class="lang-pill">
            <input type="radio" v-model="lang" value="western" name="lang" />
            <span>Western</span>
          </label>
          <label class="lang-pill">
            <input type="radio" v-model="lang" value="telugu" name="lang" />
            <span>Telugu</span>
          </label>
          <label class="lang-pill">
            <input type="radio" v-model="lang" value="hindi" name="lang" />
            <span>Hindi</span>
          </label>
          <label class="lang-pill">
            <input type="radio" v-model="lang" value="tamil" name="lang" />
            <span>Tamil</span>
          </label>
          <label class="lang-pill">
            <input type="radio" v-model="lang" value="kannada" name="lang" />
            <span>Kannada</span>
          </label>
        </div>
        <div style="width: 100%; overflow: auto">
          <TreeChart :json="tree" :images="images" style="padding-top: 40px" />
        </div>
      </div>
    </center>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Store from "@/store/index";
import Algos from "@/algos/analytics/relation-finder";
import TreeChart from "@/components/TreeChart";
import axios from "axios";
import ProData from "@/data";

export default {
  data() {
    return {
      p1: null,
      p2: null,
      tree: {},
      same: null,
      disable: false,
      relationName: null,
      loading: true,
      p: {},
      lang_selection: false,
      lang: "western",
      opts: false,
    };
  },
  watch: {
    lang() {
      this.rName();
    },
  },
  computed: {
    names: {
      get() {
        return Store.getters.getAllMembers;
      },
    },
    images: {
      get() {
        return Store.getters.images;
      },
    },
  },
  methods: {
    submit() {
      if (this.p.p1 != this.p1 || this.p.p2 != this.p2) {
        if (!(this.p1 && this.p2)) {
          this.same = null;
        } else if (this.p1.value == this.p2.value) {
          this.same = true;
        } else {
          this.loading = true;
          this.same = false;
          this.p.p1 = this.p1;
          this.p.p2 = this.p2;
          this.tree = Algos.getRelationTree(
            Store.getters.getTreeData,
            this.p1.value,
            this.p2.value
          );
          this.allIds = [];
          Algos.getAllIds(this.tree, this.allIds);
          axios
            .post(
              ProData.getHostURL() + "/analytics/" + this.$route.params.id,
              this.allIds
            )
            .then((response) => {
              this.loading = false;
              this.tree.response = response;
              console.log(this.tree.response);
              this.rName();
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {});
        }
      }
    },
    rName() {
      this.relationName = Algos.findRelationName(
        this.tree, //Entire tree data
        this.tree.response.data, //gender with ids
        this.p1.value,
        this.p2.value,
        this.lang
      );
      console.log(this.relationName);
    },
  },
  components: {
    vSelect,
    TreeChart,
  },
};
</script>

<style scoped>
.relationName {
  font-weight: bold;
  font-size: 24px;
}
.glass-card {
  background: rgba(15, 17, 35, 0.65);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  color: white;
  margin: 0 20px;
}
p {
  font-size: 18px;
}
.my-btn {
  background: linear-gradient(135deg, #4f8ef7, #a78bfa) !important;
  border: none !important;
  padding: 10px 24px !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -4px 0 rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  color: #fff !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
}
.my-btn:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.05) !important;
  box-shadow: 0 16px 40px rgba(79, 142, 247, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -4px 0 rgba(0, 0, 0, 0.25) !important;
}
.my-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.my-btn-outline {
  background: transparent !important;
  border: 1px solid #4f8ef7 !important;
  padding: 6px 16px !important;
  border-radius: 8px !important;
  color: #4f8ef7 !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}
.my-btn-outline:hover {
  background: rgba(79, 142, 247, 0.1) !important;
  box-shadow: 0 0 15px rgba(79, 142, 247, 0.3) !important;
}
.lang-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 15px;
}
.lang-pill {
  margin: 0 8px 10px 8px;
}
.lang-pill input {
  display: none !important;
}
.lang-pill span {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255,255,255,0.6);
}
.lang-pill input:checked + span {
  background: rgba(167, 139, 250, 0.2);
  border-color: #a78bfa;
  color: #a78bfa;
  box-shadow: 0 0 15px rgba(167, 139, 250, 0.4);
}
</style>

<style>
/* Dark theme for vue-select, made unscoped to ensure it overrides vue-select's internal styles */
.dark-vselect .vs__dropdown-toggle {
  background: rgba(15, 17, 35, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  padding: 4px;
}
.dark-vselect .vs__selected {
  color: white !important;
}
.dark-vselect .vs__search::placeholder {
  color: rgba(255,255,255,0.4) !important;
}
.dark-vselect .vs__dropdown-menu {
  background: #0f1123 !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
}
.dark-vselect .vs__dropdown-option {
  color: rgba(255,255,255,0.8) !important;
}
.dark-vselect .vs__dropdown-option--highlight {
  background: #4f8ef7 !important;
  color: white !important;
}
.dark-vselect .vs__clear,
.dark-vselect .vs__open-indicator {
  fill: rgba(255,255,255,0.5) !important;
}
</style>