<template>
  <l-map
    ref="map"
    :zoom="zoom"
    :center="center"
    style="z-index: 1;">
    <l-tile-layer
      :url="url"
      :attribution="attribution" />
    <l-marker
      :lat-lng="marker.position"
      :draggable="marker.draggable"
      @moveend="setMoveEndPositions" />
  </l-map>
</template>

<script>
import * as type from '../store/action-types';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
import {LMap, LTileLayer, LMarker} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data() {
    return {
      zoom: 13,
      center: L.latLng(
        this.$store.getters.currentMarkerPosition.lat,
        this.$store.getters.currentMarkerPosition.lng
      ),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      marker: {
        position: {
          lat: this.$store.getters.currentMarkerPosition.lat,
          lng: this.$store.getters.currentMarkerPosition.lng,
        },
        draggable: true,
        visible: true,
      },
    };
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
          radiusMeters: 100,
        });
      });
    },
    setMapHeight(h) {
      this.$store.dispatch(type.UPDATE_MAP_HEIGHT, {
        height: h,
      });
    },
  },
};
</script>
