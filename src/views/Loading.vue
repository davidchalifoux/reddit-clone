<template>
  <div class="container pt-4" style="max-width: 45rem;">
    <CreatePost/>
    <div>
      <PlaceholderPost/>
    </div>
  </div>
</template>

<script>
import CreatePost from '@/components/CreatePost.vue'
import PlaceholderPost from '@/components/PlaceholderPost.vue'

export default {
  name: 'loading',
  components: {
    CreatePost,
    PlaceholderPost
  }
}
</script>
