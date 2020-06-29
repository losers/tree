<template>
  <router-view></router-view>
</template>

<style>
.j-stars {
  background-color: black !important;
}
.mem-spec, .mem-spec #app{
  overflow: hidden;
}
@keyframes rocking {
  0%,100% {transform: rotateZ(-10deg);}
  50%     {transform: rotateZ(10deg);}
}

.vue-typer {
  font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
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
  background-color: #E91E63;
}
.vue-typer .custom.caret.idle.pre-erase{
  background-color: #009688;
}
</style>