import Vuex from 'vuex';
import axios from 'axios';
import {ACTION} from './action-types';
import {MUTATION} from './mutation-types';

const store = () => new Vuex.Store({
  state: {
    user: {},
    cat: [],
    categories: [], // eslint-disable-next-line
    avatarURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy43LjI8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzI8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpRXAfaAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=', // dummy image
    apiVersion: '20180705',
    position: {
      lat: 35.681155,
      lng: 139.766893,
    },
  },
  getters: {
    isAuthenticated: (state) => {
      return state.isAuthenticated;
    },
    avatarURL: (state) => {
      return state.avatarURL;
    },
    allCategories: (state) => {
      return state.categories;
    },
    currentMarkerPosition: (state) => {
      return state.position;
    },
  },
  actions: {
    [ACTION.FETCH_SELF_USER_DATA]({commit}) {
      axios.get('https://api.foursquare.com/v2/users/self?oauth_token=' +
      this.$auth.$storage.getLocalStorage('_token.social').split(' ')[1] +
      '&v=' + this.state.apiVersion)
      .then((res) => {
        commit({
          type: MUTATION.SET_SELF_USER_DATA,
          data: res.data.response.user,
        });
        commit({
          type: MUTATION.SET_AVATAR_URL,
          data: res.data.response.user.photo.prefix + '64x64' +
            res.data.response.user.photo.suffix,
        });
      })
      .catch(() => {
        console.log('failed');
      });
    },
    [ACTION.FETCH_ALL_CATEGORIES]({commit}) {
      axios.get('https://api.foursquare.com/v2/venues/categories?oauth_token=' +
      this.$auth.$storage.getLocalStorage('_token.social').split(' ')[1] +
      '&v=' + this.state.apiVersion)
      .then((res) => {
        commit({
          type: MUTATION.SET_ALL_CATEGORIES,
          data: res.data.response.categories,
        });
      });
    },
    [ACTION.SET_CURRENT_POSITION]({commit}, payload) {
      commit({
        type: MUTATION.SET_CURRENT_POSITION,
        data: {
          lat: payload.lat,
          lng: payload.lng,
        },
      });
    },
  },
  mutations: {
    [MUTATION.SET_SELF_USER_DATA](state, payload) {
      state.user = payload.data;
    },
    [MUTATION.SET_AVATAR_URL](state, payload) {
      state.avatarURL = payload.data;
    },
    [MUTATION.SET_ALL_CATEGORIES](state, payload) {
      state.categories = payload.data.map((x) => {
        return x.categories.map((y) => y.name);
      }).reduce((acc, val) => acc.concat(val), []);
    },
    [MUTATION.SET_CURRENT_POSITION](state, payload) {
      state.position.lat = payload.data.lat;
      state.position.lng = payload.data.lng;
    },
  },
});

export default store;
