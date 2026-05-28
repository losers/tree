<template>
  <div>
    <div class="glass-card mt-4 p-4" style="position: relative; z-index: 10;">
      <h3 class="mb-4 text-center" style="color: #4f8ef7;">Partial Tree</h3>
      <div class="row align-items-center justify-content-center">
        <div class="col-10 col-md-4 mb-3 mb-md-0">
          <vSelect
            :options="names"
            placeholder="Select your family member..."
            v-model="p1"
            class="dark-vselect"
          ></vSelect>
        </div>
        <div class="col-12 col-md-auto text-center">
          <button class="my-btn" @click="submit" :disabled="!p1">
            <i class="icofont-cut mr-2"></i> Prune Tree
          </button>
        </div>
      </div>
    </div>
    <center>
      <div v-if="!selected" class="mt-5 text-center">
        <img
          src="@/assets/tree_gen.jpg"
          class="mb-4"
          height="300px"
          style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);"
          alt="Bloodline Helper"
        />
        <h4 style="color: #a78bfa;">Waiting to view the partial tree...</h4>
      </div>
      <div v-else style="width: 100%; overflow: auto" class="glass-card mt-5 p-4">
        <TreeChart :json="tree" :images="images" style="padding-top: 70px" />
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

export default {
  data() {
    return {
      p1: null,
      tree: {},
      selected: false,
    };
  },
  components: {
    TreeChart,
    vSelect,
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
      this.selected = true;
      this.tree = Algos.getSubTree(Store.getters.getTreeData, this.p1.value);
    },
  },
};
</script>

<style scoped>
.glass-card {
  background: rgba(15, 17, 35, 0.65);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  color: white;
  margin: 0 20px;
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