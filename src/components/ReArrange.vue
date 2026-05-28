<template>
  <div class="col-12 col-md-10 mx-auto mt-4 mb-4">
    <h3 class="swap-title text-center">Swap Siblings</h3>
    <draggable
      class="theme-list-group mt-3"
      tag="ul"
      v-model="list"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <li
          class="theme-list-item"
          v-for="element in list"
          :key="element.order"
        >
          <i class="icofont-navigation-menu mr-3" style="color: #6b7280;"></i>
          {{ element.name }}
        </li>
      </transition-group>
    </draggable>
    <div class="action-buttons">
      <button @click="close" class="btn-theme-cancel" type="button">
        Cancel
      </button>
      <button
        class="btn-theme-submit d-flex align-items-center"
        v-on:click="finalList"
        :disabled="loading"
      >
        <span
          class="spinner-border spinner-border-sm mr-2"
          v-show="loading"
        ></span>
        Submit
      </button>
    </div>
  </div>
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
.swap-title {
  color: #fff;
  font-weight: 600;
  margin-bottom: 24px;
}
.theme-list-group {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  list-style: none;
  margin: 0;
}
.theme-list-item {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  cursor: grab;
  font-weight: 500;
}
.theme-list-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}
.theme-list-item:active {
  cursor: grabbing;
}
.theme-list-item:last-child {
  margin-bottom: 0;
}
.ghost {
  opacity: 0.4;
  background: rgba(255, 255, 255, 0.15);
  border: 1px dashed rgba(255, 255, 255, 0.4);
}
.btn-theme-submit {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 28px;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
.btn-theme-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}
.btn-theme-cancel {
  background: transparent;
  color: #9ca3af;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 10px 28px;
  font-weight: 500;
  transition: all 0.3s;
}
.btn-theme-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
}
</style>