<template>
  <v-layout
    row
    wrap>
    <v-flex
      xs6>
      <VenueList />
    </v-flex>
    <v-flex
      xs6>
      <Map />
    </v-flex>
  </v-layout>
</template>

<script>
import * as type from '../store/action-types';
import Map from '~/components/map';
import VenueList from '~/components/venuelist';

export default {
  head() {
    return {
      title: `Dashboard | ${this.$store.state.defaultTitle}`,
    };
  },
  components: {
    Map,
    VenueList,
  },
  middleware: [
    'auth',
  ],
  created() {
    this.$store.dispatch(type.SET_CURRENT_LOCALE)
    .then(() => {
      this.$store.dispatch(type.FETCH_SELF_USER_DATA);
      this.$store.dispatch(type.FETCH_ALL_CATEGORIES);
    });
  },
};
</script>

