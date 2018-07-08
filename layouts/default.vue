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
  </v-app>
</template>

<script>
import NavBar from '~/components/navbar';

export default {
  components: {
    NavBar,
  },
};
</script>

