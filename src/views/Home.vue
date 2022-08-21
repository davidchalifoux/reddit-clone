<template>
  <div class="container pt-4" style="max-width: 45rem;">
    <h1>Home</h1>
    <CreatePost />
    <div v-if="loading">
      <PlaceholderPost />
    </div>
    <PostListItem v-for="post in posts" v-bind:key="post.id" v-bind:post="post"></PostListItem>
  </div>
</template>

<script>
import { db } from '../db'
import PostListItem from '@/components/PostListItem.vue'
import CreatePost from '@/components/CreatePost.vue'
import PlaceholderPost from '@/components/PlaceholderPost.vue'

export default {
  name: 'home',
  components: {
    PostListItem,
    CreatePost,
    PlaceholderPost
  },
  data () {
    return {
      loading: false,
      posts: null,
      error: null
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
      this.error = this.posts = null
      this.loading = true

      db.collection('posts').orderBy('date', 'desc')
        .onSnapshot((snapshot) => {
          const posts = []
          snapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() })
          })
          this.posts = posts
          this.loading = false
        })
    }
  }
}
</script>
