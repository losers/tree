<template>
  <div class="titlebar">
    <router-link :to="{name:'Home'}" class="float-left mt-2 ml-1">
      <i class="icofont-arrow-left"></i>
      Back
    </router-link>
    <p class="title mb-2">
      {{meta.title}}
      <i class="icofont-edit ml-2" @click="editmeta" style="font-size:20px"></i>
    </p>
  </div>
</template>

<script>
import AddFamily from "./AddFamilyForm";

export default {
  props: ["meta"],
  methods: {
    editmeta() {
      this.$modal.show(
        AddFamily,
        {
          metadata: this.meta
        },
        {
          height: "auto",
          draggable: true,
          clickToClose: false,
          scrollable: true
        }
      );
    }
  }
};
</script>

<style>
.titlebar {
  position: fixed;
  width: 100%;
  z-index: 100;
  margin-bottom: 20px;
  box-shadow: -1px 3px 20px -10px rgba(163, 163, 163, 0.75);
  padding: 5px;
  background-color: white;
  height: 50px;
}
.title {
  font-size: 30px;
  color: black;
  font-weight: bold;
}
</style>