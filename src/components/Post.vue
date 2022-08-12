<template>
  <div class="row no-gutters card-body">
    <div class="col-auto mr-3">
      <div class="btn-group-vertical">
        <button v-on:click="upvote" v-bind:class="{ upvoted: upvoted }" type="button" class="btn btn-sm btn-light">
          <i class="material-icons">arrow_upward</i>
        </button>
        <button type="button" class="btn text-body" disabled>
          {{upvotes}}
        </button>
        <button v-on:click="downvote" v-bind:class="{ downvoted: downvoted }" type="button" class="btn btn-sm btn-light">
          <i class="material-icons">arrow_downward</i>
        </button>
      </div>
    </div>
    <div class="col">
      <h5 class="card-title">{{post.title}}</h5>
      <p class="card-text text-muted">{{post.body}}</p>
      <p class="card-text">
        <small class="text-muted">
          Posted in
          <router-link :to="{ name: 'subreddit', params: { subname: post.subreddit }}">{{post.subreddit}}</router-link>
          by
          <router-link :to="{ name: 'user', params: { username: post.user }}">{{post.user}}</router-link>
          {{date}}
        </small>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Post'
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
