<template>
  <div id="app">
    <Particles
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></Particles>
  </div>
</template>

<script>
import Particles from "vue-particles";
export default {
  name: "Error",
  components: {
    Particles
  }
};
</script>