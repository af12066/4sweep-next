<template>
  <l-map
    ref="map"
    :zoom="zoom"
    :center="centerPosition"
    style="z-index: 1;"
  >
    <v-toolbar
      dense
      floating
      class="toolbar-on-map"
    >
      <v-menu :nudge-width="100">
        <v-toolbar-title
          slot="activator"
        >
          <span>{{ $store.state.searchRadius }} [m]</span>
          <v-icon dark>arrow_drop_down</v-icon>
        </v-toolbar-title>

        <v-list>
          <v-list-tile
            v-for="radius in radiusMeters"
            :key="radius"
            @click="updateCurrentRadius(radius)"
          >
            <v-list-tile-title v-text="radius" />
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <l-tile-layer
      :url="url"
      :attribution="attribution"
    />
    <l-marker
      :lat-lng="marker.position"
      :draggable="marker.draggable"
      @moveend="setMoveEndPositions"
    />
    <l-marker
      v-for="(venue, index) in icon"
      :key="index"
      :lat-lng="venue.position"
      :icon="venue.icon"
      @mouseover="showtooltip(venue.name)"
    />
  </l-map>
</template>

<style scoped>
.toolbar-on-map {
  z-index: 401;
  margin-top: 12px !important;
  margin-left: 60px;
}
</style>


<script>
import * as type from '../store/action-types';
import 'leaflet/dist/leaflet.css';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  data() {
    return {
      zoom: 13,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // eslint-disable-next-line
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      marker: {
        position: {
          lat: this.$store.getters.currentMarkerPosition.lat,
          lng: this.$store.getters.currentMarkerPosition.lng,
        },
        draggable: true,
        visible: true,
      },
      icon: [],
      radiusMeters: [100, 200, 500, 1000, 5000, 10000, 50000, 100000],
      currentRadius: 1000,
    };
  },
  computed: {
    venueIcons() {
      return this.$store.getters.searchedVenueLeafletMarkerInfo;
    },
    centerPosition() {
      return L.latLng(
        this.$store.getters.currentMarkerPosition.lat,
        this.$store.getters.currentMarkerPosition.lng
      );
    },
  },
  watch: {
    venueIcons: {
      handler: function(val) {
        this.icon = val;
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick()
    .then(() => {
      this.setMapHeight(this.$refs.map.$el.offsetHeight - 100);
    });
  },
  methods: {
    setMoveEndPositions() {
      this.$store.dispatch(type.SET_CURRENT_POSITION, {
        lat: this.marker.position.lat,
        lng: this.marker.position.lng,
      })
      .then(() => {
        this.$store.dispatch(type.SEARCH_VENUES, {
          query: this.$store.state.searchQuery,
          categoryId: this.$store.state.searchCategoryIds,
        });
      });
    },
    updateCurrentRadius(newRadius) {
      this.$store.state.searchRadius = newRadius;
    },
    setMapHeight(h) {
      this.$store.dispatch(type.UPDATE_MAP_HEIGHT, {
        height: h,
      });
    },
  },
};
</script>
