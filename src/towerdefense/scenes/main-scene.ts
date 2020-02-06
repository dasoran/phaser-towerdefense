/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

import { Tower } from "../objects/tower";
import { Tower1 } from "../objects/tower1";
import { Tower2 } from "../objects/tower2";
import { Menu } from "../objects/menu";
import { Enemy } from "../objects/enemy";
import { Calculate } from "../logic/calculate";
import { Script } from "../logic/script";
import { Tower3 } from "../objects/tower3";
import { Tower4 } from "../objects/tower4";

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
  private menu: Menu;
  private menuWidth: number;
  private wallWidth: number;
  private wallMask: number[][];

  private currentTower: string;

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

    this.currentTower = "tower1";

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

    this.menu = new Menu({
      currentTower: this.currentTower,
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

  // initialize enemy timer
  generateEnemyStartTimerClosure(that): CallableFunction {
    return function () {
      for (let enemyConf of that.scripts) {
        that.time.addEvent({
          delay: enemyConf["startAt"],
          callback: that.generateEnemySpawnClosure(enemyConf),
          callbackScope: that,
          loop: false
        });
      }
    }
  }

  update(): void {
    if (this.clickedQueue.length > 0){
      for (var pos of this.clickedQueue) {
        if (this.isTowerArea(pos[0], pos[1])) {
          const towerPos = this.calculateTowerPos(pos[0], pos[1]);
          this.addTower(towerPos[0], towerPos[1]);
          this.distanceMap = this.calc.calculateDisctanceToGoal(this.towersByPos, this.towers.length);
        } else if (this.isMenuArea(pos[0], pos[1])) {
          if (18 * 32 - 16 - 32/2 < pos[0]
              && pos[0] < 18 * 32 - 16 + 32/2
              && 9 * 32 - 32/2 < pos[1]
              && pos[1]< 9 * 32 + 32/2) {
            this.currentTower = "tower1";
            this.menu.changeCurrentTower(this.currentTower);
          } else if (19 * 32 - 32/2 < pos[0]
              && pos[0] < 19 * 32 + 32/2
              && 9 * 32 - 32/2 < pos[1]
              && pos[1] < 9 * 32 + 32/2) {
            this.currentTower = "tower2";
            this.menu.changeCurrentTower(this.currentTower);
          } else if (18 * 32 - 16 - 32/2 < pos[0]
              && pos[0] < 18 * 32 - 16 + 32/2
              && 10.5 * 32 - 32/2 < pos[1]
              && pos[1]< 10.5 * 32 + 32/2) {
            this.currentTower = "tower3";
            this.menu.changeCurrentTower(this.currentTower);
          } else if (19 * 32 - 32/2 < pos[0]
              && pos[0] < 19 * 32 + 32/2
              && 10.5 * 32 - 32/2 < pos[1]
              && pos[1] < 10.5 * 32 + 32/2) {
            this.currentTower = "tower4";
            this.menu.changeCurrentTower(this.currentTower);
          } else if (18 * 32 - 16 - 32/2 < pos[0]
              && pos[0] < 18 * 32 - 16 + 32/2
              && 12 * 32 - 32/2 < pos[1]
              && pos[1]< 12 * 32 + 32/2) {
            this.currentTower = "tower5";
            this.menu.changeCurrentTower(this.currentTower);
          } else if (19 * 32 - 32/2 < pos[0]
              && pos[0] < 19 * 32 + 32/2
              && 12 * 32 - 32/2 < pos[1]
              && pos[1] < 12 * 32 + 32/2) {
            this.currentTower = "tower6";
            this.menu.changeCurrentTower(this.currentTower);
          } else if (18 * 32 - 48 < pos[0]
            && pos[0] < 18 * 32 - 16 + 48
            && 13.5 * 32 - 16 < pos[1]
            && pos[1]< 13.5 * 32 + 16) {
            this.menu.clickStartButton(this.generateEnemyStartTimerClosure(this));
          } else {

          }
        } else {
          console.log("other clicked");
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
    
    this.menu.update();

    for (let tower of this.towers) {
      tower.update();
    }

    const enemies = []
    for (let enemy of this.enemies) {
      if (enemy.update(this.distanceMap)) {
        enemy.destroy();
      } else {
        enemies.push(enemy);
      }
    }
    if (this.enemies.length != enemies.length) {
      while(this.enemies.length != 0) {
        this.enemies.pop();
      }
      for (let enemy of enemies) {
        this.enemies.push(enemy);
      }
    }
  }

  getEnemies(): Enemy[] {
    return this.enemies;
  }

  private generateEnemySpawnClosure(conf: object): CallableFunction {
    return function () {
      console.log("enemy spawn: " + JSON.stringify(conf))
      const state = {
        "one_real": conf["state"][0],
        "one_im": conf["state"][1],
        "zero_real": conf["state"][2],
        "zero_im": conf["state"][3]
      }
      this.enemies.push(new Enemy({
        scene: this,
        state: state,
        speed: 5,
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

  private isMenuArea(x: number, y: number): boolean {
    return (x >= this.gameWidth - this.menuWidth)
      && (x < this.gameWidth)
      && (y >= 0)
      && (y < this.gameHeight);
  }

  private addTower(x: number, y: number): void {
    const towerPos = this.calculateAbsolutePos(x, y);
    if (!this.towersByPos[x][y]) {
      let tower = null;
      if (this.currentTower == "tower1") {
        tower = new Tower1({
          enemies: this.enemies,
          scene: this,
          x: towerPos[0],
          y: towerPos[1]});
      } else if (this.currentTower == "tower2") {
        tower = new Tower2({
          enemies: this.enemies,
          scene: this,
          x: towerPos[0],
          y: towerPos[1]});
      } else if (this.currentTower == "tower3") {
        tower = new Tower3({
          enemies: this.enemies,
          scene: this,
          x: towerPos[0],
          y: towerPos[1]});
      } else if (this.currentTower == "tower4") {
        tower = new Tower4({
          enemies: this.enemies,
          scene: this,
          x: towerPos[0],
          y: towerPos[1]});
      } else {
        console.log("no tower");
        return;
      }
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
