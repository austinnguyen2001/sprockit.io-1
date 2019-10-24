<template>
  <div class="p5-js__container">
    <client-only placeholder>
      <vue-p5
        id="p5-js__renderer"
        v-on="{ setup, draw, mousewheel, mousedragged, mousereleased }"
      />
    </client-only>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
/* VUEP5 isnt built for nuxt D; */
let VueP5 = null;
if (process.browser) VueP5 = require("vue-p5");

export default {
  components: {
    "vue-p5": VueP5,
  },
  data() {
    return {
      rendererProps: { left: 0, top: 0, size: 800 },
      canvasProps: { width: 0, height: 0 },
    };
  },
  mounted: function() {
    this.createGameSession();
  },
  computed: {
    token() {
      return this.$store.state.game.token;
    },
    gameState() {
      return this.$store.state.game.gameState;
    },
  },
  methods: {
    setup(sketch) {
      this.canvasProps.width = document.getElementById(
        "p5-js__renderer",
      ).offsetWidth;
      this.canvasProps.height = document.getElementById(
        "p5-js__renderer",
      ).offsetHeight;
      sketch.createCanvas(
        this.canvasProps.width,
        this.canvasProps.height,
        sketch.WEBGL,
      );
    },
    draw(sketch) {
      if (this.gameState) {
        const gameSize = [600, 600, 20];
        sketch.background("#2b2b2b");
        sketch.ambientLight(200);
        sketch.pointLight(255, 255, 255, 0, -400, 400);
        sketch.orbitControl(2, 2, 0);
        sketch.noStroke();

        sketch.push();
        sketch.rotateX(0);
        sketch.ambientMaterial(255);
        sketch.box(gameSize);
        sketch.pop();
        ///////////////////////////////////
        sketch.push();
        sketch.rotateX(0);
        sketch.ambientMaterial(200);
        sketch.translate(-310, 0, 10);
        sketch.box(20, 640, 40);
        sketch.pop();

        sketch.push();
        sketch.rotateX(0);
        sketch.ambientMaterial(200);
        sketch.translate(310, 0, 10);
        sketch.box(20, 640, 40);
        sketch.pop();

        sketch.push();
        sketch.rotateX(0);
        sketch.ambientMaterial(200);
        sketch.translate(0, -310, 10);
        sketch.box(600, 20, 40);
        sketch.pop();

        sketch.push();
        sketch.rotateX(0);
        sketch.ambientMaterial(200);
        sketch.translate(0, 310, 10);
        sketch.box(600, 20, 40);
        sketch.pop();

        ////////////////////////////////////////

        let gridUnit = 60;
        const defaultLoc = -gameSize[0] / 2 + gridUnit / 2;
        sketch.push();
        sketch.rotateX(0);
        sketch.ambientMaterial(255, 0, 0);
        sketch.translate(
          defaultLoc + this.gameState.player.x * 60,
          defaultLoc + this.gameState.player.y * 60,
          40,
        );
        sketch.box(gridUnit, gridUnit, gridUnit);
        sketch.pop();

        sketch.push();
        sketch.rotateX(0);
        sketch.ambientMaterial(0, 255, 0);
        sketch.translate(
          defaultLoc + this.gameState.exit.x * 60,
          defaultLoc + this.gameState.exit.y * 60,
          40,
        );
        sketch.box(gridUnit, gridUnit, gridUnit);
        sketch.pop();

        for (let i = 0; i < this.gameState.map.length; i++) {
          for (let k = 0; k < this.gameState.map[i].length; k++) {
            if (this.gameState.map[k][i] == "Blocked") {
              sketch.push();
              sketch.rotateX(0);
              sketch.ambientMaterial(192, 178, 131);
              sketch.translate(defaultLoc + i * 60, defaultLoc + k * 60, 20);
              sketch.box(gridUnit, gridUnit, 20);
              sketch.pop();
            }
          }
        }
      }
    },
    mousewheel(sketch) {
      let sensitivityZoom = 0.05;
      let scaleFactor = sketch.height;
      if (sketch._mouseWheelDeltaY > 0) {
        console.info(sketch._curCamera);
      } else {
        console.info("dsd");
      }
    },
    mousedragged(sketch) {
      console.info(sketch);
    },
    checkResizeCanvas(sketch) {
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
        return true;
      } else return false;
    },
    mousereleased(sketch) {
      console.info(sketch);
    },
    async createGameSession() {
      try {
        const token = (await this.$axios.post("/api/game/maze/start")).data
          .token;
        const gameState = (await this.$axios.get("/api/game/maze/map", {
          headers: { "X-TOKEN": token },
        })).data;
        this.setGameToken(token);
        this.setGameState(gameState);
      } catch (error) {
        alert("Please Reload Site");
      }
    },
    ...mapMutations({
      setGameState: "game/setGameState",
      setGameToken: "game/setGameToken",
    }),
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
