<template>
  <div class="p5-js__container">
    <client-only placeholder>
      <vue-p5
        id="p5-js__renderer"
        v-on="{ setup, draw, mousedragged, mousereleased }"
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
      sketch.ambientLight(200);
      sketch.pointLight(255, 255, 255, 0, -400, 100);
      sketch.noStroke();
    },
    createWebGlBox(sketch, rotation, color, translate, size) {
      sketch.push();
      sketch.rotateX(rotation);
      sketch.ambientMaterial(color);
      sketch.translate(translate);
      sketch.box(size);
      sketch.pop();
    },
    createGameGrid(
      sketch,
      rotation,
      backgroundColor,
      edgeColor,
      edgeWidth,
      gridSize,
    ) {
      this.createWebGlBox(
        sketch,
        rotation,
        backgroundColor,
        sketch.createVector(0, 0, 0),
        gridSize,
      );
      this.createGameGridBorder(
        sketch,
        rotation,
        edgeColor,
        edgeWidth,
        gridSize.map(k => k + 20),
      );
    },
    createGameGridBorder(sketch, rotation, edgeColor, edgeWidth, gridSize) {
      const translate = {
        y: [-gridSize[1] / 2, gridSize[1] / 2, false, 0],
        x: [false, 0, -gridSize[0] / 2, gridSize[0] / 2],
      };
      for (let i = 0; i < 4; i++) {
        this.createWebGlBox(
          sketch,
          rotation,
          edgeColor,
          sketch.createVector(translate.x[3 - i], translate.y[3 - i], 10),
          [
            Math.abs(translate.x[i]) > edgeWidth
              ? Math.abs(translate.x[i]) * 2 + edgeWidth
              : edgeWidth,
            Math.abs(translate.y[i]) > edgeWidth
              ? Math.abs(translate.y[i]) * 2 + edgeWidth
              : edgeWidth,
            40,
          ],
        );
      }
    },
    createGameEntities(sketch, rotation, gameEntities, gameSize, gridUnit) {
      const defaultLocX = -gameSize[0] / 2 + gridUnit / 2;
      const defaultLocY = -gameSize[1] / 2 + gridUnit / 2;

      gameEntities.forEach(entities => {
        if (entities[0] !== "map")
          this.createWebGlBox(
            sketch,
            rotation,
            [255, 0, 0],
            sketch.createVector(
              defaultLocX + entities[1].x * 60,
              defaultLocY + entities[1].y * 60,
              40,
            ),
            [gridUnit, gridUnit, gridUnit],
          );
      });
    },
    createGameMap(sketch, rotation, gameSize, gridUnit) {
      const defaultLocX = -gameSize[0] / 2 + gridUnit / 2;
      const defaultLocY = -gameSize[1] / 2 + gridUnit / 2;

      for (let i = 0; i < this.gameState.map.length; i++) {
        for (let k = 0; k < this.gameState.map[i].length; k++) {
          let material;
          if (this.gameState.map[k][i] == "blocked") material = [192, 178, 131];
          if (this.gameState.map[k][i] == "hidden") material = [50, 50, 50];
          if (material)
            this.createWebGlBox(
              sketch,
              rotation,
              material,
              sketch.createVector(
                defaultLocX + i * 60,
                defaultLocY + k * 60,
                20,
              ),
              [gridUnit, gridUnit, 20],
            );
        }
      }
    },
    draw(sketch) {
      sketch.background("#2b2b2b");
      sketch.orbitControl(2.5, 2.5);
      if (this.gameState) {
        const gridUnit = 60;
        const gameEntities = Object.entries(this.gameState);

        const gameSize = [
          this.gameState.map.length * gridUnit,
          this.gameState.map[0].length * gridUnit,
          20,
        ];

        this.createGameGrid(
          sketch,
          Math.PI / 5,
          [255, 255, 255],
          [192, 178, 131],
          20,
          gameSize,
        );

        this.createGameEntities(
          sketch,
          Math.PI / 5,
          gameEntities,
          gameSize,
          gridUnit,
        );

        this.createGameMap(sketch, Math.PI / 5, gameSize, gridUnit);
      }
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
      }
    },
    mousereleased(sketch) {
      this.checkResizeCanvas(sketch);
    },
    mousedragged(sketch) {
      this.checkResizeCanvas(sketch);
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
    async movePlayerCharacter(direction) {
      try {
        this.$axios.post(`/api/game/maze/move/${direction}`, "", {
          headers: { "X-TOKEN": this.token },
        });
        this.updateGameState();
      } catch (error) {
        alert("Please Reload Site");
      }
    },
    async updateGameState() {
      const gameState = (await this.$axios.get("/api/game/maze/map", {
        headers: { "X-TOKEN": this.token },
      })).data;
      console.info(gameState);
      this.setGameState(gameState);
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
