<template>
  <div style="height:100%">
    <div class="titlebar">
      <router-link :to="{name:'Tree'}" class="float-left mt-2 ml-1" style="color:#007bff;">
        <i class="icofont-arrow-left"></i>
        Back
      </router-link>
      <center>
        <p class="title">Crazy Analytics</p>
      </center>
    </div>
    <div class="row" style="
    width: 100%;height:100%;">
      <!-- Finders list -->
      <div class="col-3 finders">
        <router-link :to="{name:'RelationFinder'}" class="alyt">
          <div class="item">
            <i class="icofont-search-2" style="margin-right:10px"></i>Relation Finder
          </div>
          <!-- <div class="hr"></div> -->
        </router-link>
        <router-link :to="{name:'Subtree'}" class="alyt">
          <div class="item">
            <i class="icofont-tree" style="margin-right:10px;font-size: 19px"></i> Subtree
          </div>
          <!-- <div class="hr"></div> -->
        </router-link>
      </div>

      <!-- Relations Data -->
      <div
        class="col-9"
        style="padding-top:100px;padding-top: 90px;height: 100%;overflow: auto;">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alyt {
  color: black;
}
.finders {
  padding-top: 50px;
  overflow: auto;
  height: 100%;
}
.finders .item {
  padding: 20px;
  border: 1px solid #d3d3ff;
  border-top: 0px;
}
.finders .router-link-exact-active .item {
  background: #efefef;
}
.hr {
  height: 0.1px;
  background-color: grey;
}
.router-link-active {
  color: #007bff;
  font-weight: bold;
}
.titlebar {
  position: fixed;
  width: 100%;
  z-index: 100;
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