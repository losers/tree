import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./views/Home.vue";
import MainTree from "./views/MainTree.vue";
import AddMember from "./modals/AddMember.vue";

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
            path: "/addmember",
            name: "AddMember",
            component: AddMember
        },

        {
            path: "/:id",
            name: "MainTree",
            component: MainTree,
            children: [
                {
                    path: ":member",
                    name: "MemberData",
                    component: () => import('./components/MemberData')
                }
            ]
        },

    ]
});

export default myrouter;