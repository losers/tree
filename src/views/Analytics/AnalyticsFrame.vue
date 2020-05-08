<template>
  <div>
    <h1 class="mt-5">{{$route.params.find}}</h1>
    <div class="row">
      <vSelect :options="names" v-model="p1" class="col-3"></vSelect>
      <vSelect :options="names" v-model="p2" class="col-3"></vSelect>
      <button class="btn btn-success" @click="submit">Search</button>
      <span v-show="result">{{result}}</span>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  data() {
    return {
      names: [
        {
          label: "jai",
          value: "a"
        },
        {
          label: "arun",
          value: 1
        },
        {
          label: "varun",
          value: 2
        }
      ],
      p1: null,
      p2: null,
      result: null
    };
  },
  // watch: {
  //   p1: function(data) {
  //     console.log(data.value);
  //     if (this.p1 == this.p2) {
  //       this.result = "thuss...";
  //     }
  //   },
  //   p2: function(data) {
  //     console.log(data.value);
  //     if (this.p1 == this.p2) {
  //       this.result = "thuss...";
  //     }
  //   }
  // },
  methods: {
    // check() {
    //   console.log(this.p1.value, this.p2.value);
    //   if (this.p1 === this.p2) {
    //     this.result = "thuss...";
    //   } else {
    //     this.result = null;
    //   }
    // }
    submit() {
      console.log(this.p1.value, this.p2.value);
    }
  },
  components: {
    vSelect
  }
};
</script>