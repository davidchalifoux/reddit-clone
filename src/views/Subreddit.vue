<template>
  <div class="container-fluid pt-4">
    <div class="row">
      <div class="col d-none d-md-block"></div>
      <div class="col-sm-5">
        <CreatePost/>
        <div v-if="loading" class="loading">
          <PlaceholderPost/>
        </div>
        <PostListItem v-for="post in posts" v-bind:key="post.id" v-bind:post="post"></PostListItem>
      </div>
      <div class="col d-none d-md-block">
        <div v-if="!loading" class="card sticky-top subreddit-info">
          <div class="card-body">
            <h5 class="card-title">r/{{ subData.name }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Community Details</h6>
            <p class="card-text">{{subData.description}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../db'
import PostListItem from '@/components/PostListItem.vue'
import CreatePost from '@/components/CreatePost.vue'
import PlaceholderPost from '@/components/PlaceholderPost.vue'

export default {
  name: 'subreddit',
  components: {
    PostListItem,
    CreatePost,
    PlaceholderPost
  },
  data () {
    return {
      loading: false,
      posts: null,
      subData: null,
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
      this.error = null
      this.posts = null
      this.subData = null
      this.loading = true

      function getFullData (item) {
        return { ...{ id: item.id }, ...item.data() }
      }
      // replace `getPost` with your data fetching util / API wrapper
      db.collection('subreddits').doc(this.$route.params.subname)
        .get()
        .then(doc => {
          this.subData = doc.data()
          this.subData.name = this.$route.params.subname
        })
      db.collection('posts').orderBy('date', 'desc')
        .where('subreddit', '==', this.$route.params.subname)
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
  .subreddit-info {
    top: 4.5rem;
    z-index: 999;
  }
</style>
