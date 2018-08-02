'use strict';

//Stage 기능을 알리기 위해서 일부러 놔둔 클래스 CBoot;
function CBoot(){};
CBoot.prototype =
{
	create : function() {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	}
}

function global_preload()
{
	game.state.add('boot', CBoot);

}

function start_from_here()
{
	game = new Phaser.Game(GameOption.ScreenWidth, GameOption.ScreenHeight,
	Phaser.CANVAS, null, {preload : global_preload});
}

start_from_here();
//-----------------------------------고치기 전-----------------------------------------
// var game;
// game = new Phaser.Game(720, 1280, Phaser.CANVAS, null,
// {preload : preload, create : create, update : update});

//top, board

// var Background_top;
// var Background_board;
// var Check_1 = 0;
// var Check_2 = 0;
// var Check_3 = 0;
// var Check_4 = 0;
// var Check_5 = 0;
// var Tile;
// var TileX = 7;
// var TileArray = [];
// var bPressed = false;
// var MouseX, MouseY;;;;
// var SelectIndex = 0;
// var bDragged = false;
// var MovePoint = 100;
// var CurDirection = Direction.END;
// var bSelectDir = false;
// var TileStartPos;
// var Count = 470;
// var bRemove = false;

// function TileMaker(TileY){
//   for(var i = 0; i < TileX; ++i)
//   {
//     var TileNumber = (Math.floor(Math.random() * 6)) + 1;
//     if(TileNumber === 6)
//     {
//       TileNumber = 5;
//     }
//
//     if(TileNumber === 1){
//       Check_1++;
//     }
//     else if (TileNumber === 2){
//       Check_2++;
//     }
//     else if(TileNumber === 3){
//       Check_3++;
//     }
//     else if(TileNumber === 4){
//       Check_4++;
//     }
//     else if(TileNumber === 5){
//       Check_5++;
//     }
//
//     if(Check_1 >= 3){
//       Check_1 = 0;
//       TileNumber = 2;
//       console.log(1);
//     }
//     else if(Check_2 >= 3){
//       Check_2 = 0;
//       TileNumber = 3;
//       console.log(2);
//     }
//     else if(Check_3 >= 3){
//       Check_3 = 0;
//       TileNumber = 4;
//       console.log(3);
//     }
//     else if(Check_4 >= 3){
//       Check_4 = 0;
//       TileNumber = 5;
//       console.log(4);
//     }
//     else if(Check_5 >= 3){
//       Check_5 = 0;
//       TileNumber = 1;
//       console.log(5);
//     }
//     TileArray.push(Tile.create(i * 100, TileY, 'Tile_' + TileNumber));
//   }
// }
//
// function MousePicking()
// {
//   var ImageLeftX;
//   var ImageRightX;
//   var ImageUpY;
//   var ImageDownY;
//   if(game.input.activePointer.leftButton.isDown && bPressed == false)
//   {
//     if(bPressed)
//     {
//       return;
//     }
//     for(var i = 0; i < TileArray.length; ++i)
//     {
//       ImageLeftX = TileArray[i].position.x;
//       ImageRightX = TileArray[i].position.x + TileArray[i]._frame.sourceSizeW;
//       ImageUpY = TileArray[i].position.y;
//       ImageDownY = TileArray[i].position.y + TileArray[i]._frame.sourceSizeH;
//
//       if(MouseX >= ImageLeftX && ImageRightX >= MouseX)
//       {
//         if(MouseY >= ImageUpY && MouseY <= ImageDownY)
//         {
//           bPressed = true;
//           SelectIndex = i;
//           console.log(i);
//           return;
//         }
//       }
//      }
//   }
//   else if(game.input.activePointer.leftButton.isUp && bPressed == true)
//   {
//     bPressed = false;
//     bDragged = false;
//   }
// }
//
// function SelectDir()
// {
//   var ImageLeftX;
//   var ImageRightX;
//   var ImageUpY;
//   var ImageDownY;
//
//   ImageLeftX = TileArray[SelectIndex].position.x;
//   ImageRightX = TileArray[SelectIndex].position.x + TileArray[SelectIndex]._frame.sourceSizeW;
//   ImageUpY = TileArray[SelectIndex].position.y;
//   ImageDownY = TileArray[SelectIndex].position.y + TileArray[SelectIndex]._frame.sourceSizeH;
//
//   if(bDragged)
//     return;
//   //상
//   if(MouseY < ImageUpY && bDragged == false){
//     CurDirection = Direction.UP;
//     bDragged = true;
// 		;;;;
//   }
//   //하
//   else if(MouseY > ImageDownY && bDragged == false){
//     CurDirection = Direction.DOWN;
//     bDragged = true;
//   }
//   //좌
//   else if(MouseX < ImageLeftX && bDragged == false){
//     CurDirection = Direction.LEFT;
//     bDragged = true;
//   }
//   //우
//   else if(MouseX > ImageRightX && bDragged == false){
//     CurDirection = Direction.RIGHT;
//     bDragged = true;
//   }
// }
//
// function CheckMatch(){
//   for(var i = 0; i < TileArray.length - 2; ++i){
//     if(i != 5 && i != 6 && i != 12 && i != 13 && i != 19 && i != 20 &&
//     i != 26 && i != 27 && i != 33 && i != 34 && i != 40 && i != 41 &&
//     i != 47 && i != 48){
//       if(TileArray[i].key == TileArray[i + 1].key && TileArray[i + 1].key == TileArray[i + 2].key){
//         TileArray[i].kill();
//         TileArray[i + 1].kill();
//         TileArray[i + 2].kill();
//         //Tile.destroy();
//         bRemove = true;
//       }
//     }
//   }
// }
//
// function IndexSwap(){
//   switch(CurDirection){
//     case Direction.UP:
//           var TempY = TileArray[SelectIndex].position.y;
//           var TempY1 = TileArray[SelectIndex - 7].position.y;
//           TileArray[SelectIndex].position.y = TempY1;
//           TileArray[SelectIndex - 7].position.y = TempY;
//           var Tile = TileArray[SelectIndex];
//           TileArray[SelectIndex] = TileArray[SelectIndex - 7];
//           TileArray[SelectIndex - 7] = Tile;
//           break;
//
//     case Direction.DOWN:
//           var TempY = TileArray[SelectIndex].position.y;
//           var TempY1 = TileArray[SelectIndex + 7].position.y;
//           TileArray[SelectIndex].position.y = TempY1;
//           TileArray[SelectIndex + 7].position.y = TempY;
//           var Tile = TileArray[SelectIndex];
//           TileArray[SelectIndex] = TileArray[SelectIndex + 7];
//           TileArray[SelectIndex + 7] = Tile;
//           break;
//     case Direction.LEFT:
//           var TempX = TileArray[SelectIndex].position.x;
//           var TempX1 = TileArray[SelectIndex - 1].position.x;
//           TileArray[SelectIndex].position.x = TempX1;
//           TileArray[SelectIndex - 1].position.x = TempX;
//           var Tile = TileArray[SelectIndex];
//           TileArray[SelectIndex] = TileArray[SelectIndex - 1];
//           TileArray[SelectIndex - 1] = Tile;
//           break;
//     case Direction.RIGHT:
//           var TempX = TileArray[SelectIndex].position.x;
//           var TempX1 = TileArray[SelectIndex + 1].position.x;
//           TileArray[SelectIndex].position.x = TempX1;
//           TileArray[SelectIndex + 1].position.x = TempX;
//           var Tile = TileArray[SelectIndex];
//           TileArray[SelectIndex] = TileArray[SelectIndex + 1];
//           TileArray[SelectIndex + 1] = Tile;
//           break;
//   }
// }
//
// function MoveTile(){
//   if(CurDirection === Direction.UP){
//     if(SelectIndex != 0 && SelectIndex != 1 && SelectIndex != 2 &&
//     SelectIndex != 3 && SelectIndex != 4 && SelectIndex != 5 && SelectIndex != 6){
//       IndexSwap();
//       CurDirection = Direction.END;
//       bDragged = false;
//       bPressed = false;
//     }
//   }
//   else if(CurDirection === Direction.DOWN){
//     if(SelectIndex != 42 && SelectIndex != 43 && SelectIndex != 44 &&
//     SelectIndex != 45 && SelectIndex != 46 && SelectIndex != 47 && SelectIndex != 48){
//       IndexSwap();
//       CurDirection = Direction.END;
//       bDragged = false;
//       bPressed = false;
//     }
//   }
//   else if(CurDirection === Direction.LEFT){
//     if(SelectIndex != 0 && SelectIndex != 7 && SelectIndex != 14 &&
//     SelectIndex != 21 && SelectIndex != 28 && SelectIndex != 35 && SelectIndex != 42){
//       IndexSwap();
//       CurDirection = Direction.END;
//       bDragged = false;
//       bPressed = false;
//     }
//   }
//   else if(CurDirection === Direction.RIGHT){
//     if(SelectIndex != 6 && SelectIndex != 13 && SelectIndex != 20 &&
//     SelectIndex != 27 && SelectIndex != 34 && SelectIndex != 41 && SelectIndex != 48){
//       IndexSwap();
//       CurDirection = Direction.END;
//       bDragged = false;
//       bPressed = false;
//     }
//   }
// }

// function preload(){
//   game.load.image('BackGround_Top', 'tile-assets/asset/bg_top.jpg');
//   game.load.image('BackGround_Board', 'tile-assets/asset/bg_board.png');
//   game.load.image('Tile_1', 'tile-assets/asset/block_01.png');
//   game.load.image('Tile_2', 'tile-assets/asset/block_02.png');
//   game.load.image('Tile_3', 'tile-assets/asset/block_03.png');
//   game.load.image('Tile_4', 'tile-assets/asset/block_06.png');
//   game.load.image('Tile_5', 'tile-assets/asset/block_07.png');
// }

// function create(){
//   game.physics.startSystem(Phaser.Physics.ARCADE);
//
//   Background_top = game.add.group();
//   Background_board = game.add.group();
//   Tile = game.add.group();
//
//   Background_top.create(BackGroundPos.BACKGROUND_TOPX, BackGroundPos.BACKGROUND_TOPY, 'BackGround_Top');
//   Background_board.create(BackGroundPos.BACKGROUND_BOARDX, BackGroundPos.BACKGROUND_BOARDY, 'BackGround_Board');
//
//   for(var i = 0; i < 7; ++i){
//     TileMaker(Count);
//     Count += 100;
//   }
// }

// function update(){
//   MouseX = game.input.activePointer.x;
//   MouseY = game.input.activePointer.y;
//   // 마우스 피킹
//   MousePicking();
//
//   // 선택한 녀석 움직이기
//   if(bPressed)
//   {
//     SelectDir();
//     if(bDragged)
//       MoveTile();
//   }
//   //console.log(TileArray[1].key);
//   //if(!bRemove)
//    CheckMatch();
// }
