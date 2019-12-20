/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */


import { Tower } from "./tower";
import { Laser } from "./laser";
import { Enemy } from "./enemy";
export class Tower1 extends Tower {
  private enemies: Enemy[];
  private lasers: Laser[];

  constructor(params) {
    super(params.scene, params.x, params.y, "tower1", params.frame);

    this.scene.add.existing(this);
    this.enemies = params.enemies;
    this.lasers = [];
  }

  update(): void {
    const lasers = [];
    for (let laser of this.lasers) {
      if (laser.update()) {
        laser.destroy();
      } else {
        lasers.push(laser);
      }
    }
    if (this.lasers.length != lasers.length) {
      this.lasers = lasers;
    }
  }

  startTimer(): void {
    this.addTowerEventTimer(1000);
  }

  towerEvent(): void {
    console.log("tower event");
    for (let enemy of this.enemies) {
      const diffX = enemy.x - this.x;
      const diffY = enemy.y - this.y;
      const length = Math.sqrt(diffX * diffX + diffY * diffY);
      let angle = Math.acos(diffX / length) / (2 * Math.PI) * 360;
      if (diffY < 0) angle = angle * -1;
      if (length < 100) {
        this.lasers.push(new Laser({
          enemy: enemy,
          scene: this.scene,
          x: this.x,
          y: this.y,
          angle: angle,
          operate: "not"}));
          break;
      }
    }
  }
}