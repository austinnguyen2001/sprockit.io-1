<template>
  <div class="p5-js__container" v-if="isConnected">
    <client-only placeholder="Game Canvas Loading....">
      <vue-p5
        id="p5-js__renderer"
        v-on="{ setup, draw, mousewheel, mousedragged, mousereleased }"
      />
    </client-only>
  </div>
</template>

<script>
import VueP5 from "vue-p5";

export default {
  components: {
    "vue-p5": VueP5,
  },
  data() {
    return {
      rendererProps: { left: 0, top: 0, size: 800 },
      canvasProps: { width: 0, height: 0 },
      isConnected: false,
      token: null,
    };
  },
  mounted: function() {
    this.createGameSession();
  },
  methods: {
    setup(sketch) {
      this.rendererProps.left =
        (document.getElementById("p5-js__renderer").offsetWidth -
          this.rendererProps.size) /
        2;
      this.rendererProps.top =
        (document.getElementById("p5-js__renderer").offsetHeight -
          this.rendererProps.size) /
        2;
      this.canvasProps.width = document.getElementById(
        "p5-js__renderer",
      ).offsetWidth;
      this.canvasProps.height = document.getElementById(
        "p5-js__renderer",
      ).offsetHeight;
      sketch.resizeCanvas(this.canvasProps.width, this.canvasProps.height);
    },
    draw(sketch) {
      sketch.background("#2b2b2b");
      sketch.fill("#111111");
      sketch.rect(
        this.rendererProps.left,
        this.rendererProps.top,
        this.rendererProps.size,
        this.rendererProps.size,
      );
    },
    mousewheel(sketch) {
      const direction = sketch._mouseWheelDeltaY > 0 ? -1 : 1;
      const currentSize = this.rendererProps.size;
      this.rendererProps.size = sketch.constrain(
        this.rendererProps.size + direction * 100,
        300,
        2000,
      );
      if (currentSize !== this.rendererProps.size) {
        this.rendererProps.left -= (direction * 100) / 2;
        this.rendererProps.top -= (direction * 100) / 2;
      }
    },
    mousedragged(sketch) {
      if (
        this.canvasProps.width !==
          document.getElementById("p5-js__renderer").offsetWidth ||
        this.canvasProps.height !==
          document.getElementById("p5-js__renderer").offsetHeight
      ) {
        this.canvasProps.width = document.getElementById(
          "p5-js__renderer",
        ).offsetWidth;
        this.canvasProps.height = document.getElementById(
          "p5-js__renderer",
        ).offsetHeight;
        sketch.resizeCanvas(
          document.getElementById("p5-js__renderer").offsetWidth,
          document.getElementById("p5-js__renderer").offsetHeight,
        );
        this.rendererProps.left += (sketch.mouseX - sketch.pmouseX) / 2;
      } else {
        if (
          sketch.mouseX >= this.rendererProps.left &&
          sketch.mouseY >= this.rendererProps.top &&
          sketch.mouseX <= this.rendererProps.left + this.rendererProps.size &&
          sketch.mouseY <= this.rendererProps.top + this.rendererProps.size
        ) {
          console.info(this.rendererProps.left + this.rendererProps.size);
          this.rendererProps.left += sketch.mouseX - sketch.pmouseX;
          this.rendererProps.top += sketch.mouseY - sketch.pmouseY;
          document.body.style.cursor = "move";
        }
      }
    },
    mousereleased() {
      document.body.style.cursor = "auto";
    },
    async createGameSession() {
      try {
        this.token = (await this.$axios.post(
          "/api/game/maze/start",
        )).data.token;
        this.isConnected = true;
      } catch (error) {
        this.isConnected = false;
      }
    },
  },
};
</script>

<style scoped>
.p5-js__container {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(#373737, #2b2b2b);
}

#p5-js__renderer {
  width: calc(100% - 35px);
  height: 100%;
}
</style>
