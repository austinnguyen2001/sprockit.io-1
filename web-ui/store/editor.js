export const state = () => ({
  code:
    "const a = 10;\nconst b = 20;\nconsole.log(a + b);\nconsole.log('A String');\n",
  console: [],
});

export const mutations = {
  appendToConsole(state, output, type) {
    state.console.push({
      output,
      type,
    });
  },
  updateCode(state, newCode) {
    state.code = newCode;
  },
};
