/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

export class Tower extends Phaser.GameObjects.Image {
  private timer: Phaser.Time.TimerEvent;

  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame);
  }

  addTowerEventTimer(timer: number) {
    this.timer = this.scene.time.addEvent({
      delay: timer,
      callback: this.towerEvent,
      callbackScope: this,
      loop: true
    });
  }

  update(): void {
  }
  towerEvent(): void {
  }
}