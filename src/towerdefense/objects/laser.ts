/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */


import { Enemy } from "./enemy";
export class Laser extends Phaser.GameObjects.Image {
  private timer: Phaser.Time.TimerEvent;
  private enemy: Enemy;
  private operate: string;
  private isDestroied: boolean;

  constructor(params) {
    super(params.scene, params.x, params.y, "laser", params.frame);
    this.scene.add.existing(this);
    this.angle = params.angle;
    this.enemy = params.enemy;
    this.operate = params.operate;
    this.isDestroied = false;
    this.enemy.addRelation(this);
  }

  destroyByEnemyDestroied(): void {
    this.isDestroied = true;
  }

  update(): boolean {
    if (this.isDestroied) {
      return this.isDestroied;
    } else {
      const diffX = this.enemy.x - this.x;
      const diffY = this.enemy.y - this.y;
      const length = Math.sqrt(diffX * diffX + diffY * diffY);
      this.x = this.x + (diffX / length) * 10;
      this.y = this.y + (diffY / length) * 10;

      const isHit = this.checkHit();
      if (isHit) {
        this.enemy.hit(this.operate);
      }
      return isHit;
    }
  }

  private checkHit(): boolean {
    let isHit = false;
    if ((this.enemy.x - 8) < this.x && this.x < (this.enemy.x + 8)
        && (this.enemy.y - 8) < this.y && this.y < (this.enemy.y + 8)) {
      isHit = true;
    }
    return isHit;
  }
}