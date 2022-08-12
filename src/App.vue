<template>
  <div>
    <!--Top navigation bar-->
    <nav class="navbar sticky-top navbar-expand-lg navbar-dark">
      <router-link :to="{ name: 'home' }" class="navbar-brand">
        <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <g>
            <circle fill="#FF4500" cx="10" cy="10" r="10"></circle>
            <path fill="#FFF"
              d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z">
            </path>
          </g>
        </svg>
        <div>Reddit-Clone</div>
      </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
        aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }" class="nav-link">Home</router-link>
          </li>
        </ul>
        <!--User is not logged in-->
        <div v-if="!currentUser">
          <button v-on:click="login" type="button" class="btn btn-secondary mr-3">Log in</button>
          <button v-on:click="signup" type="button" class="btn btn-primary">Sign up</button>
        </div>
        <!--User does not have profile-->
        <div v-if="currentUser && !currentProfile">
          <button v-on:click="goToCreateProfile" type="button" class="btn btn-secondary mr-3">Create Profile</button>
        </div>
        <!--User is logged in-->
        <div v-if="currentProfile" class="btn-group">
          <button class="btn btn-outline-light btn-sm dropdown-toggle" type="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img src="@/assets/avatar1.png" class="rounded" alt="avatar" style="width:24px;">
            {{ currentProfile.id }}
          </button>
          <div class="dropdown-menu dropdown-menu-lg-right">
            <router-link :to="{ name: 'user', params: { username: currentProfile.id } }" class="dropdown-item">Profile
            </router-link>
            <router-link to="/notifications" class="dropdown-item">Notifications</router-link>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="/" v-on:click="logout">Sign out</a>
          </div>
        </div>
      </div>
    </nav>
    <!--Router view-->
    <router-view />
  </div>
</template>

<script>
import { auth } from './auth'
import { db } from './db'
import firebase from 'firebase/app'
import store from './store'
import router from '@/router'

export default {
  name: 'app',
  computed: {
    currentUser: function () {
      return store.state.currentUser
    },
    currentProfile: function () {
      return store.state.currentProfile
    }
  },
  beforeCreate: function () {
    function getFullData (item) {
      return { ...{ id: item.id }, ...item.data() }
    }

    auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        store.commit('setCurrentUser', user)

        db.collection('users')
          .where('uid', '==', user.uid)
          .get()
          .then(querySnapshot => {
            const documents = querySnapshot.docs.map(doc => getFullData(doc))
            if (documents[0]) {
              store.commit('setCurrentProfile', documents[0])
            } else {
              router.push('/createprofile')
            }
          })
      } else {
        store.commit('setCurrentUser', null)
        store.commit('setCurrentProfile', null)
      }
    })
  },
  methods: {
    login: function () {
      let that = this
      const provider = new firebase.auth.GoogleAuthProvider()
      auth.signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken
        // // The signed-in user info.
        // var user = result.user
        // ...
      }).catch(function (error) {
        that.error = error
        // Handle Errors here.
        // var errorCode = error.code
        // var errorMessage = error.message
        // // The email of the user's account used.
        // var email = error.email
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential
        // ...
      })
    },
    logout: function () {
      firebase.auth().signOut().then(function () {
      }).catch(function (error) {
        this.error = error
      })
    },
    signup: function () {
      const provider = new firebase.auth.GoogleAuthProvider()
      auth.signInWithPopup(provider).then(function (result) {
      }).catch(function (error) {
        this.error = error
      })
    },
    goToCreateProfile: function () {
      router.push('/createprofile')
    }
  }
}
</script>

<style lang="scss">
button {
  &:focus {
    box-shadow: none !important;
  }
}

body {
  background-color: #030303;
}

a {
  color: #4fbcff;
}

.navbar {
  background-color: #19191b;
  border-bottom: 1px solid #343537;
  min-height: 48px;
  padding-top: 0;
  padding-bottom: 0;
}

.navbar-brand {
  padding: 0 15px;
  height: 48px;
  line-height: 48px;
  display: flex;
  align-items: center;
}

h1 {
  color: #fff;
}

.card {
  border-color: #343537;
  background-color: #19191b;
}

.form-control {
  background-color: #272729;
  border-color: #343537;
  color: #d7dadc;

  &:hover {
    border-color: #d7dadc;
  }

  &:focus {
    background-color: #272729;
    color: #d7dadc;
    border-color: #d7dadc;
    box-shadow: none;
  }

  &::placeholder {
    color: #818384;
  }
}

.card-title {
  color: #d7dadc;
}

.card-text {
  color: #d7dadc;
}

.text-muted {
  color: #818384 !important;
}

.btn-primary {
  background-color: #d7dadc;
  color: #1a1a1b;
  font-weight: 700;
  letter-spacing: .5px;
  font-size: 12px;
  text-transform: uppercase;
  border-color: #d7dadc;
  padding: 5px 10px;

  &:hover {
    background-color: #ebeced;
    border-color: #ebeced;
    color: #1a1a1b;
  }
}

.btn-secondary {
  background-color: #1a1a1b;
  color: #d7dadc;
  font-weight: 700;
  letter-spacing: .5px;
  font-size: 12px;
  text-transform: uppercase;
  border-color: #d7dadc;
  padding: 5px 10px;

  &:hover {
    background-color: #1a1a1b;
    border-color: #ebeced;
    color: #d7dadc;
  }
}

.btn-dark {
  background: none;
  border: none;
  color: #818384;

  &:hover {
    background-color: #d7dadc1a;
    color: #818384;
  }
}

.upvoted {
  color: #ff4500;
}

.downvoted {
  color: #7292ff;
}

.btn.disabled,
.btn:disabled {
  opacity: 1;
}

.upvote {
  font-size: 16px;
  width: 24px !important;
  height: 24px !important;
  padding: 0;

  &:hover {
    color: #ff4500;
  }
}

.downvote {
  font-size: 16px;
  width: 24px !important;
  height: 24px !important;
  padding: 0;

  &:hover {
    color: #7292ff;
  }
}

.upvotes {
  color: #d7dadc;
  font-size: 12px;
  font-weight: 700;
  width: 24px !important;
  height: 24px !important;
  padding: 0;

  &:hover {
    color: #d7dadc;
  }
}

.sublink {
  color: #d7dadc;
  font-weight: 700;

  &:hover {
    color: #d7dadc;
  }
}

.userlink {
  color: #818384;

  &:hover {
    color: #818384;
  }
}

.btn-outline-light {
  border-color: #19191b;
  color: #d7dadc;

  &:hover {
    border-color: #343536;
    background-color: #19191b;
    color: #d7dadc;
  }
}

.dropdown-menu {
  background-color: #19191b;
  border: 1px solid #343537;

  a {
    color: #d7dadc;
  }
}

.dropdown-item {
  &:hover {
    background-color: #272729;
    color: #d7dadc;
  }
}

.dropdown-divider {
  border-color: #343536;
}

.btn-outline-light:not(:disabled):not(.disabled).active,
.btn-outline-light:not(:disabled):not(.disabled):active,
.show>.btn-outline-light.dropdown-toggle {
  border-color: #343536;
  background-color: #19191b;
  color: #d7dadc;
}

.border-bottom {
  border-color: #343536 !important;
}

.post-details {
  line-height: 1;
  margin-bottom: .5rem;
}

.logo-icon {
  width: 32px;
  margin-right: 8px;
}

.logo-text {
  width: 57px;
}
</style>
