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
                :src="venue.categories.length > 0
                  ? `${venue.categories[0].icon.prefix}bg_44${venue.categories[0].icon.suffix}`
                : 'https://foursquare.com/img/categories_v2/none_bg_44.png'"
              >
            </v-list-tile-avatar>
            <v-list-tile-content
              @click="editDialog(venue)"
            >
              <EditDialog
                :venue="venue"
              />
              <v-list-tile-title>
                {{ venue.name }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ generateSubTitle(venue) }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </div>
    <v-snackbar
      v-model="showProposeEditSnackbar"
      :right="true"
      :top="true"
      :color="proposeEditSnackBarContent.color"
      :timeout="5000"
    >
      {{ proposeEditSnackBarContent.text }}
    </v-snackbar>
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
      showProposeEditSnackbar: false,
      proposeEditSnackBarContent: {
        text: '',
        color: '',
      },
    };
  },
  computed: {
    searchedVenues() {
      return this.$store.getters.searchedVenues;
    },
    proposeEditStatus() {
      return this.$store.getters.proposeEditStatus;
    },
  },
  watch: {
    allChecked: function() {
      this.$store.state.searchedVenues.map((venue) => {
        venue.isChecked = this.allChecked;
      });
    },
    proposeEditStatus: {
      handler: function(val) {
        if (val.code === 200) {
          this.proposeEditSnackBarContent.text = 'Your proposal is submitted!';
          this.proposeEditSnackBarContent.color = 'success';
        } else {
          this.proposeEditSnackBarContent.text = 'An error has occured.';
          this.proposeEditSnackBarContent.color = 'error';
        }
        this.showProposeEditSnackbar = true;
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.toolbarHeight = this.$refs.toolbar.heights.desktop;
    });
  },
  methods: {
    editDialog: function(venueObject) {
      this.$store.dispatch(
          type.FETCH_SPECIFIC_VENUE_DETAIL,
          {venueId: venueObject.id},
      )
          .then(() => {
            venueObject.showEditDialog
          = !venueObject.showEditDialog;
          });
    },
    generateSubTitle: function(venueObject) {
      if (venueObject.categories.length > 0) {
        return venueObject.categories.map((category) => {
          return category.name;
        }).join(', ');
      } else {
        return 'Uncategorized';
      }
    },
  },
};
</script>
