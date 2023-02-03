var stage1State = {
	create: function(){
		this.onGame = true;
		//Música e sons
		this.music = game.add.audio('music');
		this.music.loop = true;
		this.music.volume = .5;
		this.music.play();
		
		this.sndCoin = game.add.audio('getitem');
		this.sndCoin.volume = .5;
		
		this.sndLoseCoin = game.add.audio('loseitem');
		this.sndLoseCoin.volume = .5;
		
		game.add.sprite(100,0,'bg');
		
		this.maze = [
			[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[0,0,1,3,0,0,0,0,0,0,0,0,0,0,0,3,1],
			[0,0,1,0,1,1,0,1,0,1,1,1,0,1,1,0,1],
			[0,0,1,0,1,3,0,1,3,0,0,1,0,3,1,0,1],
			[0,0,1,0,0,0,1,1,1,1,0,1,0,1,1,0,1],
			[0,0,1,0,0,0,0,1,0,2,0,0,0,0,0,0,1],
			[0,0,1,0,1,3,0,0,0,0,1,0,0,3,1,0,1],
			[0,0,1,0,1,1,1,1,0,1,1,0,1,1,1,0,1],
			[0,0,1,3,0,0,0,0,0,3,1,0,0,0,0,3,1],
			[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		];
		
		this.blocks = game.add.group();
		this.blocks.enableBody = true;
		
		this.coinPositions = [];
		
		for(var row in this.maze){
			for(var col in this.maze[row]){
				var tile = this.maze[row][col];
				
				var x = col * 50;
				var y = row * 50;
				
				if(tile === 1){
					var block = this.blocks.create(x,y,'block');
						block.body.immovable = true;
				} else
				if(tile === 2){
					this.player = game.add.sprite(x + 25,y + 25,'player');
					this.player.anchor.set(.5);
					game.physics.arcade.enable(this.player);
					this.player.animations.add('goDown',[0,1,2,3,4,5,6,7],12,true);
					this.player.animations.add('goUp',[8,9,10,11,12,13,14,15],12,true);
					this.player.animations.add('goLeft',[16,17,18,19,20,21,22,23],12,true);
					this.player.animations.add('goRight',[24,25,26,27,28,29,30,31],12,true);
				} else
				if(tile === 3){
					var position = {
						x: x + 25,
						y: y + 25
					};
					this.coinPositions.push(position);
				}
			}
		}
		
		//Inimigo
		this.enemy = game.add.sprite(175,175,'enemy');
		this.enemy.anchor.set(.5);
		game.physics.arcade.enable(this.enemy);
		this.enemy.animations.add('goDown',[0,1,2,3,4,5,6,7],12,true);
		this.enemy.animations.add('goUp',[8,9,10,11,12,13,14,15],12,true);
		this.enemy.animations.add('goLeft',[16,17,18,19,20,21,22,23],12,true);
		this.enemy.animations.add('goRight',[24,25,26,27,28,29,30,31],12,true);
		this.enemy.direction = 'DOWN';
		
		//Criar a moeda
		this.coin = {};
		this.coin.position = this.newPosition();
		this.coin = game.add.sprite(this.coin.position.x,this.coin.position.y,'coin');
		this.coin.anchor.set(.5);
		this.coin.animations.add('spin',[0,1,2,3,4,5,6,7,8,9],10,true).play();
		game.physics.arcade.enable(this.coin);
		
		//coletar moeda
		this.coins = 0;
		this.txtCoins = game.add.text(15,15,'COINS: ' + this.getText(this.coins),{font:'15px emulogic',fill:'#fff'});

		//exibir score
		this.txtScore = game.add.text(game.world.centerX,15,'SCORE: ' + this.getText(game.global.score),{font:'15px emulogic',fill:'#fff'});
		this.txtScore.anchor.set(.5,0);
		
		//controles
		this.controls = game.input.keyboard.createCursorKeys();
		
		//Partículas
		this.emitter = game.add.emitter(0,0,15);
		this.emitter.makeParticles('part');
		this.emitter.setXSpeed(-50,50);
		this.emitter.setYSpeed(-50,50);
		this.emitter.gravity.y = 0;
		
		//Timer
		this.time = 1000;
		this.txtTimer = game.add.text(game.world.width - 15,15,'TIME: ' + this.getText(this.time),{font:'15px emulogic',fill:'#fff'});
		this.txtTimer.anchor.set(1,0);
		this.timer = game.time.events.loop(1000,function(){
			this.time--;
			this.txtTimer.text = 'TIME: ' + this.getText(this.time);
		},this);
	},
	
	update: function(){
		if(this.onGame){
			game.physics.arcade.collide(this.player,this.blocks);
			game.physics.arcade.overlap(this.player,this.coin,this.getCoin,null,this);
			game.physics.arcade.overlap(this.player,this.enemy,this.loseCoin,null,this);
		
			this.moveEnemy();
			this.movePlayer();
			
			if(this.time < 1 || this.coins >= 10){
				this.gameOver();
			}
		}
	},
	
	gameOver: function(){
		this.onGame = false;
		
		game.time.events.remove(this.timer);
		
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		this.player.animations.stop();
		this.player.frame = 0;
		
		this.enemy.animations.stop();
		this.enemy.frame = 0;
		
		if(this.coins >= 11){//Passou de fase
			var txtLevelComplete = game.add.text(game.world.centerX,150,'LEVEL COMPLETE',{font:'20px emulogic',fill:'#fff'});
				txtLevelComplete.anchor.set(.5);
				
			var bonus = this.time * 5;
			game.global.score += bonus;
			this.txtScore.text = 'SCORE: ' + this.getText(game.global.score);
			
			if(game.global.score > game.global.highScore){
				game.global.highScore = game.global.score;
			}
			
			var txtBonus = game.add.text(game.world.centerX,200,'TIME BONUS: ' + this.getText(bonus),{font:'20px emulogic',fill:'#fff'});
				txtBonus.anchor.set(.5);
				
			var txtFinalScore = game.add.text(game.world.centerX,250,'FINAL SCORE: ' + this.getText(game.global.score),{font:'20px emulogic',fill:'#fff'});
				txtFinalScore.anchor.set(.5);
			
		} else {//Acabou o tempo
			var txtGameOver = game.add.text(game.world.centerX,150,'GAME OVER',{font:'20px emulogic',fill:'#fff'});
				txtGameOver.anchor.set(.5);
		}
		
		var txtBestScore = game.add.text(game.world.centerX,350,'BEST SCORE: ' + this.getText(game.global.highScore),{font:'20px emulogic',fill:'#fff'});
			txtBestScore.anchor.set(.5);
			
		game.time.events.add(5000,function(){
			this.music.stop();
			if(this.coins >= 10){
				game.state.start('stage2');
			} else {
				game.state.start('menu');
			}
		},this);
	},
	
	loseCoin: function(){
		this.sndLoseCoin.play();
		
		if(this.coins > 0){
			this.emitter.x = this.player.position.x;
			this.emitter.y = this.player.position.y;
			this.emitter.start(true,500,null,15);
			
			this.coins = 0;
			this.txtCoins.text = 'COINS: ' + this.getText(this.coins);
		}
		this.addAbsurdo()
	},
	
	moveEnemy: function(){
		if(Math.floor(this.enemy.x -25)%50 === 0 && Math.floor(this.enemy.y -25)%50 === 0){
			var enemyCol = Math.floor(this.enemy.x/50);
			var enemyRow = Math.floor(this.enemy.y/50);
			var validPath = [];
			
			if(this.maze[enemyRow][enemyCol-1] !== 1 && this.enemy.direction !== 'RIGHT'){
				validPath.push('LEFT');
			}
			if(this.maze[enemyRow][enemyCol+1] !== 1 && this.enemy.direction !== 'LEFT'){
				validPath.push('RIGHT');
			}
			if(this.maze[enemyRow-1][enemyCol] !== 1 && this.enemy.direction !== 'DOWN'){
				validPath.push('UP');
			}
			if(this.maze[enemyRow+1][enemyCol] !== 1 && this.enemy.direction !== 'UP'){
				validPath.push('DOWN');
			}
			
			this.enemy.direction = validPath[Math.floor(Math.random()*validPath.length)];
		}
		
		switch(this.enemy.direction){
			case 'LEFT':
				this.enemy.x -= 1;
				this.enemy.animations.play('goLeft');
				break;
			case 'RIGHT':
				this.enemy.x += 1;
				this.enemy.animations.play('goRight');
				break;
			case 'UP':
				this.enemy.y -= 1;
				this.enemy.animations.play('goUp');
				break;
			case 'DOWN':
				this.enemy.y += 1;
				this.enemy.animations.play('goDown');
				break;
			
		}
	},
	
	getCoin: function(){
		this.emitter.x = this.coin.position.x;
		this.emitter.y = this.coin.position.y;
		this.emitter.start(true,500,null,15);
		
		this.sndCoin.play();
		this.coins++;
		this.txtCoins.text = 'COINS: ' + this.getText(this.coins);
		
		game.global.score += 5;
		this.txtScore.text = 'SCORE: ' + this.getText(game.global.score);
		
		if(game.global.score > game.global.highScore){
			game.global.highScore = game.global.score;
		}
		
		this.coin.position = this.newPosition();
		if (this.coins == 1){
			this.addIgor()
		}
		else if (this.coins == 2){
			this.addGiu()
		}
		else if (this.coins == 3){
			this.addPim()
		}
		else if (this.coins == 4){
			this.linkPortifolio()
		}
		else if (this.coins == 5){
			this.addVideo()
		}
		else if (this.coins == 6){
			this.linkVideo()
		}
		else if (this.coins == 7){
			this.addAnimation()
		}
		else if (this.coins == 8){
			this.linkAnimation()
		}
		else if (this.coins == 9){
			this.addDedé()
		}
		else if (this.coins == 10){
			this.addAbsurdo()
		}
	},
	
	getText: function(value){
		if(value < 10){
			return '00' + value.toString();
		}
		if(value < 100){
			return '0' + value.toString();
		}
		return value.toString();
	},
	
	movePlayer: function(){
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
	
		if(this.controls.left.isDown && !this.controls.right.isDown){
			this.player.body.velocity.x = -100;
			this.player.direction = "left";
		} else
		if(this.controls.right.isDown && !this.controls.left.isDown){
			this.player.body.velocity.x = 100;
			this.player.direction = "right";
		}
		
		if(this.controls.up.isDown && !this.controls.down.isDown){
			this.player.body.velocity.y = -100;
			this.player.direction = "up";
		} else
		if(this.controls.down.isDown && !this.controls.up.isDown){
			this.player.body.velocity.y = 100;
			this.player.direction = "down";
		}
		
		switch(this.player.direction){
			case "left":
				this.player.animations.play('goLeft'); break;
			case "right":
				this.player.animations.play('goRight'); break;
			case "up":
				this.player.animations.play('goUp'); break;
			case "down":
				this.player.animations.play('goDown'); break;
		}
		
		if(this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0){
			this.player.animations.stop();
		}
	},

	newPosition: function(){
		var pos = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];
		
		while(this.coin.position === pos){
			pos = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];
		}
		
		return pos;
	},

	addIgor: function(){
		this.txtCreate = game.add.text(-200, 550, 'CRIADO POR:', {font:'15px emulogic', fill: '#fff'});
		this.nameIgor = game.add.text(-200, 600, 'IGOR ROSA', {font:'15px emulogic', fill: '#fff'});
		this.imgIgor = game.add.sprite(-200, 625, 'igor')

		game.add.tween(this.txtCreate).to({x:50},250).start();
		game.add.tween(this.nameIgor).to({x:50},750).start();
		game.add.tween(this.imgIgor).to({x:25},1250).start();
	},

	addGiu: function(){
		this.nameGiu = game.add.text(-200, 600, 'GIULIANO LEITE', {font:'15px emulogic', fill: '#fff'});
		this.imgGiu = game.add.sprite(-200, 625, 'giu')

		game.add.tween(this.nameGiu).to({x:250},750).start();
		game.add.tween(this.imgGiu).to({x:260},1250).start();
	},

	addPim: function(){
		this.namePim = game.add.text(-200, 600, 'FERNANDO PIMENTA', {font:'15px emulogic', fill: '#fff'});
		this.imgPim = game.add.sprite(-200, 625, 'pim')

		game.add.tween(this.namePim).to({x:500},750).start();
		game.add.tween(this.imgPim).to({x:525},1250).start();
	},

	addVideo: function(){
		this.txtVideo = game.add.text(-200, 515, 'VIDEO:', {font:'15px emulogic', fill: '#fff'});
		this.imgVideo = game.add.sprite(-200, 515, 'video')

		game.add.tween(this.txtVideo).to({x:50},750).start();
		game.add.tween(this.imgVideo).to({x:150},1250).start();
	},

	linkPortifolio: function(){
		window.open('./portifolio/Portifolio.html')

		game.add.tween(this.txtCreate).to({x:-400},250).start();
		game.add.tween(this.nameIgor).to({x:-400},250).start();
		game.add.tween(this.imgIgor).to({x:-400},250).start();
		game.add.tween(this.nameGiu).to({x:-400},750).start();
		game.add.tween(this.imgGiu).to({x:-400},750).start();
		game.add.tween(this.namePim).to({x:-400},1250).start();
		game.add.tween(this.imgPim).to({x:-400},1250).start();
	},

	linkVideo: function(){
		window.open('https://www.youtube.com/watch?v=xg_JC0fLOZo&t=20s')

		game.add.tween(this.txtVideo).to({x:-1000},250).start();
		game.add.tween(this.imgVideo).to({x:-1000},250).start();
	},

	addAnimation: function(){
		this.nameAnimacao = game.add.text(-200, 515, 'ANIMAÇÃO:', {font:'15px emulogic', fill: '#fff'});
		this.imgAnimacao = game.add.sprite(-200, 515, 'animacao')

		game.add.tween(this.nameAnimacao).to({x:50},750).start();
		game.add.tween(this.imgAnimacao).to({x:175},1250).start();
	},

	linkAnimation: function(){
		window.open('https://drive.google.com/file/d/1dSyVH5hGEDIgAb0pCrEE1HRZeT-RnjHW/view')

		game.add.tween(this.nameAnimacao).to({x:-500},750).start();
		game.add.tween(this.imgAnimacao).to({x:-1000},1250).start();
	},

	addDedé: function(){
		game.add.sprite(150, 500, 'dede')
	},

	addAbsurdo: function(){
		game.add.sprite(0, 0, 'aula')
	},

};
