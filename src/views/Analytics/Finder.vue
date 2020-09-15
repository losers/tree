<template>
  <div>
    <div class="input_align">
      <span class="mt-1" v-if="!$device.mobile">Person 1 :</span>
      <vSelect
        :options="names"
        v-model="p1"
        :placeholder="$device.mobile?'Person 1':''"
        class="col-sm-10 col-md-3 myselect"
      ></vSelect>
      <span class="mt-1" v-if="!$device.mobile">Person 2 :</span>
      <vSelect
        :options="names"
        v-model="p2"
        :placeholder="$device.mobile?'Person 2':''"
        :class="[{'mb-2':$device.mobile,'mt-2':$device.mobile}]"
        class="col-sm-10 col-md-3"
      ></vSelect>
      <center>
        <button class="btn btn-success" @click="submit" :disabled="!(p1&&p2)">Search</button>
      </center>
    </div>
    <center>
      <img
        v-if="same==null"
        src="@/assets/finder.jpg"
        style="margin-top:70px"
        height="350px"
        alt="Blood Line Helper"
      />
      <div v-else-if="same">
        <img
          src="../../assets/same.jpg"
          height="300px"
          width="200px"
          class="mt-5 pt-5"
          alt="Blood Line Helper"
        />
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
          <br v-if="$device.mobile" />
          <button
            class="ml-3 btn btn-sm btn-primary"
            :class="{'mt-3':$device.mobile}"
            @click="opts=!opts"
          >Change Language</button>
        </p>
        <div v-show="opts">
          <div>
            <input
              type="radio"
              id="western"
              class="mr-2"
              v-model="lang"
              value="western"
              name="lang"
            />
            <label for="western" class="form-check-label">Western</label>
            <input
              type="radio"
              id="telugu"
              class="mr-2 ml-4"
              v-model="lang"
              value="telugu"
              name="lang"
            />
            <label for="telugu" class="form-check-label">Telugu</label>

            <input
              type="radio"
              id="hindi"
              class="mr-2 ml-4"
              v-model="lang"
              value="hindi"
              name="lang"
            />
            <label for="hindi" class="form-check-label">Hindi</label>
          </div>

          <div>
            <input
              type="radio"
              id="kannada"
              class="mr-2 ml-4"
              v-model="lang"
              value="kannada"
              name="lang"
            />
            <label for="kannada" class="form-check-label">Kannada</label>
          </div>
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
      p: {},
      lang_selection: false,
      lang: "western",
      opts: false
    };
  },
  watch: {
    lang() {
      this.rName();
    }
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
              this.tree.response = response;
              this.rName();
            })
            .catch(error => {
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

@media (min-width: 700px) {
  .input_align {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>