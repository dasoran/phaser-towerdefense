/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

export class Tower extends Phaser.GameObjects.Image {
  private timer: Phaser.Time.TimerEvent;
  private isTimerActive: boolean;

  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame);
    this.isTimerActive = false;
  }

  addTowerEventTimer(timer: number) {
    this.isTimerActive = true;
    this.timer = this.scene.time.addEvent({
      delay: timer,
      callback: this.towerEvent,
      callbackScope: this,
      loop: true
    });
  }

  update(): void {
  }
  startTimer(): void {
  }
  getIsTimerActive(): boolean {
    return this.isTimerActive;
  }
  towerEvent(): void {
  }
}