<template>
  <div class="card mb-4 p-2">
    <input v-on:click="redirect" type="text" class="form-control" placeholder="Create Post" aria-label="Recipient's username" aria-describedby="basic-addon2">
  </div>
</template>

<script>
import router from '../router'
import store from '@/store'
export default {
  name: 'CreatePost',
  methods: {
    redirect: function (event) {
      // Check if user needs profile
      if (store.state.currentUser && !store.state.currentProfile) {
        router.push('/createprofile')
        return
      }
      if (this.$route.params.subname) {
        router.push({ name: 'submit', params: { subname: this.$route.params.subname } })
      } else {
        router.push({ name: 'submit', params: { subname: 'cos143' } })
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
