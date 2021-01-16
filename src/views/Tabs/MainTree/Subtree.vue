<template>
  <div>
    <div v-if="loader" class="load-cont">
      <span
        class="spinner-border spinner-border-lg"
        style="margin-right: 8px"
      ></span>
    </div>
    <center v-if="!loader" style="overflow: auto;" class="h100">
      <TreeChart
        :json="tree"
        :images="images"
        :class="{}"
        @click-node="clickNode"
      />
    </center>
    <router-view></router-view>
  </div>
</template>


<script>
import Axios from "axios";
import ProdData from "@/data.js";
import TreeChart from "@/components/TreeChart";
import Store from "@/store/index";

export default {
  data() {
    return {
      loader: false,
      title: "Subtree",
    };
  },
  components: {
    TreeChart,
  },
  computed: {
    images: {
      get() {
        return Store.state.images;
      },
    },
    tree: {
      get() {
        return Store.state.subtree;
      },
    },
    submemData: {
      get() {
        return Store.state.sub_member_data;
      },
    },
  },
  watch: {
    $route(to, from) {
      let refresh =
        from.path.includes(this.$route.params.subtree_id) &&
        to.path.includes(this.$route.params.subtree_id)
          ? false
          : true;
      if (refresh) {
        this.getData();
      }
    },
  },
  methods: {
    getData: function () {
      let url = `${ProdData.getHostURL()}/subtree/${this.$route.params.id}/${
        this.$route.params.subtree_id
      }`;
      this.loader = true;
      Axios.get(url)
        .then((data) => {
          data = data.data;
          this.title = `${data.member_data.short_name}'s Tree`;
          let payload = {};
          payload.tree = data.tree_data.tree;
          payload.member_data = data.member_data;
          Store.dispatch("setSubtree", payload).then();
          delete data.tree_data.tree;
          Store.dispatch("setSubtreeMeta", data.tree_data);
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loader = false));
    },
    clickNode: function (node) {
      if (node.data.way_point_node) {
        if (this.submemData.subtree_id) {
          this.$router.push({
            name: "Subtrees",
            params: { subtree_id: this.submemData.subtree_id },
          });
        } else {
          this.$router.push({
            name: "Tree",
          });
        }
      } else {
        if (node.data.mate || node.isMate) {
          this.$router.push({
            name: "SubMemberData",
            params: { member: node.data.id },
            query: { hasMate: true },
          });
        } else {
          this.$router.push({
            name: "SubMemberData",
            params: { member: node.data.id },
          });
        }
      }
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.load-cont {
  justify-content: center;
  display: flex;
  margin-top: 200px;
}
.spinner-border {
  color: indianred;
  margin-right: 8px;
  width: 5rem;
  height: 5rem;
}
.f-26 {
  font-size: 26px;
}
.fam-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
  color: indianred;
}

.flexy {
  display: flex;
  align-items: center;
}

.tree-title {
  font-size: 30px;
  color: black;
  font-weight: bold;
  flex: 1;
  justify-content: center;
}

.tree-titlebar {
  position: fixed;
  width: 100%;
  z-index: 10;
  box-shadow: -1px 3px 20px -10px rgba(163, 163, 163, 0.75);
  padding: 5px !important;
  background-color: white;
  display: flex;
  align-items: center;
}
.fixed-body {
  position: fixed;
  height: 83%;
  width: 90%;
  overflow: auto;
  border-radius: 20px;
  margin: 25% 5% 0px;
  box-shadow: rgb(185 185 185 / 75%) 0px 0px 10px 0px;
}
</style>