/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */


import * as q from '@qramana/qramana';

import { Laser } from "./laser";
export class Enemy extends Phaser.GameObjects.Image {
  private speed: number;
  private speedCount: number;
  // private qState: q.Qubit;
  private qState: number;
  private isDestroyed: boolean;
  private relatedObject: Laser[];

  constructor(params) {
    super(params.scene, params.x, params.y, "enemy_" + Enemy.getNameFromState(params.state), params.frame);
    this.scene.add.existing(this);
    this.speed = params.speed;
    this.speedCount = 0;
    this.qState = 1;
    if (params.state[0] == -1) {
      this.qState = 0;
    }
    this.isDestroyed = false;
    this.relatedObject = [];
    // this.qState = new q.Qubit({value: "|1>"});
  }

  addRelation(func: Laser): void {
    this.relatedObject.push(func);
  }

  update(distanceMap: number[][]): boolean {
    this.speedCount += 1;
    if (this.speedCount >= this.speed) {
      this.speedCount = 0;
      const diff = this.calculateDiff(distanceMap);
      this.x += diff[0];
      this.y += diff[1];
    }

    return this.isDestroyed;
  }

  hit(operate: string): void {
    if (this.isDestroyed) {
      return;
    }
    if (operate == "not") {
      if (this.qState == 1) {
        this.qState = 0;
        this.setTexture("enemy_" + "177");
      } else {
        this.qState = 1;
        this.setTexture("enemy_" + "f77");
      }
    } else if (operate == "measure") {
      if (this.qState == 1) {
        this.isDestroyed = true;
        for (let laser of this.relatedObject) {
          laser.destroyByEnemyDestroied();
        }
      }
    }
  }

  private calculateDiff(distanceMap: number[][]): number[] {
    const nowPos = this.calculateNowMapPos(this.x, this.y);
    let minPosX = 0;
    let minPosY = 0;
    let minDistance = 100;
    
    const diffPos = [[0, 1], [1, 0], [-1, 0], [0, -1]];
    for (let dPos of diffPos) {
      let x = nowPos[0] + dPos[0];
      let y = nowPos[1] + dPos[1];
      if (x < 0 || x >= distanceMap.length) continue;
      if (y < 0 || y >= distanceMap[0].length) continue;
      if (distanceMap[x][y] != null && minDistance > distanceMap[x][y]) {
        minDistance = distanceMap[x][y];
        minPosX = x;
        minPosY = y;
      }
    }
    const nanameDiffPos = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
    const nanameDiffRelationPos = {
      "1_1": [[0, 1], [1, 0]],
      "-1_1": [[0, 1], [-1, 0]],
      "1_-1": [[0, -1], [1, 0]],
      "-1_-1": [[0, -1], [-1, 0]]
    };
    for (let dPos of nanameDiffPos) {
      let isExistTower = true;
      for (let dRelationPos of nanameDiffRelationPos[dPos[0] + "_" + dPos[1]]) {
        let x = nowPos[0] + dRelationPos[0];
        let y = nowPos[1] + dRelationPos[1];
        if (x < 0 || x >= distanceMap.length) continue;
        if (y < 0 || y >= distanceMap[0].length) continue;
        if (distanceMap[x][y]) {
          isExistTower = false;
        }
      }
      if (isExistTower) continue;
      let x = nowPos[0] + dPos[0];
      let y = nowPos[1] + dPos[1];
      if (x < 0 || x >= distanceMap.length) continue;
      if (y < 0 || y >= distanceMap[0].length) continue;
      if (distanceMap[x][y] != null && minDistance > distanceMap[x][y]) {
        minDistance = distanceMap[x][y];
        minPosX = x;
        minPosY = y;
      }
    }

    const diff = [];
    const targetCPosX = minPosX * 32 + 16;
    const targetCPosY = minPosY * 32 + 16;
    const diffX = targetCPosX - this.x;
    const diffY = targetCPosY - this.y;
    const length = Math.sqrt(diffX * diffX + diffY * diffY);
    diff.push(diffX / length * 2);
    diff.push(diffY / length * 2);

    // tower check
    const vartexes = [[-8, -8], [8, -8], [-8, 8], [-8, -8]];
    for (let vartex of vartexes) {
      const nowVartPos = this.calculateNowMapPos(this.x + vartex[0], this.y + vartex[1]);
      const nextPos = this.calculateNowMapPos(this.x + diff[0] + vartex[0], this.y + diff[1] + vartex[1]);
      if (!distanceMap[nextPos[0]][nextPos[1]]) {
        if (nextPos[0] - nowVartPos[0] != 0) {
          diff[0] = 0;
          if (diff[1] >= 0) diff[1] = 2;
          else diff[1] = -2;
        } else if (nextPos[1] - nowVartPos[1] != 0) {
          if (diff[0] >= 0) diff[0] = 2;
          else diff[0] = -2;
          diff[1] = 0;
        }
        break
      }
    }
    return diff;
  }

  private calculateNowMapPos(x: number, y: number): number[] {
    const pos = [];
    const mapPosX = Math.floor(x / 32);
    const mapPosY = Math.floor(y / 32);
    pos.push(mapPosX);
    pos.push(mapPosY);
    // pos.push(x - (mapPosX * 32 + 16));
    // pos.push(y - (mapPosY * 32 + 16));
    return pos;
  }

  static getNameFromState(state: object): string {
    const realStr = Enemy.convertStateToColorStr(state["real"]);
    const imStr = Enemy.convertStateToColorStr(state["im"]);
    const plusStr = Enemy.convertStateToColorStr(state["plus"]);
    console.log("state string: (" + realStr + imStr + plusStr + ")");
    return realStr + imStr + plusStr;
  }

  static convertStateToColorStr(stateValue: number): string {
    const mapping = ["1", "3", "5", "7", "9", "b", "d", "f"];
    const stateValue256 = Enemy.convertStateTo256Int(stateValue);
    const colorIndex = Math.floor(stateValue256 / 32);
    return mapping[colorIndex];
  }

  static convertStateTo256Int(stateValue: number): number {
    if (stateValue < -1) {
      console.log("less than -1");
      return 0;
    } else if (stateValue > 1) {
      console.log("more than 1");
      return 255;
    } else {
      return Math.floor((stateValue + 1) / 2 * 255);
    }
  }
}