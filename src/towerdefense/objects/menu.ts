import { Tilemaps } from "phaser";
import { Calculate } from "../logic/calculate";

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
  private startButtonSprite: Phaser.GameObjects.TileSprite;
  private startCount: number;

  constructor(params) {
    super(params.scene, params.x, params.y, "menu", params.frame);
    this.scene.add.existing(this);
    this.towerButtonState = {};
    this.towerButtonState["tower1"] = false;
    this.towerButtonState["tower2"] = false;
    this.towerButtonState["tower3"] = false;
    this.towerButtonState["tower4"] = false;
    this.towerButtonState["tower5"] = false;
    this.towerButtonState["tower6"] = false;
    this.towerButtonState[params.currentTower] = true;
    this.towerPos = {};
    this.towerPos["tower1"] = [18 * 32 - 16, 9 * 32];
    this.towerPos["tower2"] = [19 * 32, 9 * 32];
    this.towerPos["tower3"] = [18 * 32 - 16, 10.5 * 32];
    this.towerPos["tower4"] = [19 * 32, 10.5 * 32];
    this.towerPos["tower5"] = [18 * 32 - 16, 12 * 32];
    this.towerPos["tower6"] = [19 * 32, 12 * 32];
    this.isNeedUpdate = true;
    this.towerButtonSprite = {};
    this.startButtonSprite = null;
    this.startCount = -1;
  }

  generateTowerButtonSpripe(towerName: string, state: boolean): Phaser.GameObjects.TileSprite {
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

  generateStartButtonStripe(): Phaser.GameObjects.TileSprite {
    let texKey = null;
    if (this.startCount > 0 && this.startCount <= 3) {
      texKey = "countdown_" + this.startCount.toString();
    } else if (this.startCount == -1) {
      texKey = "start";
    } else {
      return null;
    }
    return new Phaser.GameObjects.TileSprite(
      this.scene,
      18 * 32,
      13.5 * 32,
      96,
      32,
      texKey);
  }

  update(): void {
    if (!this.isNeedUpdate) return;
    this.isNeedUpdate = false;

    const lastStartStripe = this.startButtonSprite
    this.startButtonSprite = this.generateStartButtonStripe();
    if (this.startButtonSprite) {
      this.scene.add.existing(this.startButtonSprite);
    }
    if (lastStartStripe) {
      lastStartStripe.destroy();
    }

    for (let towerName in this.towerButtonState) {
      const towerState = this.towerButtonState[towerName];
      const lastSprite = this.towerButtonSprite[towerName];
      this.towerButtonSprite[towerName] = this.generateTowerButtonSpripe(towerName, towerState);
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

  clickStartButton(starter: CallableFunction): void {
    this.scene.time.addEvent({
      delay: 1000,
      callback: this.countdownStartTime,
      callbackScope: this,
      loop: false
    });
    this.scene.time.addEvent({
      delay: 3000,
      callback: starter,
      callbackScope: this,
      loop: false
    });
    this.isNeedUpdate = true;
    this.startCount = 3;
    console.log("count down: " + this.startCount);
  }

  countdownStartTime(): void {
    this.isNeedUpdate = true;
    this.startCount -= 1;
    console.log("count down: " + this.startCount);
    if (this.startCount > 0) {
      this.scene.time.addEvent({
        delay: 1000,
        callback: this.countdownStartTime,
        callbackScope: this,
        loop: false
      });
    }
  }
}