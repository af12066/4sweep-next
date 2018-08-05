<template>
  <v-card
    flat>
    <v-toolbar
      ref="toolbar"
      card
      prominent>
      <v-toolbar-title
        class="body-2 grey--text">
        Search Results
      </v-toolbar-title>
    </v-toolbar>
    <div
      :style="`height: ${this.$store.state.initMapHeight
      - toolbarHeight}px;
      overflow-y: scroll`">
      <v-list two-line>
        <v-subheader>
          <v-flex xs1>
            <v-checkbox
              v-model="allChecked"
              class="mr-0" />
          </v-flex>
        </v-subheader>
        <template v-for="(venue, index) in searchedVenues">
          <v-divider
            v-if="index > 0"
            :key="index"
            :inset="true" />
          <v-list-tile
            :key="venue.id"
            avatar
            @click="">
            <v-list-tile-action>
              <v-checkbox
                v-model="venue.isChecked" />
            </v-list-tile-action>
            <v-list-tile-avatar
              tile>
              <img
                :src="venue.categories[0].icon.prefix +
                'bg_44' + venue.categories[0].icon.suffix">
            </v-list-tile-avatar>
            <v-list-tile-content
              @click="editDialog(venue, index)">
              <v-dialog
                v-model="venue.showEditDialog"
                width="500">
                <v-card>
                  <v-card-title>
                    <div class="headline">Use Google's location service?</div>
                  </v-card-title>
                  <v-card-text>Let Google help apps determine location.
                  This means sending anonymous location data to Google,
                  even when no apps are running.</v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      class="green--text darken-1"
                      flat
                      @click="venue.showEditDialog = false">Disagree</v-btn>
                    <v-btn
                      class="green--text darken-1"
                      flat
                      @click="venue.showEditDialog = false">Agree</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-list-tile-title>
                {{ venue.name }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ venue.categories.map((category) => {
                  return category.name;
                }).join(', ') }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </div>
  </v-card>
</template>

<script>
import * as type from '../store/action-types';

export default {
  data() {
    return {
      toolbarHeight: 0,
      allChecked: false,
      toggle_none: null,
    };
  },
  computed: {
    searchedVenues() {
      return this.$store.getters.searchedVenues;
    },
  },
  watch: {
    allChecked: function() {
      this.$store.state.searchedVenues.map((venue) => {
        venue.isChecked = this.allChecked;
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.toolbarHeight = this.$refs.toolbar.heights.desktop;
    });
  },
  methods: {
    editDialog: function(venueObject, index) {
      this.$store.dispatch(
        type.FETCH_SPECIFIC_VENUE_DETAIL,
        {venueId: venueObject.id},
      )
      .then(() => {
        venueObject.showEditDialog
          = !venueObject.showEditDialog;
      });
    },
  },
};
</script>
