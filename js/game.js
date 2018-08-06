'use strict';

//Stage 기능을 알리기 위해서 일부러 놔둔 클래스 CBoot;
function CBoot(){};
CBoot.prototype =
{
	create : function() {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.stage.backgroundColor = GameOption.BackgroundColor;
		game.physics.startSystem(Phaser.Physics.ARCADE);
		console.log("CBoot.create() : finish");
		game.state.start('Main');
	}
};

function CMain()
{
	GameMain = this;
	this.MouseCursors = game.input.acitve;
	this.Tile;
	this.TileArray = [];
	this.TileNumber = 1;
	this.TileIDNumber = 1;
	this.FirstTileY = 460;
	this.SelectTile;
	this.SelectTileStartPos = {x : 0, y : 0};
	this.SwapedTileStartPos = {x : 0, y : 0};
	this.BoundRect;
	this.bDragFinish = true;
	this.bNoSwap = false;
	this.SwapedTile;
	this.OverlapTileCount = 0;
	this.bSwapFinish = false;
	this.MoveTile = false;
	this.CurDirection = Direction.END;
	this.SelectTileTween = null;
	this.SwapedTileTween = null;
	this.ReChangeTweenA = null;
	this.ReChangeTweenB = null;
	this.bOnceClick = false;
	//match가 됐는지 판별
	this.bMatch = false;
};
CMain.prototype =
{
	preload : function()
	{
		game.load.image(gameRes.MnbgTop.key, gameRes.MnbgTop.fileName);
		game.load.image(gameRes.MnbgBoard.key, gameRes.MnbgBoard.fileName);
		game.load.image(gameRes.block_01.key, gameRes.block_01.fileName);
		game.load.image(gameRes.block_02.key, gameRes.block_02.fileName);
		game.load.image(gameRes.block_03.key, gameRes.block_03.fileName);
		game.load.image(gameRes.block_04.key, gameRes.block_04.fileName);
		game.load.image(gameRes.block_05.key, gameRes.block_05.fileName);
		this.BoundRect = new Phaser.Rectangle(0, game.width / 1.8, 720, 802);

		console.log(game.width);
		console.log(game.height);
	},

	create : function()
	{
		gameRes.MnbgTop.spr = game.add.image(gameRes.MnbgTop.x, gameRes.MnbgTop.y, gameRes.MnbgTop.key);
		gameRes.MnbgBoard.y = game.width / 1.8;
		gameRes.MnbgBoard.spr = game.add.image(gameRes.MnbgBoard.x, gameRes.MnbgBoard.y, gameRes.MnbgBoard.key);
		this.Tile = game.add.group();
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//this.Tile.onChildInputOver.add(this.onOver, this);
		for(var i = 0; i < 7; ++i){
			this.TileMaker();
			this.FirstTileY += 100;
		}
		this.DuplicateCheck();
	},

	TileMaker : function()
	{
		for(var i = 0; i < BoardInfo.BOARD_COLS; ++i){
			this.TileNumber = getRandom(1, 5);
			var Tile = this.Tile.create(i * 100, this.FirstTileY, 'block_0' + this.TileNumber);
			Tile.anchor.setTo(0, 0.5);
			this.TileNumber += 1;
			if(this.TileNumber >= 6){
				this.TileNumber = 1;
			}
			Tile.Id = 'Tile' + this.TileIDNumber;
			this.TileIDNumber += 1;
			Add_DraggingAndBound(Tile);
			Tile.events.onDragStart.add(this.PickTile, this);
			Tile.events.onDragUpdate.add(this.Dragging, this);
			Tile.events.onDragStop.add(this.SwapTile, this);
			Tile.input.boundsRect = this.BoundRect;
			game.physics.arcade.enable(Tile);
			Tile.body.collideWorldBounds = true;
			Tile.body.setSize(80, 80, 20, 30);
			this.TileArray.push(Tile);
		}
	},
//함수 명 변경 될 수 있음.
	SwapTile : function(Tile, pointer)
	{
		//Tile.position = this.SelectTileStartPos;
		 if(game.input.activePointer.leftButton.isUp){
		 	for(var i = 0; i < this.TileArray.length; ++i){
		 		game.physics.arcade.overlap(this.SelectTile, this.TileArray[i], this.overlapHandler, null, this);
		 	}
			if(this.SwapedTile !== null){
				if(this.bSwapFinish){
					this.CompleteSwap();
					}
			}
			if(this.bOnceClick)
			{
				this.OnceClick();
				this.bOnceClick = false;
			}
		}
	},
	//겹쳐서 스왑하려고 할 경우
	DozenOverlap : function(){
		this.SelectTile.x = this.SelectTileStartPos.x;
		this.SelectTile.y = this.SelectTileStartPos.y;
		this.SelectTile.alpha = 1;
		this.SelectTile = null;
		this.SwapedTile = null;
		this.bNoSwap = false;
		this.bSwapFinish = false;
		this.bDragFinish = true;
		this.MoveTile = false;
		this.OverlapTileCount = 0;
	},
	//스왑이 된 경우
	CompleteSwap : function(){

		this.SelectTile.x = this.SelectTileStartPos.x;
		this.SelectTile.y = this.SelectTileStartPos.y;
		this.TweenStart();
		//TileMatch 검사 부분.
		//this.bMatch = false;

		// if(this.SelectTile !== null && this.SwapedTile !== null){
		// 	//if(match가 됬을 경우)
		// 	//else(match가 되지 않았을 경우)
		//
		// }
		// var TempPosX = this.SwapedTile.position.x;
		// var TempPosY = this.SwapedTile.position.y;
		//
		// this.SwapedTile.x = this.SelectTileStartPos.x;
		// this.SwapedTile.y = this.SelectTileStartPos.y;
		//this.SelectTile.x = TempPosX;
		//this.SelectTile.y = TempPosY;

		this.SelectTile.alpha = 1;
		//this.SelectTile = null;
		this.bSwapFinish = false;
		this.bDragFinish = true;
		this.MoveTile = false;
		//this.SwapedTile = null;
		this.OverlapTileCount = 0;
		console.log('SwapedTile : ' + this.SwapedTile);
		console.log('SelectTile : ' + this.SelectTile);
		console.log('SelectTileStartPos : ' + this.getSelectTileStartPos());
	},
	//제자리 클릭할 경우
	OnceClick : function(){
		this.SelectTile.alpha = 1;
		this.SelectTile.x = this.SelectTileStartPos.x;
		this.SelectTile.y = this.SelectTileStartPos.y;
		this.SelectTile = null;
		this.bDragFinish = true;
	},
//함수 명 변경 될 수 있음./
	PickTile : function(Tile, pointer)
	{
			console.log('호출!!!!');
		//if(game.input.activePointer.leftButton.isDown){
			console.log('Tile.position.x : ' + Tile.position.x, 'Tile.position.y : ' + Tile.position.y);
		//}
	},

	Dragging : function(Tile){
		if(game.input.activePointer.leftButton.isDown){
			if(this.bDragFinish){
				this.SelectTile = Tile;
				var SelectTileStartPosX = this.SelectTile.position.x;
				var SelectTileStartPosY = this.SelectTile.position.y;
				console.log(SelectTileStartPosX, SelectTileStartPosY);
				this.SelectTileStartPos.x = SelectTileStartPosX;
				this.SelectTileStartPos.y = SelectTileStartPosY;
				console.log(this.SelectTileStartPos.x, this.SelectTileStartPos.y);
				console.log(this.SelectTile);
				this.SelectTile.alpha = 0.5;
				this.bDragFinish = false;
			}

			if(this.SelectTile.x <= this.SelectTileStartPos.x - MoveDistance){
				this.SelectTile.x = this.SelectTileStartPos.x - 100;
				this.SelectTile.y = this.SelectTileStartPos.y;
				this.CurDirection = Direction.LEFT;
				this.MoveTile = true;
				this.bOnceClick = false;
			}
			else if(this.SelectTile.x >= this.SelectTileStartPos.x + MoveDistance){
				this.SelectTile.x = this.SelectTileStartPos.x + 100;
				this.SelectTile.y = this.SelectTileStartPos.y;
				this.CurDirection = Direction.RIGHT;
				this.MoveTile = true;
				this.bOnceClick = false;
			}
			else if(this.SelectTile.y <= this.SelectTileStartPos.y - MoveDistance){
				this.SelectTile.x = this.SelectTileStartPos.x;
				this.SelectTile.y = this.SelectTileStartPos.y - 100;
				this.CurDirection = Direction.UP;
				this.MoveTile = true;
				this.bOnceClick = false;
			}
			else if(this.SelectTile.y >= this.SelectTileStartPos.y + MoveDistance){
				this.SelectTile.x = this.SelectTileStartPos.x;
				this.SelectTile.y = this.SelectTileStartPos.y + 100;
				this.CurDirection = Direction.DOWN;
				this.MoveTile = true;
				this.bOnceClick = false;
			}
			else if(Math.abs(this.SelectTile.x - this.SelectTileStartPos.x) <= 40){
				if(this.SwapedTile !== null)
					this.SwapedTile = null;
				this.SelectTile.x = this.SelectTileStartPos.x;
				this.SelectTile.y = this.SelectTileStartPos.y;
				this.CurDirection = Direction.END;
				this.bOnceClick = true;
				this.MoveTile = false;
			}
			else if(Math.abs(this.SelectTile.y - this.SelectTileStartPos.y) <= 40){
				if(this.SwapedTile !== null)
					this.SwapedTile = null;
				this.SelectTile.x = this.SelectTileStartPos.x;
				this.SelectTile.y = this.SelectTileStartPos.y;
				this.CurDirection = Direction.END;
				this.bOnceClick = true;
				this.MoveTile = false;
			}

			if(this.CurDirection === Direction.END)
				this.bOnceClick = true;
			}
		},

	overlapHandler(SelectTile, Tile){
		this.OverlapTileCount++;
		var OverlapTileArray =[];
		OverlapTileArray.push(Tile);
		// if(1 < this.OverlapTileCount){
		// 	this.bNoSwap = true;
		// }
		this.SwapedTile = OverlapTileArray[OverlapTileArray.length - 1];
		this.bSwapFinish = true;
		//this.bDragFinish = true;
		for(var i = 0; i < OverlapTileArray.length; ++i){
			console.log(OverlapTileArray);

		}
	},

	// MatchTileCheck : function(){
	//
	// },

	DuplicateCheck : function(Tile){
		var KillTilePosx = 0;
		var KillTilePosy = 0;
		var Tile;

		for(var i = 0; i < this.TileArray.length - 2; ++i)
		{
			//처음 생성시 x축 중복 제거
			if(this.TileArray[i].x !== 600)
			{
				if(this.TileArray[i].key === 'block_01')
				{
					if(this.TileArray[i].key === this.TileArray[i + 2].key)
					{
						KillTilePosx = this.TileArray[i + 2].x;
						KillTilePosy = this.TileArray[i + 2].y;
						this.TileArray[i + 2].kill();
						this.TileArray[i + 2] = null;
						if(this.TileArray[i + 2] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_02');
							this.TileArray[i + 2] = Tile;
						}
					}
				}
				else if(this.TileArray[i].key === 'block_02')
				{
					if(this.TileArray[i].key === this.TileArray[i + 2].key)
					{
						KillTilePosx = this.TileArray[i + 2].x;
						KillTilePosy = this.TileArray[i + 2].y;
						this.TileArray[i + 2].kill();
						this.TileArray[i + 2] = null;
						if(this.TileArray[i + 2] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_03');
							this.TileArray[i + 2] = Tile
						}
					}
				}
				else if(this.TileArray[i].key === 'block_03')
				{
					if(this.TileArray[i].key === this.TileArray[i + 2].key)
					{
						KillTilePosx = this.TileArray[i + 2].x;
						KillTilePosy = this.TileArray[i + 2].y;
						this.TileArray[i + 2].kill();
						this.TileArray[i + 2] = null;
						if(this.TileArray[i + 2] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_04');
							this.TileArray[i + 2] = Tile;
						}
					}
				}
				else if(this.TileArray[i].key === 'block_04')
				{
					if(this.TileArray[i].key === this.TileArray[i + 2].key)
					{
						KillTilePosx = this.TileArray[i + 2].x;
						KillTilePosy = this.TileArray[i + 2].y;
						this.TileArray[i + 2].kill();
						this.TileArray[i + 2] = null;
						if(this.TileArray[i + 2] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_05');
							this.TileArray[i + 2] = Tile;
						}
					}
				}
				else if(this.TileArray[i].key === 'block_05')
				{
					if(this.TileArray[i].key === this.TileArray[i + 2].key)
					{
						KillTilePosx = this.TileArray[i + 2].x;
						KillTilePosy = this.TileArray[i + 2].y;
						this.TileArray[i + 2].kill();
						this.TileArray[i + 2] = null;
						if(this.TileArray[i + 2] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_01');
							this.TileArray[i + 2] = Tile;
						}
					}
				}
			}
			//처음 생성시 y축 중복 제거
			if(this.TileArray[i].y !== 1060)
			{
				if(this.TileArray[i].key === 'block_01')
				{
					if(this.TileArray[i].key === this.TileArray[i + 7].key)
					{
						KillTilePosx = this.TileArray[i + 7].x;
						KillTilePosy = this.TileArray[i + 7].y;
						this.TileArray[i + 7].kill();
						this.TileArray[i + 7] = null;
						if(this.TileArray[i + 7] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_02');
							this.TileArray[i + 7] = Tile;
						}
					}
				}
				else if(this.TileArray[i].key === 'block_02')
				{
					if(this.TileArray[i].key === this.TileArray[i + 7].key)
					{
						KillTilePosx = this.TileArray[i + 7].x;
						KillTilePosy = this.TileArray[i + 7].y;
						this.TileArray[i + 7].kill();
						this.TileArray[i + 7] = null;
						if(this.TileArray[i + 7] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_03');
							this.TileArray[i + 7] = Tile;
						}
					}
				}
				else if(this.TileArray[i].key === 'block_03')
				{
					if(this.TileArray[i].key === this.TileArray[i + 7].key)
					{
						KillTilePosx = this.TileArray[i + 7].x;
						KillTilePosy = this.TileArray[i + 7].y;
						this.TileArray[i + 7].kill();
						this.TileArray[i + 7] = null;
						if(this.TileArray[i + 7] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_04');
							this.TileArray[i + 7] = Tile;
						}
					}
				}
				else if(this.TileArray[i].key === 'block_04')
				{
					if(this.TileArray[i].key === this.TileArray[i + 7].key)
					{
						KillTilePosx = this.TileArray[i + 7].x;
						KillTilePosy = this.TileArray[i + 7].y;
						this.TileArray[i + 7].kill();
						this.TileArray[i + 7] = null;
						if(this.TileArray[i + 7] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_05');
							this.TileArray[i + 7] = Tile;
						}
					}
				}
				else if(this.TileArray[i].key === 'block_05')
				{
					if(this.TileArray[i].key === this.TileArray[i + 7].key)
					{
						KillTilePosx = this.TileArray[i + 7].x;
						KillTilePosy = this.TileArray[i + 7].y;
						this.TileArray[i + 7].kill();
						this.TileArray[i + 7] = null;
						if(this.TileArray[i + 7] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_01');
							this.TileArray[i + 7] = Tile;
						}
					}
				}
			}
		}
	},

	TileMakeFeature : function(Tile, x, y, Key){
		Tile = this.Tile.create(x, y, Key);
		Tile.anchor.setTo(0, 0.5);
		Add_DraggingAndBound(Tile);
		Tile.events.onDragStart.add(this.PickTile, this);
		Tile.events.onDragUpdate.add(this.Dragging, this);
		Tile.events.onDragStop.add(this.SwapTile, this);
		Tile.input.boundsRect = this.BoundRect;
		game.physics.arcade.enable(Tile);
		Tile.body.collideWorldBounds = true;
		Tile.body.setSize(80, 80, 20, 30);
		return Tile;
	},

	TweenStart : function(){
		this.SwapedTileStartPos.x = this.SwapedTile.x;
		this.SwapedTileStartPos.y = this.SwapedTile.y;
		if(this.CurDirection === Direction.UP || this.CurDirection === Direction.DOWN)
		{
			this.SelectTileTween = game.add.tween(this.SelectTile).to({y : this.SwapedTile.y}, TweenDuration, Phaser.Easing.Linear.None, true);
			this.SwapedTileTween = game.add.tween(this.SwapedTile).to({y : this.SelectTileStartPos.y}, TweenDuration, Phaser.Easing.Linear.None, true);
			this.SelectTileTween.onComplete.add(this.ReChangeTween, this);
			this.SelectTileTween.start();
			this.SwapedTileTween.start();
		}
		else
		{
			this.SelectTileTween = game.add.tween(this.SelectTile).to({ x : this.SwapedTile.x}, TweenDuration, Phaser.Easing.Linear.None, true);
			this.SwapedTileTween = game.add.tween(this.SwapedTile).to({ x : this.SelectTileStartPos.x}, TweenDuration, Phaser.Easing.Linear.None, true);
			this.SelectTileTween.onComplete.add(this.ReChangeTween, this);
			this.SelectTileTween.start();
			this.SwapedTileTween.start();
		}
	},

	ReChangeTween : function(){
		if(this.CurDirection === Direction.UP || this.CurDirection === Direction.DOWN){
			if(this.bMatch === false){
				this.ReChangeTweenA = game.add.tween(this.SelectTile).to({ y : this.SelectTileStartPos.y }, TweenDuration, Phaser.Easing.Linear.None, true);
				this.ReChangeTweenB = game.add.tween(this.SwapedTile).to({ y : this.SwapedTileStartPos.y}, TweenDuration, Phaser.Easing.Linear.None, true);
				this.ReChangeTweenA.start();
				this.ReChangeTweenB.start();
			}
			this.CurDirection = Direction.END;
			this.SelectTile = null;
			this.SwapedTile = null;
		}
		else{
			if(this.bMatch === false){
				this.ReChangeTweenA = game.add.tween(this.SelectTile).to({ x : this.SelectTileStartPos.x }, TweenDuration, Phaser.Easing.Linear.None, true);
				this.ReChangeTweenB  = game.add.tween(this.SwapedTile).to({ x : this.SwapedTileStartPos.x}, TweenDuration, Phaser.Easing.Linear.None, true);
				this.ReChangeTweenA.start();
				this.ReChangeTweenB.start();
			}
			this.CurDirection = Direction.END;
			this.SelectTile = null;
			this.SwapedTile = null;
		}
	},

	getTile : function(posX, posY){
		return this.Tile.iterate('Id', this.SelectTile.Id, Phaser.Group.RETURN_CHILD);
	},

	onDown : function(sprite, pointer){
		console.log(sprite.Id);
	},

	onOver : function(Tile){
		console.log('OnOver : ' + Tile.Id);
	},

	update : function(){
		//console.log(this.getSelectTileStartPos());
		// if(this.SwapedTile != null)
		// 	console.log(this.SwapedTile.position);
		//console.log(this.TileArray[0].position);
		//if(this.SelectTile != null)
		//	console.log(this.SelectTile.position);

	},

	render : function(Tile){
		game.debug.inputInfo(50, 50);
		// for(var i = 0; i < this.TileArray.length; ++i)
		// 	game.debug.body(this.TileArray[i]);
	},

	getSelectTileStartPos : function(){
		return this.SelectTileStartPos;
	}
};

function global_preload()
{
	game.state.add('boot', CBoot);
	console.log('State.add CBoot');
	game.state.add('Main', CMain);
	console.log('State.add CMain');
	game.state.start('boot');
};

function start_from_here()
{
	game = new Phaser.Game(GameOption.ScreenWidth, GameOption.ScreenHeight,
	Phaser.CANVAS, null, {preload : global_preload});
};

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
