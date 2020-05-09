<template>
  <div>
    <div class="row">
      <vSelect :options="names" v-model="p1" class="col-3"></vSelect>
      <vSelect :options="names" v-model="p2" class="col-3"></vSelect>
      <button class="btn btn-success" @click="submit">Search</button>
    </div>
    <center>
        <TreeChart
          :json="tree"
          :images="images"
          style="padding-top:70px"
        />
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
      tree : {}
    };
  },
  computed:{
    names : {
      get(){
        return Store.getters.getAllMembers
      }
    },
    images : {
      get(){
        return Store.getters.images;
      }
    }
  },
  methods: {
    submit() {
      this.tree = Algos.getRelationTree(Store.getters.getTreeData, this.p1.value, this.p2.value);
    }
  },
  components: {
    vSelect, TreeChart
  }
};
</script>