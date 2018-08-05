<template>
  <v-app id="inspire">
    <nav-bar />
    <v-content>
      <v-container
        fluid
        fill-height
      >
        <nuxt />
      </v-container>
    </v-content>
    <vfooter />
  </v-app>
</template>

<script>
import NavBar from '~/components/navbar';
import Vfooter from '~/components/vfooter';

export default {
  components: {
    NavBar,
    Vfooter,
  },
};
</script>

