<template>
  <div>
    <section v-if="errored">{{errored}}</section>
    <section v-else>
      <div v-if="loading">loading...</div>
      <div v-else>
        <div v-if="imageExists">
          <img
            :src="previewImage"
            alt="Avatar"
            class="image mx-auto"
            style="border-radius: 50%;width: 150px;"
          />
        </div>
        <div v-else>
          <img
            src="@/assets/profile.png"
            alt="Family Tree Loading"
            class="image mx-auto"
            style="border-radius: 50%;width: 150px;"
          />
        </div>
        {{data}}
        <grid-layout
          :layout.sync="layout"
          :col-num="12"
          :row-height="30"
          :is-draggable="true"
          :is-resizable="true"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[10, 10]"
          :use-css-transforms="true"
        >
          <grid-item
            style="background:black"
            v-for="item in layout"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
          >{{item.i}}</grid-item>
        </grid-layout>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import ProdData from "@/data.js";
import Algos from "@/algos/analytics/relation-finder";
import Store from "@/store/index";
import VueGridLayout from "vue-grid-layout";

var testLayout = [
  { x: 0, y: 0, w: 2, h: 2, i: "0" },
  { x: 2, y: 0, w: 2, h: 4, i: "1" },
  { x: 4, y: 0, w: 2, h: 5, i: "2" },
  { x: 6, y: 0, w: 2, h: 3, i: "3" },
  { x: 8, y: 0, w: 2, h: 3, i: "4" },
  { x: 10, y: 0, w: 2, h: 3, i: "5" }
];
export default {
  methods: {
    getRelation() {

    },
    test() {
      var allIds = [];
      (this.tree = Store.getters.getTreeData),
        Algos.getAllIds(this.tree, allIds);
    }
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data() {
    return {
      data: null,
      errored: false,
      loading: true,
      previewImage: null,
      imageExists: false,
      tree: null,
      layout: testLayout,
      language:"western"
    };
  },
  mounted() {
    this.test();
    //Person Data API
    axios
      .get(
        ProdData.getHostURL() +
          "/tree/" +
          this.$route.params.id +
          "/person/" +
          this.$route.params.member
      )
      .then(data => {
        this.data = data.data;
      })
      .catch(err => {
        this.errored = err;
      })
      .finally(() => {
        this.loading = false;
      });

    //Image data API
    axios
      .get(
        ProdData.getHostURL() +
          "/tree/" +
          this.$route.params.id +
          "/person/" +
          this.$route.params.member +
          "/image"
      )
      .then(data => {
        if (data.data.length != 0) {
          this.previewImage =
            "data:image/png;base64," + data.data[0][this.$route.params.member];
          if (data.data[0][this.$route.params.member] == "undefined") {
            this.imageExists = false;
          } else {
            this.imageExists = true;
          }
        }
      });
  }
};
</script>