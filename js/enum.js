//실수를 에러로 변환
'use strict';
var game;
var GameMain;
var GameOption =
{
	ScreenWidth : 720,
	ScreenHeight : 1280,
	BackgroundColor : 0x222222
}

var Direction = {
  UP : 1,
  DOWN : 2,
  LEFT : 3,
  RIGHT : 4,
  END : 5
};

var BackGroundPos = {
  BACKGROUND_TOPX : 0,
  BACKGROUND_TOPY : 0,
  BACKGROUND_BOARDX : 0,
  BACKGROUND_BOARDY : 470
};

var BoardInfo = {
	BOARD_COLS : 7,
	BOARD_ROWS : 7
};

var TweenDuration = 300;
var MoveDistance = 40;
