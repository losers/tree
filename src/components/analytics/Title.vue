<template>
  <div class="titlebar">
    <router-link :to="{name:'Tree', props:{id:'nehru'}}" class="float-left mt-2 ml-1">
      <i class="icofont-arrow-left"></i>
      Back
    </router-link>
    <center>
      <p class="title">Family Crazy Analytics</p>
    </center>
  </div>
</template>

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