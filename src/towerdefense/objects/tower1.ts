/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */


import { Tower } from "./tower";
export class Tower1 extends Tower {
  constructor(params) {
    super(params.scene, params.x, params.y, "tower1", params.frame);

    this.addTowerEventTimer(1000);

    this.scene.add.existing(this);
  }

  update(): void {
  }

  towerEvent(): void {
    console.log("tower event");
  }
}