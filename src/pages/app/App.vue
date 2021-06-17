<template>
  <router-view></router-view>
</template>

<style>
.theme-primary-color {
  color: #eb9797;
}
.theme-primary-bg {
  background-color: #eb9797;
}
.theme-gery-bg {
  background-color: #f6f6f6;
}
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