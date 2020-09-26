<template>
  <div class="content">
    <h4>If you want any help from us or for any feedback or even for irritating us we will be hearing you at</h4>
    <center style="margin-top: 60px;"><a class="email"><span style="color:red">bloodline</span>.helpline@gmail.com</a></center>
    <center class="playstore">
        <i class="icofont-play" style="margin-left: 20px;"></i>
        <a  href="https://play.google.com/store/apps/details?id=com.losersteam.bloodline">PlayStore Link</a>
    </center>
  </div>
</template>

<style scoped>
.playstore{
    margin-top: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.icofont-play{
    color: aliceblue;
    font-size: 40px;
    background-color: black;
}
.content {
    padding: 30px;
    margin-top: 40px;
}
.email{
    color: blue !important;
    font-size: 20px;
}
</style>

<script>
export default {
  name: "Helper",
  methods: {
    goBack() {}
  }
};
</script>