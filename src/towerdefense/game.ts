/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

import "phaser";
import { MainScene } from "./scenes/main-scene";

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
  title: "Quantum TowerDefense",
  url: "https://github.com/dasoran/phaser-towerdefense",
  version: "2.0",
  width: 640,
  height: 480,
  type: Phaser.AUTO,
  parent: "game",
  scene: [MainScene],
  input: {
    keyboard: false,
    mouse: false
  },
  backgroundColor: "#98d687",
  render: { pixelArt: true, antialias: false }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
  const game = new Game(config);
});
