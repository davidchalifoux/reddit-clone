<template>
  <div class="container pt-4" style="max-width: 45rem;">
    <div v-if="error" class="alert alert-danger mb-3" role="alert">
      {{error}}
    </div>
    <h1>Submit a post</h1>
    <div class="form-group">
      <select class="form-control" v-model="subreddit">
        <option v-for="subreddit in subreddits" v-bind:key="subreddit.id" v-bind:value="subreddit.id">r/{{subreddit.id}}</option>
      </select>
    </div>
    <div class="form-group">
      <input v-model="title" type="text" class="form-control" placeholder="Title" aria-label="Post title">
    </div>
    <div class="form-group">
      <textarea v-model="body" class="form-control" rows="4" placeholder="Body text"></textarea>
    </div>
    <button v-on:click="post" type="button" class="btn btn-primary">Post</button>
  </div>
</template>

<script>
import { db } from '../db'
import firebase from 'firebase/app'
import store from '../store'
import router from '../router'

export default {
  name: 'submit',
  components: {
  },
  data () {
    return {
      loading: false,
      error: false,
      subreddits: null,
      title: '',
      body: '',
      subreddit: null
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    if (this.$route.params.subname) {
      this.subreddit = this.$route.params.subname
    }
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.subreddits = null
      this.loading = true

      function getFullData (item) {
        return { ...{ id: item.id }, ...item.data() }
      }
      // replace `getPost` with your data fetching util / API wrapper
      db.collection('subreddits')
        .get()
        .then(querySnapshot => {
          this.subreddits = querySnapshot.docs.map(doc => getFullData(doc))
          this.loading = false
        })
    },
    post () {
      let that = this
      this.error = null
      if (!this.error && this.title.length < 3) {
        this.error = 'Post title must be longer than 3 characters'
      }
      // Check to make sure there is a title and subreddit selected
      if (!this.error && this.title && this.subreddit && store.state.currentProfile) {
        db.collection('posts').add({
          title: this.title,
          body: this.body,
          date: firebase.firestore.FieldValue.serverTimestamp(),
          downvoters: [],
          upvoters: [store.state.currentProfile.id],
          subreddit: this.subreddit,
          user: store.state.currentProfile.id
        })
          .then(function (docRef) {
            router.push({ name: 'subreddit', params: { subname: that.subreddit } })
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
</style>
