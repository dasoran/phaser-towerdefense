/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

export class Script {
  static loadScript(): object[] {
    return [
      {"startAt": 5000, "state": [1, 1, 1], "place": "right"},
      {"startAt": 6000, "state": [1, 1, 1], "place": "right"},
      {"startAt": 7000, "state": [1, 1, 1], "place": "right"},
      // {"startAt": 10000, "state": [1, 0, 0], "place": "right"},
      // {"startAt": 10000, "state": [1, 0, 0], "place": "right"},
      // {"startAt": 10000, "state": [1, 0, 0], "place": "right"}
    ]
  }
}