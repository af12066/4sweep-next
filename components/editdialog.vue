<template>
  <v-dialog
    v-model="venue.showEditDialog"
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <div class="headline">Edit
          <a
            :href="`https://foursquare.com/v/${venue.id}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ venue.name }}
          </a>
        </div>
      </v-card-title>
      <v-card-text>
        <v-container
          grid-list-md
        >
          <v-layout
            wrap
          >
            <v-flex
              xs12
              sm12
            >
              <v-text-field
                v-model="editVenueName"
                label="Name"
                required
              />
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <v-text-field
                v-model="editVenueNameEn"
                label="Name (en, Optional)"
              />
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <v-text-field
                v-model="editVenueNameJa"
                label="Name (ja, Optional)"
              />
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <v-text-field
                v-model="editVenuePhone"
                v-validate="'numeric'"
                data-vv-name="Phone"
                :error-messages="errors.collect('Phone')"
                label="Phone"
              />
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <v-text-field
                v-model="editVenuePostalCode"
                label="Postal Code"
              />
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <v-text-field
                v-model="editVenueAddress"
                label="Address"
              />
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <v-text-field
                v-model="editVenueCrossStreet"
                label="Cross Street"
              />
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <v-text-field
                v-model="editVenueCity"
                label="City"
              />
            </v-flex>
            <v-flex
              xs12
              sm6
            >
              <v-text-field
                v-model="editVenueState"
                label="State"
              />
            </v-flex>
            <v-flex
              xs12
              sm4
            >
              <v-text-field
                v-model="editVenueTwitter"
                v-validate="'alpha_dash|max:50'"
                data-vv-name="Twitter"
                :error-messages="errors.collect('Twitter')"
                label="Twitter"
              />
            </v-flex>
            <v-flex
              xs12
              sm4
            >
              <v-text-field
                v-model="editVenueFacebook"
                v-validate="{
                  regex: /^https:\/\/www\.facebook\.com\/[A-Za-z0-9\._-]{0,49}[A-Za-z0-9]$/,
                }"
                data-vv-name="Facebook"
                :error-messages="errors.collect('Facebook')"
                label="Facebook"
                placeholder="https://www.facebook.com/username"
              />
            </v-flex>
            <v-flex
              xs12
              sm4
            >
              <v-text-field
                v-model="editVenueInstagram"
                label="Instagram"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="green--text darken-1"
          flat
          @click="venue.showEditDialog = false"
        >Cancel</v-btn>
        <v-btn
          class="green--text darken-1"
          flat
          @click="submitForm(venue, index)"
        >Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    venue: {
      type: Object,
      required: true,
      default: function() {
        return {
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
        };
      },
    },
  },
  computed: {
    editVenueName: {
      get() {
        return this.$store.getters.specificVenueDetailForEditableStyle['name'];
      },
      set(value) {
        this.editForm.name = value;
      },
    },
    editVenueNameEn: {
      get() {
        return '';
      },
      set(value) {
        this.editForm['name:en'] = value;
      },
    },
    editVenueNameJa: {
      get() {
        return '';
      },
      set(value) {
        this.editForm['name:ja'] = value;
      },
    },
    editVenuePhone: {
      get() {
        return this.$store.getters.specificVenueDetailForEditableStyle['phone'];
      },
      set(value) {
        this.editForm.phone = value;
      },
    },
    editVenuePostalCode: {
      get() {
        return this.$store.getters.specificVenueDetailForEditableStyle['postalCode'];
      },
      set(value) {
        this.editForm.postalCode = value;
      },
    },
    editVenueAddress: {
      get() {
        return this.$store.getters.specificVenueDetailForEditableStyle['address'];
      },
      set(value) {
        this.editForm.address = value;
      },
    },
    editVenueCrossStreet: {
      get() {
        return this.$store.getters.specificVenueDetailForEditableStyle['crossStreet'];
      },
      set(value) {
        this.editForm.crossStreet = value;
      },
    },
    editVenueCity: {
      get() {
        return this.$store.getters.specificVenueDetailForEditableStyle['city'];
      },
      set(value) {
        this.editForm.city = value;
      },
    },
    editVenueState: {
      get() {
        return this.$store.getters.specificVenueDetailForEditableStyle['state'];
      },
      set(value) {
        this.editForm.state = value;
      },
    },
    editVenueTwitter: {
      get() {
        return this.$store.getters.specificVenueDetailForEditableStyle['twitter'];
      },
      set(value) {
        this.editForm.twitter = value;
      },
    },
    editVenueFacebook: {
      get() {
        return this.$store.getters.specificVenueDetailForEditableStyle['facebook'];
      },
      set(value) {
        this.editForm.facebook = value;
      },
    },
    editVenueInstagram: {
      get() {
        return this.$store.getters.specificVenueDetailForEditableStyle['instagram'];
      },
      set(value) {
        this.editForm.instagram = value;
      },
    },
  },
  methods: {
    submitForm: function(venueObject, index) {
      console.log(this.editForm);
      venueObject.showEditDialog
        = !venueObject.showEditDialog;
    },
  },
};
</script>
