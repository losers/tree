<template>
  <div id="app">
    <h1 class="msg mx-auto col-12">{{msg}}</h1>
    <router-link :to="{name:'Home'}" class="back mr-5">
      <i class="icofont-arrow-left"></i>
      Home
    </router-link>
    <button @click="test">test</button>
    <vue-particles
      style="z-index:200"
      color="#dedede"
      :particleOpacity="1"
      :particlesNumber="50"
      shapeType="circle"
      :particleSize="5"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.5"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></vue-particles>
  </div>
</template>

<script>
export default {
  props: ["msg"],
  methods:{
    test(){
      this.$router.replace("/abcd");
    }
  }
};
</script>

<style scoped>
.msg {
  color: white;
  top: 50%;
  position: absolute;
  align-content: center;
}
#app {
  background-image: url("../assets/error.jpg");
  background-repeat: no-repeat;
  background-size: 100%;
  width: 100%;
  height: 90% !important;
}
.back {
  top: 5%;
  left: 30px;
  font-size: 30px;
  color: white;
  position: absolute;
}
</style>