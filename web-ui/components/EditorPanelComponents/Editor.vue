<template>
  <client-only placeholder>
    <codemirror :value="code" @input="updateCode($event)" :options="cmOption" />
  </client-only>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      cmOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        foldGutter: true,
        styleSelectedText: true,
        mode: "text/javascript",
        keyMap: "sublime",
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: "duotone-light",
        extraKeys: { Ctrl: "autocomplete" },
        hintOptions: {
          completeSingle: false,
        },
      },
    };
  },
  methods: {
    ...mapMutations({
      updateCode: "editor/updateCode",
    }),
  },
  computed: {
    code() {
      return this.$store.state.editor.code;
    },
  },
};
</script>
