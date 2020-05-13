<template>
  <div>
    <div class="row justify-content-center">
      <span class="mt-1">Person 1 :</span>
      <vSelect :options="names" v-model="p1" class="col-3"></vSelect>
      <span class="mt-1">Person 2 :</span>
      <vSelect :options="names" v-model="p2" class="col-3"></vSelect>
      <button class="btn btn-success" @click="submit" :disabled="!(p1&&p2)">Search</button>
    </div>
    <center>
      <img v-if="same==null" src="@/assets/finder.jpg" style="margin-top:60px" height="250px" width="250px" />
      <div v-else-if="same">
        <img src="../../assets/same.jpg" height="300px" width="200px" class="mt-5 pt-5" />
        <h3 style="margin-top: 60px">L.H.S = R.H.S</h3>
        <h6>Hence Proved</h6>
      </div>
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
      p2: null,
      tree: {},
      same: null,
      disable: false
    };
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
      if (!(this.p1 && this.p2)) {
        this.same = null;
      } else if (this.p1.value == this.p2.value) {
        this.same = true;
      } else {
        this.same = false;
        this.tree = Algos.getRelationTree(
          Store.getters.getTreeData,
          this.p1.value,
          this.p2.value
        );
      }
      // this.p1 = null;
      // this.p2 = null;
    }
  },
  components: {
    vSelect,
    TreeChart
  }
};
</script>