/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

import { Tower } from "../objects/tower";
import { Tower1 } from "../objects/tower1";
import { Menu } from "../objects/menu";

export class MainScene extends Phaser.Scene {
  private towers: Tower[];
  private towersByPos: Tower[][];
  private timer: Phaser.Time.TimerEvent;
  private clickedQueue: number[][];
  private gameWidth: number;
  private gameHeight: number;
  private menuWidth: number;
  private wallWidth: number;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.pack(
      "preload",
      "./src/towerdefense/assets/pack.json",
      "preload"
    );
  }

  create(): void {
    this.towers = [];
    this.clickedQueue = [];
    this.towersByPos = [];
    this.menuWidth = 4 * 32;
    this.wallWidth = 1 * 32;
    this.gameWidth = 640;
    this.gameHeight = 480
    const towerWidth = this.gameWidth / 32;
    const towerHeight = this.gameHeight / 32;
    for (let i = 0; i < towerWidth; i++) {
      const heightArray = [];
      for (let j = 0; j < towerHeight; j++) {
        heightArray.push(null);
      }
      this.towersByPos.push(heightArray);
    }

    this.add.image(320, 240, "background");

    this.input.on(
      "pointerdown",
      function(point: object) {
        const absX = point["downX"];
        const absY = point["downY"];
        this.clickedQueue.push([absX, absY]);
        const towerPos = this.calculateTowerPos(absX, absY);
        console.log("clicked (" + towerPos[0] + ", " + towerPos[1] + ")");
      },
      this
    );

    const menu = new Menu({
      scene: this,
      x: this.gameWidth - this.menuWidth / 2,
      y: this.gameHeight / 2});
  }

  update(): void {
    if (this.clickedQueue.length > 0){
      for (var pos of this.clickedQueue) {
        if (this.isTowerArea(pos[0], pos[1])) {
          const towerPos = this.calculateTowerPos(pos[0], pos[1]);
          this.addTower(towerPos[0], towerPos[1]);
        } else {
          console.log("menu clicked");
        }
      }
      this.clickedQueue = [];
    }
    for (var tower of this.towers) {
      tower.update();
    }
  }

  private isTowerArea(x: number, y: number): boolean {
    return (x < (this.gameWidth - this.wallWidth - this.menuWidth))
      && (y >= this.wallWidth)
      && (y < this.gameHeight);
  }

  private addTower(x: number, y: number): void {
    const towerPos = this.calculateAbsolutePos(x, y);
    if (!this.towersByPos[x][y]) {
      const tower = new Tower1({
        scene: this,
        x: towerPos[0],
        y: towerPos[1]});
      this.towers.push(tower);
      this.towersByPos[x][y] = tower;
    } else {
      console.log("tower is exist. point (" + x + ", " + y + ")");
    }
  }

  private calculateAbsolutePos(x: number, y: number): number[] {
    const absolutePos: number[]  = [];
    absolutePos.push(x * 32 + 16);
    absolutePos.push(y * 32 + 16);
    return absolutePos;
  }

  private calculateTowerPos(x: number, y: number): number[] {
    const gamePos: number[] = [];
    gamePos.push(Math.floor(x / 32));
    gamePos.push(Math.floor(y / 32));
    return gamePos;
  }
}
