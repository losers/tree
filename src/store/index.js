import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import ProdData from "../data.js";
import Algos from "../algos/analytics/relation-finder";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tree: {},
    images: {},
    title: "",
    is_session: false,
    loading: true,
    allMembers: [],
    error: false,
    cur_surname : "",
    metadata : {}
  },
  mutations: {
    setImages(state, imagesData) {
      state.images = imagesData.data[0];
    },
    setTreeData(state, treeData) {
      state.tree = treeData.data.tree;
      state.title = treeData.data.meta;
      state.is_session = treeData.data.has_session;
    },
    setSession(state, sessData) {
      state.is_session = sessData.status;
      state.cur_surname = sessData.surname;
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
    setMetaData(state, metaData){
      state.metadata = metaData;
    }
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
    },
    async allMembersSet(state, tree) {
      let allMembers = [];
      Algos.getAllGuys(tree, allMembers);
      state.commit('setAllMembers', allMembers);
    },
    async setMetaData(state, metaData) {
      state.commit('setMetaData', metaData);
    },
  },
  getters: {
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
