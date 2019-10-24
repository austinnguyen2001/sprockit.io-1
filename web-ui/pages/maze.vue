<template>
  <div class="container">
    <Maze class="app-container" />
    <EditorPanel class="editor-panel" @run="run" />
  </div>
</template>

<script>
import EditorPanel from "~/components/EditorPanel.vue";
import Maze from "~/components/Maze/Maze.vue";
import { mapMutations } from "vuex";

export default {
  components: {
    EditorPanel,
    Maze,
  },
  mounted() {
    if (typeof Storage !== "undefined") {
      if (localStorage.code) this.updateCode(localStorage.code);

      if (localStorage.editorWidth)
        document.documentElement.style.setProperty(
          "--output-width",
          `${localStorage.editorWidth}`,
        );
    }

    window.log = (output, type) => {
      this.appendToConsole(output, type);
    };

    const saveCode = e => {
      const modifierKey = navigator.platform.match("Mac")
        ? e.metaKey
        : e.ctrlKey;
      if (e.keyCode == 83 && modifierKey) {
        e.preventDefault();
        if (typeof Storage !== "undefined") localStorage.code = this.code;
      }
    };

    document.addEventListener("keydown", saveCode);
  },
  computed: {
    code() {
      return this.$store.state.editor.code;
    },
  },
  methods: {
    run() {
      const container = document.getElementById("editor-panel-header-handle");
      const iframe = document.createElement("IFRAME");
      container.innerHTML = "";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.border = "none";
      container.appendChild(iframe);

      const doc = iframe.contentDocument;

      const logger = `
        const console = {
          log:(output) => {
            parent.log(output, 'norm');
          }
        };

        window.onerror = function(error, url, line) {
          parent.log(\`Javascript Error : \${error} on line \${line}\`, 'error');
        }
      `;

      doc.open();
      doc.write(`<script>${logger}${unescape("%3C/script%3E")}`);
      doc.write(`<script>${this.code}${unescape("%3C/script%3E")}`);
      doc.close();
    },
    ...mapMutations({
      appendToConsole: "editor/appendToConsole",
      updateCode: "editor/updateCode",
    }),
  },
};
</script>

<style scoped>
:root {
  --output-width: 30%;
}

.container {
  height: 100vh;
  width: 100vw;
}

.editor-panel {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: var(--output-width);
  display: flex;
}

.app-container {
  overflow: hidden;
  width: calc(100% - var(--output-width));
}
</style>
