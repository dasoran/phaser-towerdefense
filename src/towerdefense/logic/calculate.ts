/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

import { Tower } from "../objects/tower";

export class Calculate {
  private gameWidth;
  private gameHeight;
  private goalPos;
  private wallMask;

  constructor(gameWidth: number, gameHeight: number, goalX: number, goalY: number, wallMask: number[][]) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    this.goalPos = [];
    this.goalPos.push(goalX);
    this.goalPos.push(goalY);

    this.wallMask = wallMask;
  }

  calculateDisctanceToGoal(towersByPos: Tower[][], numberOfTower: number): number[][]{
    const distanceByPos = [];
    let latestNumberedPos = [this.goalPos];
    const allNumberedPost = [this.goalPos];

    const mapWidth = this.gameWidth / 32;
    const mapHeight = this.gameHeight / 32;
    for (let i = 0; i < mapWidth; i++) {
      const heightArray = [];
      for (let j = 0; j < mapHeight; j++) {
        if (i == this.goalPos[0] && j == this.goalPos[1]) {
          heightArray.push(1);
        } else {
          heightArray.push(null);
        }
      }
      distanceByPos.push(heightArray);
    }

    let nowDistance = 1;
    //const diffPos = [[1, 1], [0, 1], [-1, 1], [1, 0], [-1, 0], [1, -1], [0, -1], [-1, -1]];
    const diffPos = [[0, 1], [1, 0], [-1, 0], [0, -1]];
    while(true) {
      nowDistance += 1;
      let nextNumberPos = [];
      for (let pos of latestNumberedPos) {
        for (let dPos of diffPos) {
          let x = pos[0] + dPos[0];
          let y = pos[1] + dPos[1];
          if (x < 0 || x >= mapWidth) continue;
          if (y < 0 || y >= mapHeight) continue;
          if (this.isNullPos(x, y, towersByPos, distanceByPos)) {
            distanceByPos[x][y] = nowDistance;
            nextNumberPos.push([x, y]);
            allNumberedPost.push([x, y]);
          }
        }
      }
      if (nextNumberPos.length == 0) {
        break;
      }
      latestNumberedPos = nextNumberPos;
    }
    return distanceByPos;
  }

  private isNullPos(x: number, y: number, towersByPos: Tower[][], distanceByPos: number[][]): boolean {
    return (!towersByPos[x][y] && !distanceByPos[x][y] && !this.wallMask[x][y]);
  }
}