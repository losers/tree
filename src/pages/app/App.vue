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

/* ==========================================================================
   Global Glassmorphism UI Theme Utilities
   ========================================================================== */
.my-action-btn {
  background: rgba(15, 17, 35, 0.6) !important;
  color: white !important;
  border-radius: 12px !important;
  padding: 10px 16px !important;
  font-weight: 600;
  transition: all 0.3s ease !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.my-action-btn:hover {
  transform: translateY(-2px);
}
.my-action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}
.glass-primary {
  border-left: 3px solid #4f8ef7 !important;
}
.glass-primary:hover {
  background: rgba(79, 142, 247, 0.2) !important;
  border-color: #4f8ef7 !important;
  box-shadow: 0 5px 15px rgba(79, 142, 247, 0.3);
}
.glass-success {
  border-left: 3px solid #2ed573 !important;
}
.glass-success:hover {
  background: rgba(46, 213, 115, 0.2) !important;
  border-color: #2ed573 !important;
  box-shadow: 0 5px 15px rgba(46, 213, 115, 0.3);
}
.glass-warning {
  border-left: 3px solid #ffa502 !important;
}
.glass-warning:hover {
  background: rgba(255, 165, 2, 0.2) !important;
  border-color: #ffa502 !important;
  box-shadow: 0 5px 15px rgba(255, 165, 2, 0.3);
}
.glass-danger {
  border-left: 3px solid #ff4757 !important;
}
.glass-danger:hover {
  background: rgba(255, 71, 87, 0.2) !important;
  border-color: #ff4757 !important;
  box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
}

/* Global Glass Card Form */
.glass-card-form {
  background: rgba(15, 17, 35, 0.9) !important;
  backdrop-filter: blur(24px) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 20px !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4) !important;
  color: white !important;
}

/* Form inputs dark theme */
.dark-input, .dark-addon {
  background: rgba(15, 17, 35, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}
.dark-input:focus {
  border-color: #4f8ef7 !important;
  box-shadow: 0 0 10px rgba(79, 142, 247, 0.2) !important;
}
.dark-datepicker input {
  color: white !important;
  -webkit-text-fill-color: white !important;
}

/* Vue Select premium dark theme overrides */
.dark-vselect .vs__dropdown-toggle {
  background: rgba(15, 17, 35, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px !important;
  color: white !important;
  padding: 2px 8px !important;
}
.dark-vselect .vs__selected {
  color: white !important;
  background: rgba(79, 142, 247, 0.2) !important;
  border: 1px solid rgba(79, 142, 247, 0.4) !important;
  border-radius: 20px !important;
}
.dark-vselect .vs__search {
  color: white !important;
}
.dark-vselect .vs__dropdown-menu {
  background: rgba(15, 17, 35, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
}
.dark-vselect .vs__dropdown-option {
  color: rgba(255, 255, 255, 0.8) !important;
}
.dark-vselect .vs__dropdown-option--highlight {
  background: #4f8ef7 !important;
  color: white !important;
}
.dark-vselect .vs__open-indicator,
.dark-vselect .vs__clear {
  fill: rgba(255, 255, 255, 0.6) !important;
}

/* ==========================================================================
   Global Cool DNA Loader Override
   ========================================================================== */
.spinner-border {
  border: none !important;
  display: inline-block;
  position: relative;
  width: 24px !important;
  height: 24px !important;
  vertical-align: middle;
  background: transparent !important;
  animation: none !important;
}
.spinner-border::before, .spinner-border::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: dna-spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.spinner-border::before {
  background: #4f8ef7;
  animation-delay: 0s;
}
.spinner-border::after {
  background: #a78bfa;
  animation-delay: -0.75s;
}

@keyframes dna-spin {
  0% { transform: translate(-100%, -50%) scale(0.8); z-index: 1; }
  25% { transform: translate(0, -50%) scale(1.2); z-index: 2; }
  50% { transform: translate(100%, -50%) scale(0.8); z-index: 1; }
  75% { transform: translate(0, -50%) scale(0.5); z-index: 0; }
  100% { transform: translate(-100%, -50%) scale(0.8); z-index: 1; }
}

.spinner-border-sm {
  width: 18px !important;
  height: 18px !important;
}
.spinner-border-sm::before, .spinner-border-sm::after {
  width: 7px;
  height: 7px;
}

.spinner-border-lg {
  width: 40px !important;
  height: 40px !important;
}
.spinner-border-lg::before, .spinner-border-lg::after {
  width: 16px;
  height: 16px;
}
</style>