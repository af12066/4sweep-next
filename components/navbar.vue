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
      tabs
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-once>
        {{ $store.state.defaultTitle }}
      </v-toolbar-title>
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
      <v-tabs
        v-if="isAuthenticated"
        slot="extension"
        v-model="tab"
        color="indigo"
        align-with-title
      >
        <v-tabs-slider color="yellow" />
        <v-tab
          v-for="item in tabItems"
          :key="item"
        >
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items
      v-if="isAuthenticated"
      v-model="tab"
    >
      <v-tab-item
        v-for="item in tabItems"
        :key="item"
      >
        <v-card flat>
          <v-form
            v-if="item == 'Venue Search'"
            ref="form"
            v-model="valid"
          >
            <v-container>
              <v-layout
                row
                wrap
              >
                <v-flex
                  xs12
                  sm4
                  offset-sm1
                >
                  <v-text-field
                    v-model="query"
                    label="Query"
                    required />
                </v-flex>
                <v-flex
                  xs12
                  sm4
                >
                  <v-combobox
                    v-model="select"
                    :items="allCategories"
                    label="Categories (Optional)"
                    multiple />
                </v-flex>
                <v-flex
                  xs12
                  sm2
                >
                  <v-btn
                    :disabled="!valid"
                    @click="submit"
                  >Search</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
          <v-form
            v-else-if="item == 'Specific Venue'"
            ref="form"
            v-model="valid"
          >
            <v-container>
              <v-layout
                row
                wrap
              >
                <v-flex
                  xs12
                  sm6
                  offset-sm2
                >
                  <v-text-field
                    v-model="venueId"
                    label="Foursquare Venue ID"
                    required />
                </v-flex>
                <v-flex
                  xs12
                  sm2
                >
                  <v-btn
                    :disabled="!valid"
                    @click="submit"
                  >Search</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tab: null,
        valid: true,
        query: '',
        venueId: '',
        drawer: false,
        tabItems: [
          'Venue Search',
          'Specific Venue',
        ],
        select: [],
      };
    },
    computed: {
      isAuthenticated() {
        return this.$auth.loggedIn;
      },
      allCategories() {
        return this.$store.getters.allCategories;
      },
    },
    methods: {
      authenticate() {
        this.$auth.loginWith('social');
      },
      logout() {
        this.$auth.logout();
      },
      submit() {
        console.log('submitted');
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
