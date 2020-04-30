<template>
  <div id="app">
    <h1 style="color:white">Something went wrong</h1>
    <vue-particles
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

<style scoped>
#app {
  background-image: url("../assets/error.jpg");
  background-repeat: no-repeat;
  background-size: 100%;
  width: 100%;
  height: 100%;
}
</style>