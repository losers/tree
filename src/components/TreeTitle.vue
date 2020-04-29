<template>
  <div class="title">
    {{meta.title}}
    <i class="icofont-edit ml-2" @click="editmeta" style="font-size:20px"></i>
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
.title {
  width: 100%;
  margin-bottom: 20px;
  font-size: 30px;
  box-shadow: -1px 3px 20px -10px rgba(0, 0, 0, 0.75);
  padding: 10px;
  height: 50px;
}
</style>