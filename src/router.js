import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./views/Home.vue";
import MainTree from "./views/MainTree.vue";

Vue.use(VueRouter);

const myrouter = new VueRouter({
    mode: "history",
    base: '/app/',
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
                    path: "profile",
                    name: "ProfileFrame",
                    component: () => import('./views/Profile'),
                    children: [
                        {
                            path: ":member",
                            name: "Profile",
                            component: () => import('./views/Profile'),
                        }
                    ]
                },
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
                            path: ":member",
                            name: "MemberData",
                            component: () => import('./components/MemberData/MemberData'),
                        },
                    ]
                },
            ]
        },

    ]
});

// myrouter.beforeEach(function (to, from, next) {
//     if (to.name == 'MemberData') {
//         if ($device.mobile) {

//             console.log("mobile");
//             next({ name: "MobileMemberData" })
//         }
//         // next({ name: 'Tree' }); 
//     }
//     else {
//         next();
//     }
// })

export default myrouter;