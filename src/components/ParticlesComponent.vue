<template>
  <div class="app">
    <div v-if="show">
      <ParticleBtn
        :visible.sync="btnOps.visible"
        :animating.sync="btnOps.animating"
        :options="btnOps"
        cls="btn-cls"
        class="col-10"
      >
        <h1>{{title}}</h1>
      </ParticleBtn>
    </div>
    <div v-else>
      <input
        class="col-8 form-control no-border mx-auto mb-4"
        placeholder="Enter a title"
        v-model="titleText"
        autofocus
      />
    </div>
    <!-- <h2>animating:{{btnOps.animating}}</h2>
    <h2>visible:{{btnOps.visible}}</h2>-->
    <button @click="changeMe">
      <span></span>
      {{btnOps.visible? "change":"update"}}
    </button>
  </div>
</template>

<script>
import ParticleBtn from "vue-particle-effect-buttons";

export default {
  props: ["title"],
  data() {
    return {
      titleText: null,
      show: true,
      btnOps: {
        type: "triangle",
        easing: "easeOutQuart",
        size: 6,
        particlesAmountCoefficient: 10,
        oscillationCoefficient: 150,
        color: function() {
          return Math.random() < 0.5 ? "#ffffff":"#000000";
        },
        onComplete: () => {
          console.log("complete");
        },
        onBegin: () => {
          console.log("begin");
        },
        visible: true,
        animating: false
      }
    };
  },
  components: {
    ParticleBtn
  },
  computed: {
    animating() {
      return this.btnOps.animating;
    }
  },
  watch: {
    animating: function(val) {
      if (!val && !this.btnOps.visible) {
        console.log("input show");
        this.show = false;
      } else if (!val && !this.btnOps.visible) {
        console.log("input hide");
      }
    }
  },
  methods: {
    changeMe() {
      if (this.btnOps.visible) {
        this.btnOps.visible = !this.btnOps.visible;
      } else {
        this.show = true;
        setTimeout(() => {
          console.log("input updated");
          this.btnOps.visible = !this.btnOps.visible;
        }, 2000);
      }
    },
    updateInput() {}
  }
};
</script>

<style  >
.vue-particle-effect-button .particles-button{
    background: black!important;
    color: white!important;
}
.app {
  margin-left: 0 !important;
}
h1 {
  width: 100%;
  font-family: "Comfortaa", cursive;
}
input[type="text"] {
  padding: 20px !important;
}
.no-border {
  font-size: 75px;
  height: 85px;
  color: blue;
  border: 0;
  border-bottom: 2px solid blue;
  box-shadow: none;
}
</style>