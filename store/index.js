import Vuex from 'vuex';
import axios from 'axios';
import {ACTION} from './action-types';
import {MUTATION} from './mutation-types';

const generateProposeEditQuery = (payload) => {
  let query = '';
  Object.keys(payload).forEach(function(key) {
    const val = payload[key];
    if (val !== '') {
      query = query + `&${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    }
  });
  return query;
};

const store = () => new Vuex.Store({
  state: {
    defaultTitle: '4sweep-next',
    initMapHeight: 0,
    user: {},
    cat: [],
    categories: {}, // {'categoryName': 'categoryValue', ...}
    // eslint-disable-next-line
    avatarURL: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // dummy image
    apiVersion: '20180705',
    position: {
      lat: 35.681155,
      lng: 139.766893,
    },
    searchQuery: '',
    searchCategory: '',
    searchedVenues: [],
    specificVenueDetail: {},
    proposeEditStatus: {}, // {'code': 200, 'requestId': 'abcdef012345'}
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
          twitter: state.specificVenueDetail.venue.contact.twitter, // eslint-disable-next-line
          facebook: state.specificVenueDetail.venue.contact.facebookUsername === undefined ? '' : `https://www.facebook.com/${state.specificVenueDetail.venue.contact.facebookUsername}`,
          instagram: state.specificVenueDetail.venue.contact.instagram,
          address: state.specificVenueDetail.venue.location.address,
          crossStreet: state.specificVenueDetail.venue.location.crossStreet,
          postalCode: state.specificVenueDetail.venue.location.postalCode,
          city: state.specificVenueDetail.venue.location.city,
          state: state.specificVenueDetail.venue.location.state,
        };
      }
    },
    proposeEditStatus: (state) => {
      return state.proposeEditStatus;
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
    [ACTION.PROPOSE_EDIT]({commit}, payload) {
      const proposeQuery = generateProposeEditQuery(payload.proposeValues);
      axios.post(`https://api.foursquare.com/v2/venues/${payload.venueId}/proposeedit` +
      '?oauth_token=' +
      this.$auth.$storage.getLocalStorage('_token.social').split(' ')[1] +
      '&v=' + this.state.apiVersion +
      '&locale=' + this.$auth.$storage.getUniversal('locale', false) +
      proposeQuery
      )
      .then((res) => {
        commit({
          type: MUTATION.UPDATE_PROPOSE_EDIT_STATUS,
          data: {
            code: res.status,
            requestId: res.data.meta.requestId,
          },
        });
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
    [MUTATION.UPDATE_PROPOSE_EDIT_STATUS](state, payload) {
      state.proposeEditStatus = payload.data;
    },
  },
});

export default store;
