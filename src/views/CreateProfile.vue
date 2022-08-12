<template>
  <div class="container pt-4" style="max-width: 45rem;">
    <div v-if="error" class="alert alert-danger mb-3" role="alert">
      {{error}}
    </div>
    <h1>Create Your Profile</h1>
    <div class="form-group">
      <input v-model="username" type="text" class="form-control" placeholder="Username" aria-label="Username">
    </div>
    <button v-on:click="createProfile" type="button" class="btn btn-primary">Create Profile</button>
  </div>
</template>

<script>
import { db } from '../db'
import firebase from 'firebase/app'
import store from '@/store'
import router from '@/router'

export default {
  name: 'create-profile',
  components: {
  },
  data () {
    return {
      username: '',
      error: null
    }
  },
  created () {
    if (store.state.currentUser === null) {
      router.push('/')
    }

    if (store.state.currentProfile !== null) {
      router.push('/')
    }
  },
  watch: {
  },
  methods: {
    createProfile () {
      let that = this
      this.error = null
      if (!this.error & store.state.currentProfile !== null) {
        this.error = 'You already have a profile'
      }
      if (!this.error & this.username === '') {
        this.error = 'Username cannot be blank'
      }
      if (!this.error & this.username.length < 3) {
        this.error = 'Username cannot be less than 3 characters'
      }

      if (!this.error) {
        db.collection('users').doc(this.username)
          .get()
          .then(function (doc) {
            if (doc.exists) {
              that.error = 'Username taken'
            } else {
              // doc.data() will be undefined in this case
              db.collection('users').doc(that.username).set({
                uid: store.state.currentUser.uid,
                joined: firebase.firestore.FieldValue.serverTimestamp()
              })
                .then(function () {
                  window.location = '/'
                })
                .catch(function (error) {
                  that.error = error
                })
            }
          })
          .catch(function (error) {
            that.error = error
          })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$white: #d7dadc;
$grey: #818384;
$orange: #ff4500;
$blue: #7292ff;
$background-black: #030303;
$background-grey: #1a1a1b;
$background-intermediate: #151515;
$border: #343536;

.create-profile {
  background-color: $background-grey;
  flex-grow: 1;
  margin-bottom: 32px;
  border: 1px solid $border;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  input, textarea {
    margin: 8px;
    flex-grow: 1;
    height: 38px;
    padding: 0px 16px;
    color: $grey;
    border: 1px solid $border;
    border-radius: 4px;
    background-color: #272729;
    &:hover, &:focus {
      border-color: $white;
      background-color: $background-grey;
    }
  }
  .error-message {
    margin: 8px;
    color: red;
  }
  .submit {
    background-color: $white;
    border: 1px solid $white;
    border-radius: 4px;
    color: $background-black;
    font-size: 12px;
    font-weight: 700;
    width: 120px;
    height: 32px;
    margin: 8px;
  }
}
</style>
