import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./views/Home.vue";
import MainTree from "./views/Tabs/MainTree/MainTree.vue";
import Subtree from "./views/Tabs/MainTree/Subtree.vue";

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
                    component: () => import('./views/Tabs/Profile'),
                    children: [
                        {
                            path: ":member",
                            name: "Profile",
                            component: () => import('./views/Tabs/Profile'),
                        }
                    ]
                },
                {
                    path: 'relation-finder',
                    name: "RelationFinder",
                    component: () => import('./views/Tabs/Finder')
                },
                {
                    path: 'partial-tree',
                    name: "PartialTree",
                    component: () => import('./views/Tabs/PartialTree')
                },
                {
                    path: 'events',
                    name: "Events",
                    component: () => import('./views/Tabs/Events')
                },
                {
                    path: 'subtree',
                    name: "Subtree",
                    component: () => import('./views/Tabs/SubTree')
                },
                {
                    path: "timeline",
                    name: "Timeline",
                    component: () => import('./views/Tabs/Timeline/Timeline.vue'),
                    children: [
                        {
                            path: ":member",
                            name: "PersonTimeline",
                            component: () => import('./views/Tabs/Timeline/PersonTimeline.vue')
                        },
                        {
                            path: "",
                            name: "FamilyTimeline",
                            component: () => import('./views/Tabs/Timeline/FamilyTimeline.vue')
                        }
                    ]
                },
                {
                    path: "records",
                    name: "Records",
                    component: () => import('./views/Tabs/Records.vue'),
                },
                {
                    path: "donations",
                    name: "Donations",
                    component: () => import('./views/Tabs/Donations.vue'),
                },
                {
                    path: 'settings',
                    name: "Settings",
                    component: () => import('./views/Tabs/Settings.vue')
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
                {
                    path: "subtree/:subtree_id",
                    name: "Subtrees",
                    component: Subtree,
                    children: [
                        {
                            path: ":member",
                            name: "SubMemberData",
                            component: () => import('./components/MemberData/MemberData'),
                        },
                    ]
                }
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