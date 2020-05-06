import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./views/Home.vue";
import MainTree from "./views/MainTree.vue";
import AddMember from "./modals/AddMember.vue";
import AddRoot from "./modals/AddRoot.vue";

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
            path: "/error",
            name: "Error",
            component: () => import("./views/Error.vue")
        },
        {
            path: "/:id",
            name: "MainTree",
            component: () => import('./views/Selections.vue'),
            children: [
                {
                    path: "analytics",
                    name: "Analytics",
                    component: () => import('./views/Analytics/Analytics'),
                    children: [
                        {
                            path: ':find',
                            name: "Relation",
                            component: () => import('./views/Analytics/AnalyticsFrame')
                        }
                    ]
                },
                {
                    path: "",
                    name: "Tree",
                    component: MainTree,
                    children: [
                        {
                            path: "addroot",
                            name: "AddRoot",
                            component: AddRoot,
                        },
                        {
                            path: ":member",
                            name: "MemberData",
                            component: () => import('./components/MemberData'),
                            children: [
                                {
                                    path: ":type",
                                    name: "AddMember",
                                    component: AddMember,

                                }
                            ]
                        }
                    ]
                },
            ]
        },

    ]
});

// myrouter.beforeEach((to, from, next) => {
//     if (to.name == 'MainTree') {
//         next({ name: 'Tree' }); 
//     }
//     else {
//         next();
//     }
// })

export default myrouter;