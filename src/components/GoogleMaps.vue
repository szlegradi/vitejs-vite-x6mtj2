<template>
  <gmap-map :center="center" :zoom="zoom" map-type-id="roadmap">
    <gmap-info-window
      :options="infoOptions"
      :position="infoWindowPosition"
      :opened="infoWinOpen"
      @close-click="infoWinOpen = false"
    />

    <gmap-marker
      v-for="(marker, index) in locations"
      :key="index"
      :options="markerOptions(marker, index)"
      :position="marker.position"
      :clickable="true"
      @click="
        () => {
          toggleInfoWindow(marker, index);
          $emit('toggle-location-selection', { marker, index });
        }
      "
      @mouseover="$emit('scroll-to', index)"
    />
  </gmap-map>
</template>

<script>
import Vue from 'vue';
import GmapVue from 'gmap-vue';

Vue.use(GmapVue, {
  load: {
    key: '',
    libraries: 'places',
    language: 'en',
  },
  installComponents: true,
});

const activeMarker = {
  path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
  fillColor: '',
  fillOpacity: 1,
  strokeWeight: 2,
  scale: 1,
};

export default {
  name: 'GoogleMaps',

  props: {
    locations: {
      type: Array,
      default: () => [],
    },

    selectedIndex: {
      type: Number,
      default: 0,
    },

    markerFillColor: {
      type: String,
      default: '#2ed5ad',
    },
  },

  data() {
    return {
      form: {
        zip: null,
      },
      showErrorMessage: false,
      infoWindowPosition: null,
      infoWinOpen: false,
      currentIndex: null,
      infoOptions: {
        content: '',
        // optional: offset infowindow so it visually sits nicely on top of our marker
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
    };
  },

  computed: {
    center() {
      return (
        this.locations?.[0]?.position || { lat: 39.829351, lng: -98.577162 }
      );
    },
    hasLocation() {
      return this.locations?.length;
    },
    zoom() {
      return this.hasLocation ? 11 : 4;
    },
  },

  watch: {
    selectedIndex() {
      this.currentIndex = this.selectedIndex >= 0 ? this.selectedIndex : null;
    },
  },

  created() {
    activeMarker.fillColor = this.markerFillColor;
  },

  methods: {
    setActiveMarkerIndex(index) {
      index < 0 ? (this.currentIndex = null) : (this.currentIndex = index);
    },
    markerOptions(location, index) {
      return {
        label:
          this.currentIndex === index
            ? ''
            : (
                this.locations.findIndex((loc) => loc.name === location.name) +
                1
              ).toString(),
        icon: this.currentIndex === index ? activeMarker : '',
      };
    },
    toggleInfoWindow(marker, index) {
      this.infoWindowPosition = marker.position;
      this.infoOptions.content = marker.infoText;

      // check if its the same marker that was selected if yes toggle
      if (this.currentIndex === index) {
        this.infoWinOpen = !this.infoWinOpen;
      } else {
        // if different marker set infowindow to open and reset current marker index
        this.infoWinOpen = true;
        this.currentIndex = index;
      }
    },
  },
};
</script>
