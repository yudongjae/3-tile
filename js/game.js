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
	this.TilePosArray = [];
	this.HorizentalArray = [];
	this.VerticalArray = [];
	this.TileNumber = 1;
	this.TileIDNumber = 0;
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
	//검사 시작
	this.bMatchStart = false;
	//MatchTileCheck
	this.bMatchTileCheck = false;
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
			// this.TileNumber += 1;
			// if(this.TileNumber >= 6){
			// 	this.TileNumber = 1;
			// }

			Tile.Id = this.TileIDNumber;
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
			this.TilePosArray.push(Tile);
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


		//var Tile = this.getTile(600, 1060);
		//console.log(Tile.key);

		this.SelectTile.alpha = 1;
		//this.SelectTile = null;
		this.bSwapFinish = false;

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
			//console.log('Tile.position.x : ' + Tile.position.x, 'Tile.position.y : ' + Tile.position.y);
			console.log(this.TileArray);
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
				console.log(this.SelectTile.Id);
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
		this.SwapedTile = OverlapTileArray[OverlapTileArray.length - 1];
		this.bSwapFinish = true;
		//this.bDragFinish = true;
		// for(var i = 0; i < OverlapTileArray.length; ++i){
		// 	console.log(OverlapTileArray);
		//}
	},
	//08/07
	MatchTile : function(){
		if(this.bMatchStart){
			if(this.bMatchTileCheck){
				this.IndexChange();
				var RightMatchCount = this.MatchTileCheck(100, 0);
				var LeftMatchCount = this.MatchTileCheck(-100, 0);
				var UpMatchCount = this.MatchTileCheck(0, 100);
				var DownMatchCount = this.MatchTileCheck(0, -100);
				this.bMatchTileCheck = false;
			}
			var Horizental = RightMatchCount + LeftMatchCount + 1;
			var Vertical = UpMatchCount + DownMatchCount + 1;

			if(Horizental >= 3)
			{
				if(!this.ArrayEmpty(this.HorizentalArray))
				{
					for(var i = 0; i < this.HorizentalArray.length; ++i){
						this.TileArray[this.HorizentalArray[i].Id].kill();
						this.TileArray[this.HorizentalArray[i].Id] = null;
						this.HorizentalArray[i].kill();
						this.HorizentalArray[i] = null;
					}
				}
				else{
					this.bMatchStart = false;
				}
				this.TileArray[this.SelectTile.Id].kill();
				this.TileArray[this.SelectTile.Id] = null;
				this.SelectTile = null;
				this.SwapedTile = null;
				var TempArray = [];
				var TempArray2 = [];
				this.HorizentalArray = TempArray;
				this.VerticalArray = TempArray2;
				this.bDragFinish = true;
			}

			if(Vertical >= 3)
			{
				if(!this.ArrayEmpty(this.VerticalArray))
				{
					for(var i = 0; i < this.VerticalArray.length; ++i){
						this.TileArray[this.VerticalArray[i].Id].kill();
						this.TileArray[this.VerticalArray[i].Id] = null;
						this.VerticalArray[i].kill();
						this.VerticalArray[i] = null;
					}
				}
				else{
					this.bMatchStart = false;
				}
				this.TileArray[this.SelectTile.Id].kill();
				this.TileArray[this.SelectTile.Id] = null;
				this.SelectTile = null;
				this.SwapedTile = null;
				var TempArray = [];
				var TempArray2 = [];
				this.HorizentalArray = TempArray;
				this.VerticalArray = TempArray2;
				this.bDragFinish = true;
			}

			if(Horizental <= 3 && Vertical <= 3)
			{
				this.ReChangeTween();
				var TempArray = [];
				var TempArray2 = [];
				this.HorizentalArray = TempArray;
				this.VerticalArray = TempArray2;
				this.bMatchStart = false;
				this.bMatchTileCheck = false;
				this.bDragFinish = true;
			}
		}
		this.DropTile()
		//console.log(this.DropTile());
		//console.log(this.TilePosArray);
	},

//08/08
	DropTile : function(){
		var nulltileX, nullTileY;
		var NullTile;
		var check = true;
		var TileIndex;
		var sprTile;
		for(var i = 0; i <= 600; i += 100)
		{
			var DropRowCount = 0;
			for(var j = 1060; j >= 460; j -= 100)
			{
					//TileIndex = this.getNullTile(i, j);
				sprTile = this.getTile(i, j);
				if(sprTile === null)
				{
					DropRowCount += 100;
				}

				else if(DropRowCount >= 100)
				{
					console.log('Yap');
					// if(TileIndex !== undefined)
					// {
					// 	Tile.Id = TileIndex;
					// 	this.TileArray[TileIndex] = Tile;
					// 	this.TilePosArray[TileIndex] = Tile;
					// }
				}
			}
		}
	},

	IndexChange : function(){
		for(var i = 0; i < this.TileArray.length; ++i)
		{
			if(this.TileArray[i] === this.SelectTile)
			{
				var SelectIndex = i;
			}
			else if(this.TileArray[i] === this.SwapedTile)
			{
				var SwapedIndex = i;
			}
		}
		var TempId = this.TileArray[SelectIndex].Id;
		this.TileArray[SelectIndex].Id = this.TileArray[SwapedIndex].Id;
		this.TileArray[SwapedIndex].Id = TempId;
		var TempTile = this.TileArray[SelectIndex];
		this.TileArray[SelectIndex] = this.TileArray[SwapedIndex];
		this.TileArray[SwapedIndex] = TempTile;
	},

	MatchTileCheck : function(moveX, moveY){
		if(this.bMatchStart){
			if(moveX !== 0)
			{
				var CurX = this.SelectTile.x + moveX;
				var CurY = this.SelectTile.y + moveY;
				var MatchTileCount = 0;
				while(CurX >= 0 && CurY >= 460 && CurX <= 600 && CurY <= 1060 && this.getTile(CurX, CurY).key === this.SelectTile.key)
				{
					var getTile = this.getTile(CurX, CurY);
					CurX += moveX;
					CurY += moveY;
					MatchTileCount++;
					this.HorizentalArray.push(getTile);
				}
			}
			else{
				var CurX = this.SelectTile.x + moveX;
				var CurY = this.SelectTile.y + moveY;
				var MatchTileCount = 0;
				while(CurX >= 0 && CurY >= 460 && CurX <= 600 && CurY <= 1060 && this.getTile(CurX, CurY).key === this.SelectTile.key)
				{
					var getTile = this.getTile(CurX, CurY);
					CurX += moveX;
					CurY += moveY;
					MatchTileCount++;
					this.VerticalArray.push(getTile);
				}
			}
		}
		return MatchTileCount;
	},

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
						this.TilePosArray[i + 2].kill();
						this.TileArray[i + 2] = null;
						this.TilePosArray[i + 2] = null;
						if(this.TileArray[i + 2] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_02');
							Tile.Id = i + 2;
							this.TileArray[i + 2] = Tile;
							this.TilePosArray[i + 2] = Tile;
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
						this.TilePosArray[i + 2].kill();
						this.TileArray[i + 2] = null;
						this.TilePosArray[i + 2] = null;
						if(this.TileArray[i + 2] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_03');
							Tile.Id = i + 2;
							this.TileArray[i + 2] = Tile;
							this.TilePosArray[i + 2] = Tile;
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
						this.TilePosArray[i + 2].kill();
						this.TileArray[i + 2] = null;
						this.TilePosArray[i + 2] = null;
						if(this.TileArray[i + 2] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_04');
							Tile.Id = i + 2;
							this.TileArray[i + 2] = Tile;
							this.TilePosArray[i + 2] = Tile;
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
						this.TilePosArray[i + 2].kill();
						this.TileArray[i + 2] = null;
						this.TilePosArray[i + 2] = null;
						if(this.TileArray[i + 2] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_05');
							Tile.Id = i + 2;
							this.TileArray[i + 2] = Tile;
							this.TilePosArray[i + 2] = Tile;
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
						this.TilePosArray[i + 2].kill();
						this.TileArray[i + 2] = null;
						this.TilePosArray[i + 2] = null;
						if(this.TileArray[i + 2] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_01');
							Tile.Id = i + 2;
							this.TileArray[i + 2] = Tile;
							this.TilePosArray[i + 2] = Tile;
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
						this.TilePosArray[i + 7].kill();
						this.TileArray[i + 7] = null;
						this.TilePosArray[i + 7] = null;
						if(this.TileArray[i + 7] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_02');
							Tile.Id = i + 7;
							this.TileArray[i + 7] = Tile;
							this.TilePosArray[i + 7] = Tile;
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
						this.TilePosArray[i + 7].kill();
						this.TileArray[i + 7] = null;
						this.TilePosArray[i + 7] = null;
						if(this.TileArray[i + 7] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_03');
							Tile.Id = i + 7;
							this.TileArray[i + 7] = Tile;
							this.TilePosArray[i + 7] = Tile;
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
						this.TilePosArray[i + 7].kill();
						this.TileArray[i + 7] = null;
						this.TilePosArray[i + 7] = null;
						if(this.TileArray[i + 7] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_04');
							Tile.Id = i + 7;
							this.TileArray[i + 7] = Tile;
							this.TilePosArray[i + 7] = Tile;
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
						this.TilePosArray[i + 7].kill();
						this.TileArray[i + 7] = null;
						this.TilePosArray[i + 7] = null;
						if(this.TileArray[i + 7] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_05');
							Tile.Id = i + 7;
							this.TileArray[i + 7] = Tile;
							this.TilePosArray[i + 7] = Tile;
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
						this.TilePosArray[i + 7].kill();
						this.TileArray[i + 7] = null;
						this.TilePosArray[i + 7] = null;
						if(this.TileArray[i + 7] === null)
						{
							Tile = this.TileMakeFeature(Tile, KillTilePosx, KillTilePosy, 'block_01');
							Tile.Id = i + 7;
							this.TileArray[i + 7] = Tile;
							this.TilePosArray[i + 7] = Tile;
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
			this.SelectTileTween = game.add.tween(this.SelectTile).to({ y : this.SwapedTile.y }, TweenDuration, Phaser.Easing.Linear.None, true);
			this.SwapedTileTween = game.add.tween(this.SwapedTile).to({ y : this.SelectTileStartPos.y }, TweenDuration, Phaser.Easing.Linear.None, true);
			//this.SelectTileTween.onComplete.add(this.ReChangeTween, this);
			//this.SelectTileTween.onComplete.add(this.MatchTile, this);
			this.SwapedTileTween.onComplete.add(this.MatchTile, this);
			this.SelectTileTween.start();
			this.SwapedTileTween.start();
			this.bMatchStart = true;
			this.bMatchTileCheck = true;
			//this.bMatchStart = true;
		}
		else
		{
			this.SelectTileTween = game.add.tween(this.SelectTile).to({ x : this.SwapedTile.x}, TweenDuration, Phaser.Easing.Linear.None, true);
			this.SwapedTileTween = game.add.tween(this.SwapedTile).to({ x : this.SelectTileStartPos.x}, TweenDuration, Phaser.Easing.Linear.None, true);
			//this.SelectTileTween.onComplete.add(this.ReChangeTween, this);
			//this.SelectTileTween.onComplete.add(this.MatchTile, this);
			this.SwapedTileTween.onComplete.add(this.MatchTile, this);
			this.SelectTileTween.start();
			this.SwapedTileTween.start();
			this.bMatchStart = true;
			this.bMatchTileCheck = true;
			//this.bMatchStart = true;
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
			this.bMatch = false;
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
			this.bMatch = false;
		}
	},

	BeforeMatchTweenFinish : function(){
		this.bMatchStart = true;
		this.bMatchTileCheck = true;
	},

//Tile이 null이면 null인 인덱스 반환
	getTile : function(posX, posY){
		var getToTile;
		for(var i = 0; i < this.TileArray.length; ++i){
			if(this.TileArray[i] === null)
			{
				return null;
			}
			else if(this.TileArray[i].x === posX && this.TileArray[i].y === posY){
				getToTile = this.TileArray[i];
				return getToTile;
			}
		}
	},

	getNullTile : function(posX, posY){
		var getToNullTileIndx;
		for(var i = 0; i < this.TileArray.length; ++i){
			if(this.TileArray[i] === null){
				return i;
			}
		}
	},

	setTile : function(Tile, Posx, Posy, key, Id){
		Tile = this.TileMakeFeature(Tile, Posx, Posy, key);
		this.TileArray[Id].push(Tile);
	},

	onDown : function(sprite, pointer){
		console.log(sprite.Id);
	},

	onOver : function(Tile){
		console.log('OnOver : ' + Tile.Id);
	},

	ArrayEmpty : function(Array){
		for(var i = 0; i < Array.length; ++i){
			if(Array[i] !== null)
				return false;
		}
		return true;
	},

	update : function(){
		//console.log(this.DropTile());
	//	console.log(this.TileArray[0].x, this.TileArray[0].y);

			//this.bMatchStart = false;

		//console.log('getTile : ' + this.getTile(600, 1060));
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
