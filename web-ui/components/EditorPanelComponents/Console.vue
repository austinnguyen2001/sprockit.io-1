<template>
  <div class="output" id="console">
    <div
      class="console-line"
      :class="[line.type]"
      v-for="(line, index) in this.console"
      :key="index"
    >
      {{ line.output }}
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    console() {
      return this.$store.state.editor.console;
    },
  },
};
</script>

<style>
.console-line {
  padding: 5px;
}
.error {
  color: red;
}
.norm {
  color: #2b2b2b;
}
</style>
