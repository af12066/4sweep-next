<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs4
    >
      <h1>Login Completed!</h1>
    </v-flex>
    <v-flex
      xs8
    >
      <Map />
    </v-flex>
  </v-layout>
</template>

<script>
import * as type from '../store/action-types';
import Map from '~/components/map';

export default {
  components: {
    Map,
  },
  middleware: [
    'auth',
  ],
  created() {
    this.$store.dispatch(type.FETCH_SELF_USER_DATA);
    this.$store.dispatch(type.FETCH_ALL_CATEGORIES);
  },
};
</script>

