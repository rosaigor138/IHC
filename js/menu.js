var menuState = {
	create: function(){
		this.music = game.add.audio('music');
		this.music.loop = true;
		this.music.volume = .5;
		this.music.play();
		
		game.global.score = 0;
		
		if(!localStorage.getItem('labirinto_highScore')){
			localStorage.setItem('labirinto_highScore',0);
		}
		
		if(game.global.highScore > localStorage.getItem('labirinto_highScore')){
			localStorage.setItem('labirinto_highScore',game.global.highScore);
		} else {
			game.global.highScore = localStorage.getItem('labirinto_highScore');
		}
		
		var txtHighScore = game.add.text(game.world.centerX,350,'HIGH SCORE: ' + game.global.highScore,{font:'20px emulogic',fill:'#D26111'});
			txtHighScore.anchor.set(.5);
			txtHighScore.alpha = 0;
		
	
		var txtLabirinto = game.add.text(game.world.centerX,150,'LABIRINTO',{font:'40px emulogic',fill:'#fff'});
			txtLabirinto.anchor.set(.5);
			
		var txtPressStart = game.add.text(game.world.centerX,550,'PRESS START',{font:'20px emulogic',fill:'#fff'});
			txtPressStart.anchor.set(.5);
			
		game.add.tween(txtPressStart).to({y:250},1000).start();
		
		game.time.events.add(1000,function(){
			game.add.tween(txtHighScore).to({alpha:1},500).to({alpha:0},500).loop().start();
		
			var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
				enterKey.onDown.addOnce(this.startGame,this);
		},this);
	},
	
	startGame: function(){
		this.music.stop();
		game.state.start('stage1');
	}
};
