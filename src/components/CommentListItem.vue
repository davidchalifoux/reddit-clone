<template>
  <div class="mt-2">
    <p class="card-text">
      <small class="text-muted">
        <router-link :to="{ name: 'user', params: { username: comment.user }}">{{comment.user}}</router-link>
        {{date}}
      </small>
      <br>
      {{comment.text}}
    </p>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'CommentListItem',
  props: {
    comment: Object
  },
  computed: {
    date: function () {
      return moment.unix(this.comment.date.seconds).fromNow()
    }
  },
  methods: {
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
$link: #0078d1;

.comment {
  margin-bottom: 32px;
  .comment-top {
    font-size: 12px;
    margin-bottom: 8px;
    display: flex;
    .user {
      margin-right: 8px;
      a {
        color: $link;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .details {
      color: $grey;
    }
  }
}
</style>
