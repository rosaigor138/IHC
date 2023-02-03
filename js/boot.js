var bootState = {
	preload: function(){
		game.load.image('progressBar','img/progressBar.png');
		game.load.image('giu', 'img/giu.jpeg')
		game.load.image('igor', 'img/igor.jpeg')
		game.load.image('pim', 'img/pim.jpeg')
		game.load.image('todos', 'img/todos.jpeg')
		game.load.image('aula', 'img/aula.png')
		game.load.image('dede', 'img/dede.jpeg')
		game.load.image('video', 'img/video.png')
		game.load.image('animacao', 'img/animacao.png')
	},
	
	create: function(){
		game.state.start('load');
	}
};
