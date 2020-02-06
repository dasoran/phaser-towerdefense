/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */


import { Tower } from "./tower";
import { Laser2 } from "./laser2";
import { Enemy } from "./enemy";
export class Tower2 extends Tower {
  private enemies: Enemy[];
  private lasers: Laser2[];

  constructor(params) {
    super(params.scene, params.x, params.y, "tower2", params.frame);

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
    console.log("tower2 event");
    for (let enemy of this.enemies) {
      if (this.x - 32 - 16 < enemy.x && enemy.x < this.x - 16
          && this.y - 16 < enemy.y && enemy.y < this.y + 16) {
        this.lasers.push(new Laser2({
          enemies: this.enemies,
          scene: this.scene,
          x: this.x - 32,
          y: this.y
          }));
        break;
      } else if (this.x + 16 < enemy.x && enemy.x < this.x + 32 + 16
        && this.y - 16 < enemy.y && enemy.y < this.y + 16) {
        this.lasers.push(new Laser2({
          enemies: this.enemies,
          scene: this.scene,
          x: this.x + 32,
          y: this.y
          }));
        break;
      } else if (this.x - 16 < enemy.x && enemy.x < this.x + 16
        && this.y - 32 - 16 < enemy.y && enemy.y < this.y - 16) {
        this.lasers.push(new Laser2({
          enemies: this.enemies,
          scene: this.scene,
          x: this.x,
          y: this.y - 32
          }));
        break;
      } else if (this.x - 16 < enemy.x && enemy.x < this.x + 16
        && this.y + 16 < enemy.y && enemy.y < this.y + 32 + 16) {
        this.lasers.push(new Laser2({
          enemies: this.enemies,
          scene: this.scene,
          x: this.x,
          y: this.y + 32
          }));
        break;
      }
    }
  }
}