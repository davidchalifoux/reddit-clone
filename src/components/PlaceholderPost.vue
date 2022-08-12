<template>
  <div class="card mb-4">
    <div class="card-body">
      <div class="card-title pulse"></div>
      <div class="text-body pulse"></div>
      <div class="text-details pulse mt-4"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlaceholderPost'
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

.text-details {
  height: 1.5rem;
  width: 33%;
}

.card-title {
  height: 1.25rem;
  width: 66%;
}

.text-body {
  height: 1.5rem;
  width: 100%;
}

@keyframes pulse {
  0% {
    background-color: rgba(165, 165, 165, 0.1);
  }
  50% {
    background-color: rgba(165, 165, 165, 0.3);
  }
  100% {
    background-color: rgba(165, 165, 165, 0.1);
  }
}

.pulse {
  animation: pulse 1s infinite ease-in-out;
  border-radius: 4px;
}
</style>
