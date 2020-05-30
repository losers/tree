<template>
  <div>
    <div class="row justify-content-center">
      <span class="mt-1">Person 1 :</span>
      <vSelect :options="names" v-model="p1" class="col-3 myselect"></vSelect>
      <span class="mt-1">Person 2 :</span>
      <vSelect :options="names" v-model="p2" class="col-3"></vSelect>
      <button class="btn btn-success" @click="submit" :disabled="!(p1&&p2)">Search</button>
    </div>
    <center>
      <img v-if="same==null" src="@/assets/finder.jpg" style="margin-top:70px" height="350px" />
      <div v-else-if="same">
        <img src="../../assets/same.jpg" height="300px" width="200px" class="mt-5 pt-5" />
        <h3 style="margin-top: 60px">L.H.S = R.H.S</h3>
        <h6>Hence Proved</h6>
      </div>
      <div v-else class="mt-4">
        <p>
          {{p.p2.label}} is {{p.p1.label}}'s
          <span
            class="ml-3 spinner-border spinner-border-sm"
            v-if="loading"
          ></span>
          <span v-else class="ml-1 relationName">{{relationName}}</span>
          <button class="ml-3 btn btn-sm btn-primary">Change Language</button>
        </p>
        <div>
          <input type="radio" />Western
        </div>
        <TreeChart :json="tree" :images="images" style="padding-top:40px" />
      </div>
    </center>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Store from "../../store/index";
import Algos from "../../algos/analytics/relation-finder";
import TreeChart from "@/components/TreeChart";
import axios from "axios";
import ProData from "../../data";

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
      p: {}
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
            .then(response => {
              this.loading = false;
              this.relationName = Algos.findRelationName(
                this.tree,
                response.data,
                this.p1.value,
                this.p2.value,
                "telugu"
              );
              console.log(this.relationName);
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => {});
        }
      }
    }
  },
  components: {
    vSelect,
    TreeChart
  }
};
</script>

<style scoped>
.relationName {
  font-weight: bold;
  font-size: 20px;
}
/* .myselect{
  max-height: 10px;
} */
</style>