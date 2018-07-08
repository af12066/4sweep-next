<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      app
    >
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Contact</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="indigo"
      dark
      fixed
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>4sweep-next</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          v-if="isAuthenticated"
          flat
          @click="logout"
        >
          <img
            :src="$store.state.avatarURL"
            alt="your avatar"
            class="avatar"
          >
          Sign out
        </v-btn>
        <v-btn
          v-else
          flat
          @click="authenticate"
        >Sign in</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        drawer: false,
      };
    },
    computed: {
      isAuthenticated() {
        return this.$auth.loggedIn;
      },
    },
    methods: {
      authenticate() {
        this.$auth.loginWith('social');
      },
      logout() {
        this.$auth.logout();
      },
    },
  };
</script>
<style scoped>
  img.avatar {
  margin: 0 10px;
  border-radius: 3px;
  width: 30px;
}
</style>
