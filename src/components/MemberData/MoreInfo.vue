<template>
  <div>
    <h4>{{name}}</h4>, More data
    <router-link :to="{name:'TimelinePerson', params:{member:id}}">Timeline</router-link>
    <button class="btn btn-primary">Timeline</button>
  </div>
</template>

<script>
export default {
  name: "MoreInfo",
  props: ["name", "id"]
};
</script>