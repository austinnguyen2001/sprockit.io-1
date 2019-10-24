<template>
  <div class="container">
    <GameList class="app-container" />
  </div>
</template>

<script>
import GameList from "~/components/GameList.vue";

export default {
  components: {
    GameList,
  },
};
</script>

<style scoped>
:root {
  --output-width: 30%;
}

.container {
  display: grid;
  height: 100vh;
  width: 100vw;
  padding: 3rem 3vw;
}
</style>
