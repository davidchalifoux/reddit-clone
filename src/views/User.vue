<template>
  <!--<div class="container pt-4" style="max-width: 45rem;">
    <h1>u/{{ $route.params.username }}</h1>
    <div v-if="loading" class="loading">
      <PlaceholderPost/>
    </div>
    <PostListItem v-for="post in posts" v-bind:key="post.id" v-bind:post="post"></PostListItem>
  </div>-->
  <div class="container-fluid pt-4">
    <div class="row">
      <div class="col d-none d-md-block"></div>
      <div class="col-sm-5">
        <div v-if="loading" class="loading">
          <PlaceholderPost/>
        </div>
        <PostListItem v-for="post in posts" v-bind:key="post.id" v-bind:post="post"></PostListItem>
      </div>
      <div class="col d-none d-md-block">
        <div v-if="!loading" class="card sticky-top user-info">
          <div class="card-body">
            <img src="@/assets/avatar1.png" class="rounded mb-3" alt="avatar" style="width:80px;">
            <h5 class="card-title">u/{{ $route.params.username }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">User Details</h6>
            <p class="card-text">Joined {{ joined }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../db'
import PostListItem from '@/components/PostListItem.vue'
import PlaceholderPost from '@/components/PlaceholderPost.vue'
import moment from 'moment'

export default {
  name: 'user',
  components: {
    PostListItem,
    PlaceholderPost
  },
  data () {
    return {
      loading: false,
      posts: null,
      user: null,
      error: null
    }
  },
  computed: {
    joined: function () {
      return moment.unix(this.user.joined.seconds).fromNow()
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
      this.posts = null
      this.user = null
      this.loading = true

      let that = this

      function getFullData (item) {
        return { ...{ id: item.id }, ...item.data() }
      }

      db.collection('users').doc(this.$route.params.username)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            that.user = doc.data()
            that.loading = false
          } else {
            // doc.data() will be undefined in this case
            this.error = 'No such user!'
          }
        })
        .catch(function (error) {
          that.error = error
        })
      db.collection('posts').orderBy('date', 'desc')
        .where('user', '==', this.$route.params.username)
        .get()
        .then(querySnapshot => {
          const documents = querySnapshot.docs.map(doc => getFullData(doc))
          this.posts = documents
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  .user-info {
    top: 4.5rem;
    z-index: 999;
  }
</style>
