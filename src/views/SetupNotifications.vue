<template>
  <div class="container pt-4" style="max-width: 45rem;">
    <div v-if="error" class="alert alert-danger mb-3" role="alert">
      {{error}}
    </div>
    <h1>Setup Notifications</h1>
    <h6 v-if="currentProfile">Current key:
      <span v-if="currentProfile.pushover">{{currentProfile.pushover}}</span>
      <span v-else>
        Not yet set
      </span>
    </h6>
    <div class="form-group">
      <input v-model="key" type="text" class="form-control" placeholder="Pushover Token" aria-label="Pushover Token">
    </div>
    <p><small>Reddit-Clone uses <a href="https://pushover.net/">Pushover</a> for notification delivery.</small></p>
    <button v-on:click="updateToken" type="button" class="btn btn-primary">Update Pushover Token</button>
  </div>
</template>

<script>
import store from '@/store'
import { db } from '../db'

export default {
  name: 'setup-notifications',
  data () {
    return {
      key: '',
      error: null
    }
  },
  computed: {
    currentProfile: function () {
      return store.state.currentProfile
    }
  },
  watch: {
  },
  methods: {
    updateToken () {
      if (store.state.currentProfile) {
        db.collection('users').doc(store.state.currentProfile.id).update({
          pushover: this.key
        })
          .then(function () {
            window.location = '/'
          })
          .catch(function (error) {
            this.error = error
          })
      } else {
        this.error = 'You do not have a profile yet.'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  h6 {
    color: #818384;
  }
  small {
    color: #818384;
  }
</style>
