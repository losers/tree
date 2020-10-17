<template>
  <div>
    <div class="input_align">
      <vSelect
        :options="names"
        placeholder="Select a Person"
        v-model="p1"
        class="col-sm-10 col-md-3"
      ></vSelect>
      <br v-if="$device.mobile" />
      <center>
        <button class="btn btn-danger" @click="submit" :disabled="!p1">
          Search
        </button>
      </center>
    </div>
    <!-- <center>
      <div
        style="
          height: 300px;
          width: 300px;
          background: #f7f7f7;
          box-shadow: 10px 10px 5px 0px rgb(218 218 218 / 75%);
        "
      >
          <img src="../../assets/1602520786323.png" />
          <img
            src="../../assets/error.jpg"
            style="
              border-radius: 50%;
              height: 100px;
              margin-top: -90px;
              width: 100px;
              box-shadow: 5px 5px 5px 0px rgb(156 156 156 / 75%);
            "
          />
          <p>Varun Kumar Medam</p>
          <div style="background: white; color: red; margin-top: 10px">
            <i class="icofont-heart"></i> Birthday
          </div>
          <p>Turned 25 today</p>
          <button
            class="btn btn-sm mt-3"
            style="border: solid green 1px; background: white; color: green"
          >
            <i class="icofont-share"></i> Whatsapp
          </button>
      </div> -->
      <!-- 
    <div
      style="
        height: 300px;
        width: 300px;
        background: #f7f7f7;
        box-shadow: 10px 10px 5px 0px rgb(218 218 218 / 75%);
      "
    >
      <img
        src="../../assets/event-ballons.png"
        style="float: left; height: 250px; width: 200px"
      />
      <img
        src="../../assets/error.jpg"
        style="
          border-radius: 50%;
          height: 100px;
          width: 100px;
          box-shadow: 5px 5px 5px 0px rgb(156 156 156 / 75%);
        "
      />
      <div style="background: white; color: red; margin-top: 10px">
        <i class="icofont-heart"></i> Birthday
      </div>
    </div>
    <center>
      <img
        v-if="!selected"
        src="../../assets/tree_gen.jpg"
        class="mt-5"
        height="400px"
        width="330px"
        alt="Blood Line Helper"
      /> -->

      <TreeChart :json="tree" :images="images" style="padding-top: 70px" />
    <!-- </center> -->
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