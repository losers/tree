<template>
    <router-view></router-view>
</template>

<script>
import Store from "../store/index";
export default {
  mounted() {
    Store.dispatch('treeSetup', this.$route.params.id).then(function(){
    });
  }
};
</script>