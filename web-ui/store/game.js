export const state = () => ({
  token: null,
  gameState: null,
});

export const mutations = {
  setGameState(state, gameState) {
    state.gameState = gameState;
  },
  setGameToken(state, token) {
    state.token = token;
  },
};
