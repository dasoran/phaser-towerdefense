/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

export class Menu extends Phaser.GameObjects.Image {
  private timer: Phaser.Time.TimerEvent;
  private towerButtonState: object;
  private towerPos: object;

  constructor(params) {
    super(params.scene, params.x, params.y, "menu", params.frame);
    this.scene.add.existing(this);
    this.towerButtonState = {};
    this.towerButtonState["tower1"] = false;
    this.towerButtonState["tower2"] = false;
    this.towerButtonState[params.currentTower] = true;
    this.towerPos = {};
    this.towerPos["tower1"] = [18 * 32 - 16, 12 * 32];
    this.towerPos["tower2"] = [19 * 32, 12 * 32];
  }

  update(): void {
    for (let towerName in this.towerButtonState) {
      const towerState = this.towerButtonState[towerName];
      const x = this.towerPos[towerName][0];
      const y = this.towerPos[towerName][1];
      if (towerState) {
        this.scene.add.tileSprite(x, y, 32, 32, "button_" + towerName + "_active");
      } else {
        this.scene.add.tileSprite(x, y, 32, 32, "button_" + towerName + "_disable");
      }
    }
  }

  changeCurrentTower(currentTowerName: string): void {
    for (let towerName in this.towerButtonState) {
      this.towerButtonState[towerName] = false;
    }
    this.towerButtonState[currentTowerName] = true;
  }
}