<template>
  <div>
    <center>
      <!-- <h3>We are working on it. We cant wait to see you</h3>
      <img src="../../assets/working.jpg" width="200px">-->
      <div class="row justify-content-center">
        <vSelect :options="names" v-model="p1" class="col-3"></vSelect>
        <button class="btn btn-success" @click="submit" :disabled="!p1">Search</button>
      </div>
      <img v-if="!selected" src="../../assets/tree_gen.jpg" class="mt-5" height="250px" width="200px" />
      <TreeChart v-else :json="tree" :images="images" style="padding-top:70px" />
    </center>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Store from "../../store/index";
import Algos from "../../algos/analytics/relation-finder";
import TreeChart from "@/components/TreeChart";

export default {
  data() {
    return {
      p1: null,
      tree: {},
      selected: false
    };
  },
  components: {
    TreeChart,
    vSelect
  },
  computed: {
    names: {
      get() {
        return Store.getters.getAllMembers;
      }
    },
    images: {
      get() {
        return Store.getters.images;
      }
    }
  },
  methods: {
    submit() {
      this.selected = true;
      this.tree = Algos.getSubTree(Store.getters.getTreeData, this.p1.value);
    }
  }
};
</script>