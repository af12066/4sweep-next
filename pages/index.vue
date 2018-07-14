<template>
  <v-jumbotron>
    <v-layout
      row
      text-xs-center
    >
      <v-flex
        xs12
      >
        <h1
          class="display-3 font-weight-regular"
        >4sweep-next</h1>
        <p class="subheading">
          Next generation 4sweep, which help all superusers to edit venues.
        </p>
      </v-flex>
    </v-layout>
    <v-layout
      row
      text-xs-center
    >
      <v-flex
        xs6
        offset-xs3
      >
        <v-btn
          dark
          class="pink"
          large
          @click="authenticate"
        >Sign in with Foursquare</v-btn>
      </v-flex>
    </v-layout>
  </v-jumbotron>
</template>

<script>
  export default {
    middleware: [
      'auth',
    ],
    methods: {
      authenticate() {
        this.$auth.loginWith('social');
      },
    },
  };
</script>

<style scoped>
.subheading {
  padding: 1rem 0;
}
</style>
