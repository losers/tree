<template>
  <div>
    <div class="input_align">
      <vSelect
        :options="names"
        :placeholder="$t('select_person')"
        v-model="p1"
        class="col-sm-10 col-md-3"
      ></vSelect>
      <br v-if="$device.mobile" />
      <center>
        <button class="btn btn-danger" @click="submit" :disabled="!p1">
          {{ $t("search") }}
        </button>
      </center>
    </div>
    <center>
      <img
        v-if="!selected"
        src="@/assets/tree_gen.jpg"
        class="mt-5"
        height="300px"
        alt="Bloodline Helper"
      />
      <div style="width: 100%; overflow: auto">
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
@media (min-width: 700px) {
  .input_align {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>