<template>
  <v-card
    flat
  >
    <v-toolbar
      ref="toolbar"
      card
      prominent
    >
      <v-toolbar-title
        class="body-2 grey--text"
      >
        Search Results
      </v-toolbar-title>
    </v-toolbar>
    <div
      :style="`height: ${this.$store.state.initMapHeight
      - toolbarHeight}px;
      overflow-y: scroll`"
    >
      <v-list two-line>
        <v-subheader>
          <v-flex xs1>
            <v-checkbox
              v-model="allChecked"
              class="mr-0"
            />
          </v-flex>
        </v-subheader>
        <template v-for="(venue, index) in searchedVenues">
          <v-divider
            v-if="index > 0"
            :key="index"
            :inset="true"
          />
          <v-list-tile
            :key="venue.id"
            avatar
            @click=""
          >
            <v-list-tile-action>
              <v-checkbox
                v-model="venue.isChecked"
              />
            </v-list-tile-action>
            <v-list-tile-avatar
              tile
            >
              <img
                :src="venue.categories[0].icon.prefix +
                'bg_44' + venue.categories[0].icon.suffix"
              >
            </v-list-tile-avatar>
            <v-list-tile-content
              @click="editDialog(venue, index)"
            >
              <EditDialog
                :venue="venue"
              />
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
import EditDialog from '~/components/editdialog';

export default {
  components: {
    EditDialog,
  },
  data() {
    return {
      toolbarHeight: 0,
      allChecked: false,
      toggle_none: null,
      editForm: {
        'name': '',
        'name:en': '',
        'name:ja': '',
        'phone': '',
        'postalCode': '',
        'address': '',
        'crossStreet': '',
        'city': '',
        'state': '',
        'twitter': '',
        'facebook': '',
        'instagram': '',
      },
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
