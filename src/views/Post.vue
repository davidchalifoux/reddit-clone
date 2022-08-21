<template>
  <div class="container pt-4" style="max-width: 45rem;">
    <div v-if="error" class="alert alert-danger mb-3" role="alert">
      {{error}}
    </div>
    <PlaceholderPost v-if="loading"/>
    <div v-if="!loading" class="card mb-4">
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
          <div class="form-group border-bottom pb-3">
            <textarea v-model="newComment" class="form-control" rows="4" placeholder="Leave a comment"></textarea>
            <button v-on:click="postComment" type="button" class="btn btn-primary btn-sm mt-3">Comment</button>
          </div>
          <CommentListItem v-for="comment in comments" v-bind:key="comment.id" v-bind:comment="comment"></CommentListItem>
          <p v-if="!comments" class="card-text text-muted">:( no comments yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { db } from '../db'
import store from '../store'
import router from '@/router'
import firebase from 'firebase/app'
import CommentListItem from '@/components/CommentListItem.vue'
import PlaceholderPost from '../components/PlaceholderPost'

export default {
  name: 'post',
  components: {
    PlaceholderPost,
    CommentListItem
  },
  data () {
    return {
      loading: false,
      post: null,
      comments: null,
      error: null,
      newComment: ''
    }
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
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = null
      this.post = null
      this.loading = true

      function getFullData (item) {
        return { ...{ id: item.id }, ...item.data() }
      }

      db.collection('posts').doc(this.$route.params.postid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            this.post = doc.data()
            this.loading = false
          } else {
            // doc.data() will be undefined in this case
            this.error = 'No such post'
          }
        })

      db.collection('posts').doc(this.$route.params.postid).collection('comments').orderBy('date', 'desc')
        .get()
        .then(querySnapshot => {
          const documents = querySnapshot.docs.map(doc => getFullData(doc))
          this.comments = documents
          if (documents.length < 1) {
            this.comments = null
          }
        })
    },
    postComment: function (event) {
      // Check if user needs profile
      if (store.state.currentUser && !store.state.currentProfile) {
        router.push('/createprofile')
        return
      }
      let that = this
      let validComment = true

      this.error = null

      if (this.newComment.length < 1) {
        validComment = false
        this.error = 'Comment must not be blank'
      }

      if (validComment) {
        db.collection('posts').doc(this.$route.params.postid).collection('comments').add({
          text: this.newComment,
          date: firebase.firestore.FieldValue.serverTimestamp(),
          user: store.state.currentProfile.id
        })
          .then(function (docRef) {
            that.newComment = ''
            that.fetchData()
          })
          .catch(function (error) {
            that.error = error
          })
        db.collection('users').doc(this.post.user)
          .get()
          .then(function (doc) {
            if (doc.exists) {
              // User has pushover setup
              if (doc.data().pushover) {
                let postData = {
                  token: 'aqq6hv1n2j8f69kxnk7f9nwpbde1ft',
                  user: doc.data().pushover,
                  message: 'Your post has a new comment'
                }
                const xhr = new XMLHttpRequest()
                xhr.open('POST', 'https://api.pushover.net/1/messages.json')
                xhr.setRequestHeader('Content-Type', 'application/json')
                xhr.send(JSON.stringify(postData))
              }
            }
          })
      }
    },
    upvote: function (event) {
      // Check if user needs profile
      if (store.state.currentUser && !store.state.currentProfile) {
        router.push('/createprofile')
        return
      }
      const post = this.post
      const postId = this.$route.params.postid
      // Check if user already upvoted, undo if so
      if (post.upvoters.includes(store.state.currentProfile.id)) {
        post.upvoters.splice(post.upvoters.indexOf(store.state.currentProfile.id), 1)
        db.collection('posts').doc(postId)
          .update({
            upvoters: firebase.firestore.FieldValue.arrayRemove(store.state.currentProfile.id)
          })
      } else { // User has not voted yet
        // User has already downvoted the post
        if (post.downvoters.includes(store.state.currentProfile.id)) {
          post.upvoters.push(store.state.currentProfile.id)
          post.downvoters.splice(post.downvoters.indexOf(store.state.currentProfile.id), 1)
          db.collection('posts').doc(postId)
            .update({
              upvoters: firebase.firestore.FieldValue.arrayUnion(store.state.currentProfile.id),
              downvoters: firebase.firestore.FieldValue.arrayRemove(store.state.currentProfile.id)
            })
        } else { // User has not voted on the post before
          post.upvoters.push(store.state.currentProfile.id)
          db.collection('posts').doc(postId)
            .update({
              upvoters: firebase.firestore.FieldValue.arrayUnion(store.state.currentProfile.id)
            })
        }
      }
    },
    downvote: function (event) {
      // Check if user needs profile
      if (store.state.currentUser && !store.state.currentProfile) {
        router.push('/createprofile')
        return
      }
      const post = this.post
      const postId = this.$route.params.postid
      // Check if user has already downvoted, undo if so
      if (post.downvoters.includes(store.state.currentProfile.id)) {
        post.downvoters.splice(post.downvoters.indexOf(store.state.currentProfile.id), 1)
        db.collection('posts').doc(postId)
          .update({
            downvoters: firebase.firestore.FieldValue.arrayRemove(store.state.currentProfile.id)
          })
      } else { // User has not downvoted before
        // User has already upvoted the post
        if (post.upvoters.includes(store.state.currentProfile.id)) {
          post.downvoters.push(store.state.currentProfile.id)
          post.upvoters.splice(post.upvoters.indexOf(store.state.currentProfile.id), 1)
          db.collection('posts').doc(postId)
            .update({
              downvoters: firebase.firestore.FieldValue.arrayUnion(store.state.currentProfile.id),
              upvoters: firebase.firestore.FieldValue.arrayRemove(store.state.currentProfile.id)
            })
        } else { // User has not voted yet
          post.downvoters.push(store.state.currentProfile.id)
          db.collection('posts').doc(postId)
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
</style>
