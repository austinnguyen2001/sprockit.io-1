<template>
  <div>
    <div class="game-list">
      <nuxt-link
        class="game-card"
        v-for="(game, index) in games"
        :key="index"
        :to="game"
      >
        <div class="game-card-visual gold" />
        <div>{{ game }}</div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      games: ["maze"],
    };
  },
};
</script>

<style scoped>
.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-template-rows: 190px;
  gap: 2rem 2rem;
}
.game-card {
  height: 190px;
  width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
}

.game-card-visual {
  border-radius: 10px;
  height: 170px;
}

.gold {
  background-color: #c0b283;
}
</style>
