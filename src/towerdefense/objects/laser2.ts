/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */


import { Enemy } from "./enemy";
export class Laser2 extends Phaser.GameObjects.Image {
  private timer: Phaser.Time.TimerEvent;
  private enemies: Enemy[];
  private isDestroied: boolean;


  constructor(params) {
    super(params.scene, params.x, params.y, "laser2", params.frame);
    this.scene.add.existing(this);
    this.enemies = params.enemies;
    this.isDestroied = false;
    this.alpha = 0;
    this.scene.tweens.add({
      targets: this,
      props: { alpha: 1 },
      duration: 450,
      ease: "Power0"
    });
    this.scene.time.addEvent({
      delay: 450,
      callback: this.feedEffect,
      callbackScope: this,
      loop: false
    });

    // check hit
    for (let enemy of this.enemies) {
      for (let enemy of this.enemies) {
        if (this.x - 16 < enemy.x && enemy.x < this.x + 16
          && this.y - 16 < enemy.y && enemy.y < this.y + 16) {
            enemy.hit("measure");
        }
      }
    }
  }

  private feedEffect(): void {
    this.scene.tweens.add({
      targets: this,
      props: { alpha: 0 },
      duration: 450,
      ease: "Power0"
    });
    this.scene.time.addEvent({
      delay: 450,
      callback: this.changeStatusDestroy,
      callbackScope: this,
      loop: false
    });
  }

  private changeStatusDestroy(): void {
    this.isDestroied = true;
  }

  update(): boolean {
    return this.isDestroied;
  }
}