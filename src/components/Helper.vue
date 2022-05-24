<template>
  <center
    style="
      padding: 30px;
      height: 500px;
      display: grid;
      align-content: space-evenly;
    "
  >
    <h4 style="text-align: -webkit-center">
      {{ $t("if_you_want_any_help") }}
    </h4>
    <a class="email"
      >hello@bloodline.app</a
    >
    <a
      href="mailto:hello@bloodline.app?subject=My thoughts over Bloodline App"
      class="btn mt-3"
      style="
        border: solid 1px indianred;
        color: indianred;
        box-shadow: 3px 3px 8px 0px indianred;
        margin: 40px;
      "
    >
      {{ $t("write_now") }}
    </a>

    <a
      href="https://play.google.com/store/apps/details?id=com.losersteam.bloodline"
    >
      <img
        src="../assets/play.jpeg"
        height="60px"
        width="80%"
        style="
          box-shadow: 6px 6px 8px 0px rgba(0, 0, 0, 0.75);
          border-radius: 10px;
        "
      />
    </a>
  </center>
</template>

<style scoped>
.playstore {
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icofont-play {
  color: aliceblue;
  font-size: 40px;
  background-color: black;
}
.content {
  padding: 30px;
  margin-top: 40px;
}
.email {
  color: blue !important;
  font-size: 18px;
}
</style>

<script>
export default {
  name: "Helper",
  methods: {
    goBack() {},
  },
};
</script>