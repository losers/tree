<template>
  <center>
    <div class="col-10 mt-5">
      <h3>Swap Siblings</h3>
      <draggable
        class="list-group mt-3"
        tag="ul"
        v-model="list"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <li
            class="list-group-item"
            v-for="element in list"
            :key="element.order"
          >
            {{ element.name }}
          </li>
        </transition-group>
      </draggable>
      <div class="row justify-content-between mt-5 mb-3">
        <button
          class="btn btn-success"
          v-on:click="finalList"
          :disabled="loading"
        >
          <span
            class="spinner-border spinner-border-sm"
            v-show="loading"
          ></span>
          Submit
        </button>
        <button @click="close" class="btn btn-danger" type="button">
          Cancel
        </button>
      </div>
    </div>
  </center>
</template>

<script>
import draggable from "vuedraggable";
import Algos from "@/algos/analytics/relation-finder";
import Store from "@/store/index";
import Axios from "axios";
import ProdData from "../data.js";

export default {
  components: {
    draggable,
  },
  props: ["payload"],
  mounted() {
    let allSiblings;
    if (this.$route.params.subtree_id) {
      allSiblings = Algos.getAllSibligs(
        Store.state.subtree,
        this.$route.params.member,
        Store.state.subtree
      );
    } else {
      allSiblings = Algos.getAllSibligs(
        Store.state.tree,
        this.$route.params.member,
        Store.state.tree
      );
    }
    for (let i = 0; i < allSiblings.length; i++) {
      this.list.push({
        name: allSiblings[i],
        order: i + 1,
      });
    }
  },
  data() {
    return {
      list: [],
      drag: false,
      loading: false,
    };
  },
  methods: {
    finalList() {
      let isChanged = false;
      this.loading = true;
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].order != i + 1) {
          isChanged = true;
          break;
        }
      }
      if (isChanged) {
        let payload = {};
        payload.id = this.$route.params.member;
        payload.order = [];

        for (let i = 0; i < this.list.length; i++) {
          payload.order.push(this.list[i].order - 1);
        }

        let url;
        if (this.$route.params.subtree_id) {
          url = `${ProdData.getHostURL()}/subtree/${this.$route.params.id}/${
            this.$route.params.subtree_id
          }/person/swap`;
        } else {
          url = `${ProdData.getHostURL()}/tree/${
            this.$route.params.id
          }/person/swap`;
        }

        Axios.put(url, payload)
          .then((data) => {
            if (!this.$route.params.subtree_id) {
              this.$emit("close");
              this.$router.push({
                name: "MainTree",
              });
              Store.dispatch("treeOnlySetup", data.data).then();
            } else {
              this.$emit("close");
              this.$router.push({
                name: "Subtrees",
                params: { subtree_id: this.$route.params.subtree_id },
              });
              let payload = {};
              payload.tree = data.data;
              Store.dispatch("setSubtree", payload).then();
            }
          })
          .catch((errr) => console.log(errr))
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.$emit("close");
        this.$router.push({
          name: "MainTree",
        });
      }
    },
    close() {
      this.$emit("close");
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
    getAllChilds() {
      return {};
    },
  },
};
</script>

<style scoped>
div {
  color: black;
}
.ghost {
  opacity: 0.5;
  background: #caeeff;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>