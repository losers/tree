<template>
  <div class="title">
    <transition name="fade" mode="out-in">
      <span v-if="exists">
        {{metadata.title}}
        <i
          class="icofont-edit ml-2"
          @click="editmeta"
          style="font-size:20px"
        ></i>
      </span>
      <div v-else class="row mx-auto">
        <span class="col-4"></span>
        <span class="col-4 col-sm-offset-3">
          <input type="text" v-model="metadata.title" class="form-control input-sm" required />
        </span>
        <button @click="update" class="btn btn-success">Update</button>
        <button @click="exists=true" class="btn btn-danger">Cancel</button>
      </div>
    </transition>
  </div>
</template>

<script>
import Axios from "axios";
import AddFamily from './AddFamilyForm';
export default {
  data() {
    return {
      exists: true,
      metadata: this.meta
    };
  },
  props: ["meta"],
  methods: {
    editmeta(){
      this.$modal.show(
        AddFamily,
        {
          surname: this.meta
        },
        {
          height: "auto",
          draggable: true,
          clickToClose: false,
          scrollable: true
        }
      );
    },
    edit_title() {},
    update() {
      console.log(this.metadata);
      Axios.put("http://localhost:5000/meta/update", this.metadata)
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(() => (this.exists = true));
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.title {
  width: 100%;
  margin-bottom: 20px;
  font-size: 30px;
  box-shadow: -1px 3px 20px -10px rgba(0, 0, 0, 0.75);
  padding: 10px;
  height: 50px;
}
</style>