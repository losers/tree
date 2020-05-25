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
            redirect: "/:id/",
            component: () => import('./views/Selections.vue'),
            children: [
                {
                    path: "analytics",
                    name: "Analytics",
                    redirect: "analytics/relation-finder",
                    component: () => import('./views/Analytics/Analytics'),
                    children: [
                        {
                            path: 'relation-finder',
                            name: "RelationFinder",
                            component: () => import('./views/Analytics/Finder')
                        },
                        {
                            path: 'subtree',
                            name: "Subtree",
                            component: () => import('./views/Analytics/SubTree')
                        }
                    ]
                },
                {
                    path: "timeline",
                    name: "Timeline",
                    component: () => import('./views/Timeline/Timeline.vue'),
                    children: [
                        {
                            path: ":member",
                            name: "TimelinePerson",
                            component: () => import('./views/Timeline/TimelinePerson.vue')
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
                            component: () => import('./components/MemberData/MemberData'),
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