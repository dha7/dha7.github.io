// prettier-ignore
import {Wall} from './wall.js';
import { Floor } from "./floor.js";
import { Food } from "./food.js";

export class Level {
  // prettier-ignore
  levelLayout = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0],
      [0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,1,0,0,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,3,3,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,1,0,0,2,0,3,3,3,3,3,3,0,2,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,1,0,0,2,0,3,3,3,3,3,3,0,2,0,0,1,0,0,0,0,0,0,0,0],
      [0,4,4,2,2,2,2,2,1,2,2,2,0,3,3,3,3,3,3,0,2,2,2,1,2,2,2,2,2,4,4,0],
      [0,0,0,0,0,0,0,0,1,0,0,2,0,3,3,3,3,3,3,0,2,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,1,0,0,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0],
      [0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,9,9,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0],
      [0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0],
      [0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

  walls = [];
  foodsCoord = [];
  ghostSpawnCoord = [];
  //kannski ekki flott ad hafa fylki hér
  pacmanSpawnCoord = [];
  baseLength = 30;
  middle = 15 * this.baseLength;
  constructor() {
    this.floor = new Floor(this.baseLength * 32, this.baseLength * 32);
    this.init();
  }

  init() {
    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < 32; j++) {
        switch (this.levelLayout[i][j]) {
          case 0:
            // wall block
            let newWall = new Wall(
              this.baseLength,
              this.baseLength,
              this.baseLength * 0.5,
              j * this.baseLength,
              i * this.baseLength
            );
            this.walls.push(newWall);
            break;
          case 1:
            // food spawn
            let xfoodCoord = j * this.baseLength;
            let yfoodCoord = i * this.baseLength;
            let foodCoord = [xfoodCoord, yfoodCoord];
            this.foodsCoord.push(foodCoord);
            break;
          case 3:
            let xGhostCoord = j * this.baseLength;
            let yGhostCoord = i * this.baseLength;
            let ghostCoord = [xGhostCoord, yGhostCoord];
            this.ghostSpawnCoord.push(ghostCoord);
            break;
          case 4:
            // teleport
            break;
          case 9:
            let xPacmanCoord = j * this.baseLength;
            let yPacmanCoord = i * this.baseLength;
            let pacmanCoord = [xPacmanCoord, yPacmanCoord];
            this.pacmanSpawnCoord.push(pacmanCoord);
            break;
          default:
        }
      }
    }
  }
}
