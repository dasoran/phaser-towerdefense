import { Tilemaps } from "phaser";

/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

export class Menu extends Phaser.GameObjects.Image {
  private timer: Phaser.Time.TimerEvent;
  private towerButtonState: object;
  private towerButtonSprite: object;
  private towerPos: object;
  private isNeedUpdate: boolean;

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
    this.isNeedUpdate = true;
    this.towerButtonSprite = {};
  }

  generateTowerButtonSprite(towerName: string, state: boolean): Phaser.GameObjects.TileSprite {
    const x = this.towerPos[towerName][0];
    const y = this.towerPos[towerName][1];
    let texKey = "button_" + towerName;
    if (state) {
      texKey += "_active";
    } else {
      texKey += "_disable";
    }
    return new Phaser.GameObjects.TileSprite(
      this.scene,
      x,
      y,
      32,
      32,
      texKey);
  }

  update(): void {
    if (!this.isNeedUpdate) return;
    this.isNeedUpdate = false;

    for (let towerName in this.towerButtonState) {
      const towerState = this.towerButtonState[towerName];
      const lastSprite = this.towerButtonSprite[towerName];
      this.towerButtonSprite[towerName] = this.generateTowerButtonSprite(towerName, towerState);
      this.scene.add.existing(this.towerButtonSprite[towerName]);
      if (lastSprite) {
        lastSprite.destroy();
      }
    }
  }

  changeCurrentTower(currentTowerName: string): void {
    this.isNeedUpdate = true;
    for (let towerName in this.towerButtonState) {
      this.towerButtonState[towerName] = false;
    }
    this.towerButtonState[currentTowerName] = true;
  }
}