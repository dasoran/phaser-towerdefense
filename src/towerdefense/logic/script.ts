/**
 * @author       dasoran <dasoran@gmail.com>
 * @copyright    2019 dasoran
 * @license      {@link https://github.com/dasoran/phaser-towerdefence/blob/master/LICENSE.md | MIT License}
 */

export class Script {
  static loadScript(): object[] {
    return [
      {"startAt": 5000, "state": [1, 0, 0], "place": "right"},
      {"startAt": 7000, "state": [1, 0, 0], "place": "right"},
      {"startAt": 9000, "state": [1, 0, 0], "place": "right"},
      {"startAt": 15000, "state": [-1, 0, 0], "place": "right"},
      {"startAt": 17000, "state": [-1, 0, 0], "place": "right"},
      {"startAt": 19000, "state": [-1, 0, 0], "place": "right"},
      {"startAt": 20000, "state": [1, 0, 0], "place": "right"},
      {"startAt": 28000, "state": [1, 0, 0], "place": "right"},
      {"startAt": 36000, "state": [1, 0, 0], "place": "right"}
    ]
  }
}