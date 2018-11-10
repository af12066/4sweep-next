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
          v-once
          class="display-3 font-weight-regular"
        >
          {{ $store.state.defaultTitle }}
        </h1>
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
        xs12
        sm8
        offset-sm2
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
  head() {
    return {
      title: this.$store.state.defaultTitle,
    };
  },
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
