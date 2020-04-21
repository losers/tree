import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./views/Home";
import MainTree from "./views/MainTree";
Vue.use(VueRouter);

const myrouter = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "Home",
            component: Home,
        },
        {
            path: "/medam",
            name: "Surname",
            component: MainTree

        }
    ]
});

export default myrouter;