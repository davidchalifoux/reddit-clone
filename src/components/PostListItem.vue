<template>
  <div v-on:click="goToPost" class="card mb-4">
    <div class="row no-gutters card-body">
      <div class="col-auto mr-3">
        <div class="btn-group-vertical">
          <button v-on:click="upvote" v-bind:class="{ upvoted: upvoted }" type="button" class="btn btn-sm btn-dark upvote">
            <i class="material-icons">arrow_upward</i>
          </button>
          <button type="button" class="btn upvotes" disabled>
            {{upvotes}}
          </button>
          <button v-on:click="downvote" v-bind:class="{ downvoted: downvoted }" type="button" class="btn btn-sm btn-dark downvote">
            <i class="material-icons">arrow_downward</i>
          </button>
        </div>
      </div>
      <div class="col">
        <p class="card-text post-details">
          <small class="text-muted">
            <router-link :to="{ name: 'subreddit', params: { subname: post.subreddit }}" class="sublink">r/{{post.subreddit}}</router-link>
            posted by
            <router-link :to="{ name: 'user', params: { username: post.user }}" class="userlink">u/{{post.user}}</router-link>
            {{date}}
          </small>
        </p>
        <h5 class="card-title">{{post.title}}</h5>
        <p class="card-text">{{post.body}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { db } from '../db'
import firebase from 'firebase/app'
import store from '../store'
import router from '@/router'
export default {
  name: 'PostList',
  props: {
    post: Object
  },
  computed: {
    currentUser: function () {
      return store.state.currentUser
    },
    currentProfile: function () {
      return store.state.currentProfile
    },
    upvotes: function () {
      return this.post.upvoters.length - this.post.downvoters.length
    },
    upvoted: function () {
      if (store.state.currentProfile) {
        return this.post.upvoters.includes(store.state.currentProfile.id)
      } else {
        return false
      }
    },
    downvoted: function () {
      if (store.state.currentProfile) {
        return this.post.downvoters.includes(store.state.currentProfile.id)
      } else {
        return false
      }
    },
    date: function () {
      return moment.unix(this.post.date.seconds).fromNow()
    }
  },
  methods: {
    goToPost: function (event) {
      const srcTag = event.srcElement.tagName
      const post = this.post
      // We don't want to override links and buttons
      if (srcTag !== 'A' && srcTag !== 'I' && srcTag !== 'BUTTON') {
        router.push({ name: 'post', params: { subname: post.subreddit, postid: post.id } })
      }
    },
    upvote: function (event) {
      // Check if user needs profile still
      if (store.state.currentUser && !store.state.currentProfile) {
        router.push('/createprofile')
        return
      }
      const post = this.post
      // Check if user already upvoted, undo if so
      if (post.upvoters.includes(store.state.currentProfile.id)) {
        post.upvoters.splice(post.upvoters.indexOf(store.state.currentProfile.id), 1)
        db.collection('posts').doc(post.id)
          .update({
            upvoters: firebase.firestore.FieldValue.arrayRemove(store.state.currentProfile.id)
          })
      } else { // User has not voted yet
        // User has already downvoted the post
        if (post.downvoters.includes(store.state.currentProfile.id)) {
          post.upvoters.push(store.state.currentProfile.id)
          post.downvoters.splice(post.downvoters.indexOf(store.state.currentProfile.id), 1)
          db.collection('posts').doc(post.id)
            .update({
              upvoters: firebase.firestore.FieldValue.arrayUnion(store.state.currentProfile.id),
              downvoters: firebase.firestore.FieldValue.arrayRemove(store.state.currentProfile.id)
            })
        } else { // User has not voted on the post before
          post.upvoters.push(store.state.currentProfile.id)
          db.collection('posts').doc(post.id)
            .update({
              upvoters: firebase.firestore.FieldValue.arrayUnion(store.state.currentProfile.id)
            })
        }
      }
    },
    downvote: function (event) {
      // Check if user needs profile still
      if (store.state.currentUser && !store.state.currentProfile) {
        router.push('/createprofile')
        return
      }
      const post = this.post
      // Check if user has already downvoted, undo if so
      if (post.downvoters.includes(store.state.currentProfile.id)) {
        post.downvoters.splice(post.downvoters.indexOf(store.state.currentProfile.id), 1)
        db.collection('posts').doc(post.id)
          .update({
            downvoters: firebase.firestore.FieldValue.arrayRemove(store.state.currentProfile.id)
          })
      } else { // User has not downvoted before
        // User has already upvoted the post
        if (post.upvoters.includes(store.state.currentProfile.id)) {
          post.downvoters.push(store.state.currentProfile.id)
          post.upvoters.splice(post.upvoters.indexOf(store.state.currentProfile.id), 1)
          db.collection('posts').doc(post.id)
            .update({
              downvoters: firebase.firestore.FieldValue.arrayUnion(store.state.currentProfile.id),
              upvoters: firebase.firestore.FieldValue.arrayRemove(store.state.currentProfile.id)
            })
        } else { // User has not voted yet
          post.downvoters.push(store.state.currentProfile.id)
          db.collection('posts').doc(post.id)
            .update({
              downvoters: firebase.firestore.FieldValue.arrayUnion(store.state.currentProfile.id)
            })
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .card:hover {
    cursor: pointer;
  }

  .card-text {
    max-height: 200px;
    overflow: hidden;
  }
</style>
