/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

export class Menu extends Phaser.GameObjects.Image {
  private timer: Phaser.Time.TimerEvent;

  constructor(params) {
    super(params.scene, params.x, params.y, "menu", params.frame);
    this.scene.add.existing(this);
  }

  update(): void {
  }
}