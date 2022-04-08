<template>
  <div>
    <!-- <div
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px;
      "
    >
      <strong class="header-bg">
        Relation Finder <i class="icofont-ui-love-add"></i
      ></strong>
    </div> -->
    <div class="input_align">
      <span class="mt-1" v-if="!$device.mobile">{{ $t("person") }} 1 :</span>
      <vSelect
        :options="names"
        v-model="p1"
        :placeholder="
          $device.mobile ? $t('person') + ' 1' : $t('select_person')
        "
        class="col-sm-10 col-md-3 myselect"
      ></vSelect>
      <span class="mt-1" v-if="!$device.mobile">{{ $t("person") }} 2 :</span>
      <vSelect
        :options="names"
        v-model="p2"
        :placeholder="
          $device.mobile ? $t('person') + ' 2' : $t('select_person')
        "
        :class="[{ 'mb-2': $device.mobile, 'mt-2': $device.mobile }]"
        class="col-sm-10 col-md-3"
      ></vSelect>
      <center>
        <button class="btn btn-danger" @click="submit" :disabled="!(p1 && p2)">
          {{ $t("search") }}
        </button>
      </center>
    </div>
    <center>
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
          width="200px"
          class="mt-5 pt-5"
          alt="Bloodline Helper"
        />
        <h3 style="margin-top: 60px">L.H.S = R.H.S</h3>
        <h6>Hence Proved</h6>
      </div>
      <div v-else class="mt-4">
        <p>
          {{ p.p2.label }} is {{ p.p1.label }}'s
          <span
            class="ml-3 spinner-border spinner-border-sm"
            style="color: red"
            v-if="loading"
          ></span>
          <span v-else class="ml-1 relationName">{{ relationName }}</span>
          <br v-if="$device.mobile" />
          <button
            class="ml-3 btn btn-sm"
            style="border: solid 1px red; color: red"
            :class="{ 'mt-3': $device.mobile }"
            @click="opts = !opts"
          >
            {{ $t("change_language") }}
          </button>
        </p>
        <div v-show="opts" style="padding: 10px">
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
          <input
            type="radio"
            id="tamil"
            class="mr-2 ml-4"
            v-model="lang"
            value="tamil"
            name="lang"
          />
          <label for="tamil" class="form-check-label">Tamil</label>
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
  font-size: 20px;
}
.header-bg {
  color: white;
  background-color: indianred;
  padding: 15px 50px;
  box-shadow: 2px 2px 5px 0px rgba(255, 168, 168, 1);
  border-radius: 10px;
}
@media (min-width: 700px) {
  .input_align {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>