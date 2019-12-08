/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

import { Tower } from "../objects/tower";
import { Tower1 } from "../objects/tower1";
import { Menu } from "../objects/menu";
import { Enemy } from "../objects/enemy";
import { Calculate } from "../logic/calculate";
import { Script } from "../logic/script";

export class MainScene extends Phaser.Scene {
  private towers: Tower[];
  private towersByPos: Tower[][];
  private towerEstablishTimer: Phaser.Time.TimerEvent;
  private isTowerEstablish: boolean;
  private clickedQueue: number[][];
  private gameWidth: number;
  private gameHeight: number;
  private goalX: number;
  private goalY: number;
  private menuWidth: number;
  private wallWidth: number;
  private wallMask: number[][];

  private calc: Calculate;
  private distanceMap: number[][];

  private scripts: object[];
  private enemies: Enemy[];

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
    this.menuWidth = 4 * 32;
    this.wallWidth = 1 * 32;
    this.gameWidth = 640;
    this.gameHeight = 480
    this.goalX = 0;
    this.goalY = 7;

    // initialize tower data
    const towerWidth = this.gameWidth / 32;
    const towerHeight = this.gameHeight / 32;
    this.towersByPos = [];
    for (let i = 0; i < towerWidth; i++) {
      const heightArray = [];
      for (let j = 0; j < towerHeight; j++) {
        heightArray.push(null);
      }
      this.towersByPos.push(heightArray);
    }

    // initialize wall mask
    this.generateWallMask(towerWidth, towerHeight);

    // initialize about calculating distance
    this.calc = new Calculate(this.gameWidth, this.gameHeight, this.goalX, this.goalY, this.wallMask);
    this.distanceMap = this.calc.calculateDisctanceToGoal(this.towersByPos, this.towers.length);

    // initialize enemy data
    this.scripts = Script.loadScript();
    for (let enemyConf of this.scripts) {
      this.time.addEvent({
        delay: enemyConf["startAt"],
        callback: this.generateEnemySpawnClosure(enemyConf),
        callbackScope: this,
        loop: false
      });
    }
    this.enemies = [];

    // initialize io
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

    this.isTowerEstablish = false;
    this.towerEstablishTimer = this.time.addEvent({
      delay: 1000,
      callback: this.activeTowerEstablish,
      callbackScope: this,
      loop: true
    });
  }

  update(): void {
    if (this.clickedQueue.length > 0){
      for (var pos of this.clickedQueue) {
        if (this.isTowerArea(pos[0], pos[1])) {
          const towerPos = this.calculateTowerPos(pos[0], pos[1]);
          this.addTower(towerPos[0], towerPos[1]);
          this.distanceMap = this.calc.calculateDisctanceToGoal(this.towersByPos, this.towers.length);
        } else {
          console.log("menu clicked");
        }
      }
      this.clickedQueue = [];
    }
    if (this.isTowerEstablish) {
      this.isTowerEstablish = false;
      for (var tower of this.towers) {
        if (!tower.getIsTimerActive()) {
          tower.startTimer();
        }
      }
    }

    
    for (let tower of this.towers) {
      tower.update();
    }

    for (let enemy of this.enemies) {
      enemy.update(this.distanceMap);
    }
  }

  private generateEnemySpawnClosure(conf: object): CallableFunction {
    return function () {
      console.log("enemy spawn: " + JSON.stringify(conf))
      const state = {
        "real": conf["state"][0],
        "im": conf["state"][1],
        "plus": conf["state"][2]
      }
      this.enemies.push(new Enemy({
        scene: this,
        state: state,
        speed: 3,
        x: this.gameWidth - this.menuWidth - 16,
        y: this.gameHeight / 2}));
    };
  }

  private activeTowerEstablish(): void {
    this.isTowerEstablish = true;
  }

  private isTowerArea(x: number, y: number): boolean {
    return (x >= this.wallWidth)
      && (x < (this.gameWidth - this.wallWidth - this.menuWidth))
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

  private generateWallMask(width: number, height: number): void {
    this.wallMask = [];
    for (let i = 0; i < width; i++) {
      const heightArray = [];
      for (let j = 0; j < height; j++) {
        if (i == this.goalX && j == this.goalY) {
          heightArray.push(false);
        } else if (j < this.wallWidth / 32 && i >= 6 && i <=9) {
          heightArray.push(false);
        } else if (i >= 15 && i < 15 + this.wallWidth/ 32 && j >= 6 && j <= 8) {
          heightArray.push(false);
        } else if (i < this.wallWidth/ 32) {
          heightArray.push(true);
        } else if (i >= 15 && i < 15 + this.wallWidth/ 32) {
          heightArray.push(true);
        } else if (j < this.wallWidth / 32) {
          heightArray.push(true);
        } else {
          heightArray.push(false);
        }
      }
      this.wallMask.push(heightArray);
    }
  }
}
