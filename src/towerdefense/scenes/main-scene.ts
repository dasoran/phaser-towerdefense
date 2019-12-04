/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

import { Tower } from "../objects/tower";
import { Tower1 } from "../objects/tower1";

export class MainScene extends Phaser.Scene {
  private towers: Tower[];
  private timer: Phaser.Time.TimerEvent;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.pack(
      "preload",
      "./src/towerdefense/assets/pack.json",
      "preload"
    );
  }

  create(): void {
    this.towers = [];

    this.add.image(320, 240, "background");
    const towerPos = this.calculateAbsolutePos(4,3);
    this.towers.push(new Tower1({
      scene: this,
      x: towerPos[0],
      y: towerPos[1]}));
  }

  update(): void {
    for (var tower of this.towers) {
      tower.update();
    }
  }

  private calculateAbsolutePos(x: number, y: number): number[] {
    const absolutePos: number[]  = [];
    absolutePos.push(x * 32 + 16);
    absolutePos.push(y * 32 + 16);
    return absolutePos;
  }
}
