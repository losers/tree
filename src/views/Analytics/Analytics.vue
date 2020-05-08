<template>
  <div>
    <div class="titlebar">
      <router-link :to="{name:'Tree'}" class="float-left mt-2 ml-1">
        <i class="icofont-arrow-left"></i>
        Back
      </router-link>
      <center>
        <p class="title">Crazy Analytics</p>
      </center>
    </div>
    <div class="row">
      <!-- Finders list -->
      <div class="col-3 finders">
        <router-link :to="{name:'RelationFinder'}">
          <div class="pl-3">Relation Finder</div>
          <hr />
          <!-- <div class="hr"></div> -->
        </router-link>
        <router-link :to="{name:'Subtree'}">
          <div class="pl-3">Subtree</div>
          <hr />
          <!-- <div class="hr"></div> -->
        </router-link>
      </div>

      <!-- Relations Data -->
      <div class="col-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      
    };
  }
};
</script>

<style scoped>
.finders {
  margin-top: 60px;
  height: 50vmax;
}
.hr {
  height: 0.1px;
  background-color: grey;
}
.router-link-active {
  color: black;
}
.titlebar a{
  color: #007bff; 
}
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