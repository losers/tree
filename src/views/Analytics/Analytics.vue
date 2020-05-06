<template>
  <div>
    <title-bar></title-bar>
    <div class="row">
      <!-- Finders list -->
      <div class="col-3 finders">
        <div v-for="(item, index) in finders" :key="index">
          <router-link :to="{name:'Relation', params:{find:item.link}}">
            <div class="pl-3">{{item.title}}</div>
            <div class="pl-3">Nodes used : {{item.nodes}}</div>
            <hr />
            <!-- <div class="hr"></div> -->
          </router-link>
        </div>
      </div>

      <!-- Relations Data -->
      <div class="col-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import TitleBar from "../../components/analytics/Title";
export default {
  props: ["family"],
  components: {
    TitleBar
  },
  data() {
    return {
      finders: [
        {
          title: "Find Relation",
          nodes: 2,
          link: "find-relation"
        },
        {
          title: "Find somethings",
          nodes: 3,
          link: "find-some"
        },
        {
          title: "Find thuss",
          nodes: 2,
          link: "find-thuss"
        }
      ]
    };
  }
};
</script>

<style scoped>
.finders {
  margin-top: 60px;
  height: 50vmax;
}
.hr {
  height: 0.1px;
  background-color: grey;
}
.router-link-active {
  color: black !important;
  background-color: green;
  opacity: 0.3;
}
</style>