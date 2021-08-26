import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import ProdData from "@/data.js";
import Algos from "../algos/analytics/relation-finder";
import { setExitNodeInfo } from "@/util/helper";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tree: {},
    images: {},
    title: "",
    is_session: false,
    loading: true,
    allMembers: [],
    error: false,
    cur_surname: "",
    metadata: {},
    view_only: null,
    promos: {
      "RelationFinder": true, //Relation Finder
      "Website": true,  // Website
      "Donation": true  //Donation Promo
    },
    subtree:{},
    sub_member_data: {},
    subtree_meta: {},
  },
  mutations: {
    setImages(state, imagesData) {
      state.images = imagesData.data[0];
    },
    setTreeData(state, treeData) {
      state.tree = treeData.data.tree;
      state.title = treeData.data.meta[0].title;
      state.metadata = treeData.data.meta;
      state.is_session = treeData.data.has_session;
      state.view_only = treeData.data.view_only;
      try {
        if (treeData.data.meta[0]["celeb"] != true)
          print.postMessage("familyId--" + treeData.data.meta[0]["_id"]);
      } catch (error) {
        console.log();
      }
    },
    setSession(state, sessData) {
      state.is_session = sessData.status;
      state.cur_surname = sessData.surname;
      state.view_only = sessData.view_only;
      console.log(state.view_only);
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setAllMembers(state, payload) {
      state.allMembers = payload;
    },
    error(state, err) {
      state.error = err;
    },
    setTreeOnlyData(state, tree) {
      state.tree = tree;
    },
    setMetaData(state, metaData) {
      state.metadata = metaData;
    },
    setSubtree(state, subtree ) {
      state.subtree = subtree;
    },
    setTitle(state, title ) {
      state.title = title;
    },
    setSubMemberData(state,  sub_member_data) {
      state.sub_member_data = sub_member_data;
    },
    setPromo(state, promoName) {
      state.promos[promoName] = false;
    },
    setSubtreeMeta(state,  subtree_data) {
      state.subtree_meta = subtree_data;
    },
  },
  actions: {
    async treeSetup(state, surname) {
      try {
        state.commit('setLoading', true);
        let imagesData = await axios.get(ProdData.getHostURL() + "/tree/" + surname + "/person/" + this.id + "/images");
        state.commit('setImages', imagesData);
        let treeData = await axios.get(ProdData.getHostURL() + "/tree/" + surname);
        state.commit('setTreeData', treeData);
        state.commit('setLoading', false);
        state.dispatch('allMembersSet', treeData.data.tree);
      }
      catch (err) {
        state.commit('error', err)
      }
    },
    async treeOnlySetup(state, tree) {
      state.commit('setTreeOnlyData', tree);
      state.dispatch('allMembersSet', tree);
    },
    async allMembersSet(state, tree) {
      let allMembers = [];
      Algos.getAllGuys(tree, allMembers);
      state.commit('setAllMembers', allMembers);
    },
    async setMetaData(state, metaData) {
      state.commit('setMetaData', metaData);
    },
    async setSubtree(state, payload) {
      if(payload.member_data){
        setExitNodeInfo(payload.tree, payload.member_data);
        state.commit('setSubMemberData', payload.member_data);
      }
      else{
        if(payload.tree.name)
          setExitNodeInfo(payload.tree, state.state.sub_member_data);
        else
          state.commit('setSubMemberData', {});
      }
      state.commit('setSubtree', payload.tree);
    },
    async setStepNumber(state, step) {
      axios.put(ProdData.getHostURL() + "/meta/stepper", {
        family_id: state.state.metadata[0]._id,
        stepper: step
      });
    },
    async setTitle(state, title) {
      state.commit('setTitle', title);
    },
    async setSubtreeMeta(state, subtreeData) {
      state.commit('setSubtreeMeta', subtreeData);
    },
  },
  getters: {
    getSubTree: (state) => {
      return state.subtree;
    },
    getIsEditable:(state)=>{
      return !state.view_only && state.is_session;
    },
    getIsLoading: (state) => {
      return state.loading;
    },
    getMetaData: (state) => {
      return state.metadata;
    },
    getTreeData: (state) => {
      return state.tree;
    },
    hasData: (state) => {
      return (state.tree.id) ? true : false;
    },
    getAllMembers: (state) => {
      return state.allMembers;
    },
    images: (state) => {
      return state.images;
    }
  },
  modules: {
  }
});
