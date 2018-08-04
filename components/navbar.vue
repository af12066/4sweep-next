<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :stateless="dialog"
      absolute
      temporary
      app>
      <v-list
        v-if="isAuthenticated"
        two-line>
        <v-list-tile
          :href="$store.state.user.canonicalUrl"
          target="_blank"
          rel="noopener noreferrer"
          avatar
          @click="">
          <v-list-tile-avatar>
            <img
              :src="$store.state.avatarURL"
              alt="your avatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ $store.state.user.firstName }}
            </v-list-tile-title>
            <v-list-tile-sub-title
              v-if="$store.state.user.superuser !== undefined">
              Superuser Level {{ $store.state.user.superuser }}
            </v-list-tile-sub-title>
            <v-list-tile-sub-title
              v-else>
              Not a superuser
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list dense>
        <v-divider
          v-if="isAuthenticated" />
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
        <v-dialog
          v-if="isAuthenticated"
          v-model="dialog"
          scrollable
          max-width="20rem"
          style="display: block;">
          <v-list-tile
            slot="activator"
            @click="">
            <v-list-tile-action>
              <v-icon>language</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                Locale
                <span
                  class="caption">
                  (Current: {{ $auth.$storage.getUniversal('locale', false) }})
                </span>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-card>
            <v-card-title>Select Locale</v-card-title>
            <v-divider />
            <v-card-text style="height: 300px;">
              <v-radio-group
                v-model="selectedLocale"
                column>
                <v-radio
                  v-for="locale in locales"
                  :key="locale"
                  :label="locale"
                  :value="locale"
                  color="indigo" />
              </v-radio-group>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn
                color="indigo darken-1"
                flat
                @click.native="dialog = false">
                Close
              </v-btn>
              <v-btn
                color="indigo darken-1"
                flat
                @click.native="updateLocale">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="indigo"
      dark
      tabs>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-once>
        {{ $store.state.defaultTitle }}
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          v-if="isAuthenticated"
          flat
          @click="logout">
          <img
            :src="$store.state.avatarURL"
            alt="your avatar"
            class="avatar">
          Sign out
        </v-btn>
        <v-btn
          v-else
          flat
          @click="authenticate">Sign in</v-btn>
      </v-toolbar-items>
      <v-tabs
        v-if="isAuthenticated"
        slot="extension"
        v-model="tab"
        color="indigo"
        align-with-title>
        <v-tabs-slider color="yellow" />
        <v-tab
          v-for="item in tabItems"
          :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items
      v-if="isAuthenticated"
      v-model="tab">
      <v-tab-item
        v-for="item in tabItems"
        :key="item">
        <v-card flat>
          <v-form
            v-if="item == 'Venue Search'"
            ref="form"
            v-model="valid">
            <v-container>
              <v-layout
                row
                wrap>
                <v-flex
                  xs12
                  sm4
                  offset-sm1>
                  <v-text-field
                    v-model="query"
                    label="Query"
                    required />
                </v-flex>
                <v-flex
                  xs12
                  sm4>
                  <v-combobox
                    v-model="selectedCategories"
                    :items="Object.keys(allCategories)"
                    label="Categories (Optional)"
                    multiple />
                </v-flex>
                <v-flex
                  xs12
                  sm2>
                  <v-btn
                    :disabled="!valid"
                    @click="searchByVenueName">Search</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
          <v-form
            v-else-if="item == 'Specific Venue'"
            ref="form"
            v-model="valid">
            <v-container>
              <v-layout
                row
                wrap>
                <v-flex
                  xs12
                  sm6
                  offset-sm2>
                  <v-text-field
                    v-model="venueId"
                    label="Foursquare Venue ID"
                    required />
                </v-flex>
                <v-flex
                  xs12
                  sm2>
                  <v-btn
                    :disabled="!valid"
                    @click="submit">Search</v-btn>
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
  import * as type from '../store/action-types';

  export default {
    data() {
      return {
        tab: null,
        valid: true,
        query: '',
        venueId: '',
        dialog: false,
        drawer: false,
        tabItems: [
          'Venue Search',
          'Specific Venue',
        ],
        locales: [
          'en', 'es', 'fr', 'de', 'it', 'ja',
          'th', 'tr', 'ko', 'ru', 'pt', 'id',
        ],
        selectedLocale: '',
        selectedCategories: [],
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
    mounted() {
      this.selectedLocale = this.$store.state.locale;
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
      updateLocale() {
        this.dialog = false;
        this.$store.dispatch(
          type.UPDATE_CURRENT_LOCALE,
          {locale: this.selectedLocale},
        )
        .then(() => {
          this.$store.dispatch(
            type.FETCH_ALL_CATEGORIES,
          );
        });
      },
      searchByVenueName() {
        this.$store.dispatch(
          type.SET_SEARCH_QUERY,
          {query: this.query}
        )
        .then(() => {
          const categoryId = this.selectedCategories.map((categoryKey) => {
            return this.allCategories[categoryKey];
          }).join(',');
          this.$store.dispatch(
            type.SET_SEARCH_CATEGORY,
            {categoryId},
          )
          .then(() => {
            this.$store.dispatch(
              type.SEARCH_VENUES,
              {
                radiusMeters: 100,
                query: this.query,
                categoryId,
              },
            );
          });
        });
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
