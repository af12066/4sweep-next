import Vuex from 'vuex';
import axios from 'axios';
import {ACTION} from './action-types';
import {MUTATION} from './mutation-types';

const store = () => new Vuex.Store({
  state: {
    defaultTitle: '4sweep-next',
    initMapHeight: 0,
    user: {},
    cat: [],
    categories: {}, // {'categoryName': 'categoryValue', ...}
    // eslint-disable-next-line
    avatarURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy43LjI8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzI8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpRXAfaAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=', // dummy image
    apiVersion: '20180705',
    position: {
      lat: 35.681155,
      lng: 139.766893,
    },
    searchQuery: '',
    searchCategory: '',
    searchedVenues: [],
    specificVenueDetail: {},
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
    searchedVenues: (state) => {
      return state.searchedVenues;
    },
    specificVenueDetailForEditableStyle: (state) => {
      if (Object.keys(state.specificVenueDetail).length === 0) {
        return {};
      } else {
        return {
          id: state.specificVenueDetail.venue.id,
          name: state.specificVenueDetail.venue.name,
          phone: state.specificVenueDetail.venue.contact.phone,
          twitter: state.specificVenueDetail.venue.contact.twitter,
          facebook: `https://www.facebook.com/${state.specificVenueDetail.venue.contact.facebookUsername}`,
          instagram: state.specificVenueDetail.venue.contact.instagram,
          address: state.specificVenueDetail.venue.location.address,
          crossStreet: state.specificVenueDetail.venue.location.crossStreet,
          postalCode: state.specificVenueDetail.venue.location.postalCode,
          city: state.specificVenueDetail.venue.location.city,
          state: state.specificVenueDetail.venue.location.state,
        };
      }
    },
  },
  actions: {
    [ACTION.FETCH_SELF_USER_DATA]({commit}) {
      axios.get('https://api.foursquare.com/v2/users/self?oauth_token=' +
      this.$auth.$storage.getLocalStorage('_token.social').split(' ')[1] +
      '&v=' + this.state.apiVersion +
      '&locale=' + this.$auth.$storage.getUniversal('locale', false))
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
      '&v=' + this.state.apiVersion +
      '&locale=' + this.$auth.$storage.getUniversal('locale', false))
      .then((res) => {
        const topcat = res.data.response.categories.map((cat) => {
          return {[cat.name]: cat.id};
        });
        const secondcat = res.data.response.categories.map((cat) => {
          return cat.categories.map((c) => {
            return {[c.name]: c.id};
          });
        }).reduce((acc, val) => acc.concat(val), []);
        const thirdcat = res.data.response.categories.map((cat) => {
          return cat.categories.map((c) => {
            return c.categories.map((c2) => {
              return {[c2.name]: c2.id};
            });
          }).reduce((acc, val) => acc.concat(val), []);
        }).reduce((acc, val) => acc.concat(val), []);
        const allcat = topcat.concat(secondcat).concat(thirdcat);
        const categories = {};
        allcat.forEach((cat) => {
          categories[Object.keys(cat)] = Object.values(cat)[0];
        });
        commit({
          type: MUTATION.SET_ALL_CATEGORIES,
          data: categories,
        });
      });
    },
    [ACTION.SET_CURRENT_LOCALE]({commit}) {
      const storedLocale = this.$auth.$storage.getUniversal('locale', false);
      if (storedLocale === null) {
        commit({
          type: MUTATION.UPDATE_CURRENT_LOCALE,
          data: 'en',
        });
      } else {
        commit({
          type: MUTATION.SET_CURRENT_LOCALE,
          data: storedLocale,
        });
      }
    },
    [ACTION.UPDATE_CURRENT_LOCALE]({commit}, payload) {
      commit({
        type: MUTATION.UPDATE_CURRENT_LOCALE,
        data: payload.locale,
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
    [ACTION.SEARCH_VENUES]({commit}, payload) {
      axios.get('https://api.foursquare.com/v2/venues/search?oauth_token=' +
      this.$auth.$storage.getLocalStorage('_token.social').split(' ')[1] +
      '&v=' + this.state.apiVersion +
      '&locale=' + this.$auth.$storage.getUniversal('locale', false) +
      '&ll=' + Object.values(this.state.position).join(',') +
      '&radius=' + payload.radiusMeters +
      '&query=' + (payload.query !== undefined
        ? new URLSearchParams(payload.query).toString()
        : '') +
      '&categoryId=' + (payload.categoryId !== undefined
        ? payload.categoryId
        : '') +
      '&intent=browse')
      .then((res) => {
        const venues = res.data.response.venues;
        // add 'isChecked' key to use in venueList
        venues.map((venue) => {
          venue.isChecked = false;
          venue.showEditDialog = false;
          return venue;
        });
        commit({
          type: MUTATION.SET_SEARCHED_VENUES,
          data: venues,
        });
      });
    },
    [ACTION.SET_SEARCH_QUERY]({commit}, payload) {
      // Set raw string (non-encoded query).
      // Encode process will execute at SEARCH_VENUES action.
      commit({
        type: MUTATION.SET_SEARCH_QUERY,
        data: payload.query,
      });
    },
    [ACTION.SET_SEARCH_CATEGORY]({commit}, payload) {
      // Set category IDs ()
      commit({
        type: MUTATION.SET_SEARCH_CATEGORY,
        data: payload.categoryId,
      });
    },
    [ACTION.FETCH_SPECIFIC_VENUE_DETAIL]({commit}, payload) {
      axios.get('https://api.foursquare.com/v2/venues/' +
      payload.venueId +
      '?oauth_token=' +
      this.$auth.$storage.getLocalStorage('_token.social').split(' ')[1] +
      '&v=' + this.state.apiVersion +
      '&locale=' + this.$auth.$storage.getUniversal('locale', false))
      .then((res) => {
        console.log(res.data.response);
        commit({
          type: MUTATION.SET_SPECIFIC_VENUE_DETAIL,
          data: res.data.response,
        });
      });
    },
    [ACTION.UPDATE_MAP_HEIGHT]({commit}, payload) {
      commit({
        type: MUTATION.SET_MAP_HEIGHT,
        data: payload.height,
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
    [MUTATION.SET_CURRENT_LOCALE](state, payload) {
      state.locale = payload.data;
    },
    [MUTATION.UPDATE_CURRENT_LOCALE](state, payload) {
      this.$auth.$storage.setUniversal('locale', payload.data, false);
    },
    [MUTATION.SET_ALL_CATEGORIES](state, payload) {
      state.categories = payload.data;
    },
    [MUTATION.SET_CURRENT_POSITION](state, payload) {
      state.position.lat = payload.data.lat;
      state.position.lng = payload.data.lng;
    },
    [MUTATION.SET_SEARCHED_VENUES](state, payload) {
      state.searchedVenues = payload.data;
    },
    [MUTATION.SET_SEARCH_QUERY](state, payload) {
      state.searchQuery = payload.data;
    },
    [MUTATION.SET_SEARCH_CATEGORY](state, payload) {
      state.searchCategory = payload.data;
    },
    [MUTATION.SET_SPECIFIC_VENUE_DETAIL](state, payload) {
      state.specificVenueDetail = payload.data;
    },
    [MUTATION.SET_SPECIFIC_VENUE_DETAIL_FETCH_STATUS](state, payload) {
      state.fetchedSpecificVenueDetail = payload.data;
    },
    [MUTATION.SET_MAP_HEIGHT](state, payload) {
      state.initMapHeight = payload.data;
    },
  },
});

export default store;
