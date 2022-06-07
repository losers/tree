<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "MainApp",
  created() {
    if (localStorage.getItem("locale"))
      this.$i18n.locale = localStorage.getItem("locale");
    else if (window.location.hostname == "beta.bloodline.app") {
      localStorage.setItem("locale", "sw");
      this.$i18n.locale = "sw";
    } else if (window.location.hostname == "tz.bloodline.app") {
      localStorage.setItem("locale", "sw");
      this.$i18n.locale = "sw";
    }
  },
};
</script>
<style>
.theme-primary-color {
  color: #eb9797;
}
.theme-primary-bg {
  background-color: #eb9797;
}
.theme-primary-bgdark {
  background: #ff5d5d;
}
.theme-gery-bg {
  background-color: #f6f6f6;
  border-radius: 20px;
}
.vsm--link_exact-active {
  -webkit-box-shadow: 3px 0px 0px 0px #ff5d5d inset !important;
  box-shadow: 3px 0px 0px 0px #ff5d5d inset !important;
}
/* App Leve Animations */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0.9);
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(500px);
  opacity: 0;
}

/**********************  Animations Css ended ***********************/
.mem-spec,
.mem-spec #app {
  overflow: hidden;
}
@keyframes rocking {
  0%,
  100% {
    transform: rotateZ(-10deg);
  }
  50% {
    transform: rotateZ(10deg);
  }
}

.vue-typer {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
.vue-typer .custom.char.typed {
  background: -webkit-linear-gradient(white, #38495a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #009688;
  color: #fff;
  text-align: center;
  font-family: "lato", sans-serif;
  font-weight: 300;
  font-size: 50px;
  letter-spacing: 10px;
}
.vue-typer .custom.char.selected {
  background: -webkit-linear-gradient(white, #38495a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #009688;
  color: #fff;
  text-align: center;
  font-family: "lato", sans-serif;
  font-weight: 300;
  font-size: 50px;
  letter-spacing: 10px;
}

.vue-typer .custom.caret {
  font-size: 50px;
  color: white;
  animation: rocking 1s ease-in-out 0s infinite;
}
.vue-typer .custom.caret.typing {
  background-color: #009688;
}
.vue-typer .custom.caret.selecting {
  display: inline-block;
  background-color: #e91e63;
}
.vue-typer .custom.caret.idle.pre-erase {
  background-color: #009688;
}
</style>