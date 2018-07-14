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
    <v-card-text
      :style="`height: ${this.$store.state.initMapHeight
      - toolbarHeight}px;
      overflow-y: scroll`"
    >
      <template
        v-for="(venue, index) in searchedVenues"
      >
        <div
          :key="index"
          class="hogetest"
        >
          <p>{{ venue.name }}</p>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  data() {
    return {
      toolbarHeight: 0,
    };
  },
  computed: {
    searchedVenues() {
      return this.$store.getters.searchedVenues;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.toolbarHeight = this.$refs.toolbar.heights.desktop;
    });
  },
};
</script>
