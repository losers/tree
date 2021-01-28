<template>
  <center>
    <div class="mx-auto col-12" v-if="hasCookie && !viewOnly">
      <button
        @click="addMember(0)"
        class="col-10 btn btn-warning mb-3"
        v-show="!data.parent_id || (data.is_mate && !data.linked_tree)"
      >
        + Add Parent
      </button>

      <button @click="addMember(1)" class="col-10 btn btn-success mb-3">
        + Add Child
      </button>

      <button
        @click="goToSubTree()"
        class="col-10 btn btn-warning mb-3"
        v-show="data.linked_tree"
        style="background-color: #0083a0; color: white"
      >
        <i class="icofont-tree p2" style="font-size: 15px"></i>
        View Parent Tree
      </button>

      <button
        v-show="!data.is_mate"
        @click="addMember('gender')"
        class="col-10 btn btn-primary mb-3"
      >
        + Add {{ data.gender == "1" ? "Wife" : "Husband" }}
      </button>

      <button
        @click="reArrange"
        v-if="!data.is_mate && data.parent_id"
        class="col-10 btn mb-3"
        style="color: white; background-color: #e0a600"
      >
        <i class="icofont-exchange"></i> Swap Siblings
      </button>

      <button @click="deleteSwipe" class="btn btn-danger col-10 mb-3">
        <i class="icofont-ui-delete"></i> Delete
      </button>
    </div>
    <div v-else>
      <span class="col-4">
        <input
          class="form-control input-sm"
          placeholder="Enter Admin Key to Edit"
          v-model="key"
          onkeypress="if(this.value.length==4) return false;"
          type="number"
        />
        <button
          v-show="key.length == 4"
          @click="validate"
          class="btn mt-3"
          :class="{ 'btn-success': !retry, 'btn-warning': retry }"
          :disabled="vloading"
        >
          <span
            class="spinner-border spinner-border-sm"
            v-show="vloading"
          ></span>
          {{ retry ? "Retry" : "Validate" }}
        </button>
      </span>
    </div>
  </center>
</template>

<script>
import axios from "axios";
import Store from "@/store/index";
import ProdData from "@/data.js";

export default {
  data() {
    return {
      vloading: false,
      loading: false,
      key: "",
      retry: false,
      hasCookie: this.cookeyStatus,
    };
  },
  props: ["cookeyStatus", "data", "hasMate", "viewOnly"],
  methods: {
    goToSubTree() {
      this.$router.push({
        name: "Subtrees",
        params: { subtree_id: this.data.linked_tree },
      });
    },
    addMember(num) {
      this.$emit("actionsAddMember", num);
    },
    deleteSwipe() {
      this.$emit("actionsDeleteSwipe");
    },
    reArrange() {
      this.$emit("actionsReArrange");
    },
    validate() {
      this.vloading = true;
      let sessionUrl = ProdData.getHostURL() + "/sessions/";
      let params = {};
      params.pin = this.key;
      params.surname = this.$route.params.id;
      axios
        .post(sessionUrl, params)
        .then((data) => {
          data = data.data;
          console.log(data);
          this.hasCookie = true;
          this.vloading = false;
          let sessData = {};
          sessData.status = true;
          sessData.surname = params.surname;
          if (data.view_only) {
            this.retry = true;
            sessData.view_only = true;
          } else {
            sessData.view_only = false;
          }
          Store.commit("setSession", sessData);
          this.$emit("keyTrue");
        })
        .catch(() => {
          this.retry = true;
        })
        .finally(() => {
          this.vloading = false;
        });
    },
  },
};
</script>