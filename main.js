$(document).ready(function(){
	//Initializing the Canvas
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	var cw = 10; //width of the cells
	var d; //direction
	var rotten; //rotten food --> size-- & score--
	var food; //normal food --> size++ & score++
	var ripe; //super good food --> score+5
	var reveal; //reveals only rotten and normal for a little
	var k;
	
	var rot_timer; //rotten pellet timer
	var norm_timer; //normal
	var ripe_timer; //ripe
	//visibility timers
	
	//initializing text variables
	var score;
	var t; //timer count text test
	
	//Initializing the Snake
	var snake_array; //array of cells to make up the snake
	
	function init(){
		d = "right"; //starting direction
		create_snake(); //add snake to canvas
		create_rotten(); //add rotten
		create_food(); //add normal
		create_ripe(); //add ripe
		create_reveal(); //add revealing pellet
		score = 0; //display the score
		t = 0; //has not moved yet
		rot_timer = 0;
		norm_timer = 0;
		ripe_timer = 0;
		k = "";
		
		//moving the snake using a timer
		if(typeof game_loop != "undefined") clearInterval(game_loop); 
		game_loop = setInterval(paint, 60); 
		//every 60 seconds
	}
	init();
	
	function create_snake(){
		var length = 5; //length of the snake starting
		snake_array = []; //empty arrary to start with
		for(var i = length-1; i>=0; i--){
			//creates a horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
	}
	
	//creating the normal food
	function create_food(){
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		//creates a cell with x/y between 0-44
		//because there are 45(450) positions across the rows and columns
	}
	
	//creating the rotten food
	function create_rotten(){
		rotten = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		//creates a cell with x/y between 0-44
		//because there are 45(450) positions across the rows and columns
	}
	
	//creating the ripe food
	function create_ripe(){
		ripe = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		//creates a cell with x/y between 0-44
		//because there are 45(450) positions across the rows and columns
	}
	
	//creating the ripe food
	function create_reveal(){
		reveal = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		//creates a cell with x/y between 0-44
		//because there are 45(450) positions across the rows and columns
	}
	
	//painting the snake
	function paint(){
		//to avoid the snake trail --> paint canvas on every frame
		//painting the canvas
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		//the movement code for the snake to come here
		//pop out the tail cell and player is in front of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//nx and ny are the position of head cell
		//now we increment it to get the new head position
		//and add the proper direction based on movement
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		//gameover clauses
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array)){
			//restarts game if the snake hits a wall
			//or runs into itself
			init();
			return;
		}
		
		//Code to make the snake eat the food
		//new head position = food position,
		//create a new head instead of moving the tail
		if(nx == food.x && ny == food.y){
			var tail = {x: nx, y: ny};
			score++;
			norm_timer=0;
			//create new food
			create_food();
		}else{
			var tail = snake_array.pop(); 
			//pops out the last cell to the tail
			tail.x = nx; tail.y = ny;
		}
		
		//Code to make the snake eat ROTTEN food
		//just pop
		if(nx == rotten.x && ny == rotten.y){
			score--;
			rot_timer=0;
			//create new food
			create_rotten();
			snake_array.pop(); 
			//pops out the last cell
		}
		
		//Code to make the snake eat RIPE food
		//no change in size
		if(nx == ripe.x && ny == ripe.y){
			score = score + 5;
			ripe_timer=0;
			//create new food
			create_ripe();
		}
		
		//Code to make the snake eat the reveal pellet
		if(nx == reveal.x && ny == reveal.y){
			create_reveal();
			paint_rotten(rotten.x,rotten.y);
			rot_timer=0;
			paint_cell(food.x,food.y);
			norm_timer=0;
		}
		
		snake_array.unshift(tail); 
		t++;
		rot_timer++;
		norm_timer++;
		ripe_timer++;
		//puts back the tail as the first cell
		
		for(var i = 0; i < snake_array.length; i++){
			var c = snake_array[i];
			paint_cell(c.x, c.y);
		}
		//painting normal food
		if(norm_timer > 50){
			paint_invisible(food.x, food.y);
		}else{
			paint_cell(food.x, food.y);
		}
		//painting rotten food
		if(rot_timer > 50){
			paint_invisible(rotten.x, rotten.y);
		}else{
			paint_rotten(rotten.x, rotten.y);
		}
		//painting ripe food
		if(ripe_timer > 30){
			paint_invisible(ripe.x, ripe.y);
		}else{
			paint_ripe(ripe.x, ripe.y);
		}
		//painting the reveal pellet
		paint_reveal(reveal.x,reveal.y);
		//painting the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
		//var steps_text = "Steps: " + t;
		//ctx.fillText(steps_text, 5, h-20);
		
		if(k == "instructions"){
			var intruc_textA = "Welcome to 'Memory Snake'!!!";
			ctx.fillText(intruc_textA, 100, 30);
			var intruc_textB = "by Joyce Scalettar";
			ctx.fillText(intruc_textB, 100, 60);
			var intruc_textC = "Instructions:";
			ctx.fillText(intruc_textC, 100, 120);
			var intruc_textD = "Food will turn invisible after a set amount of time.";
			ctx.fillText(intruc_textD, 100, 150);
			var intruc_textE = "Blue pellets (NORMAL FOOD): size+1 & score+1";
			ctx.fillText(intruc_textE, 100, 180);
			var intruc_textF = "Green pellets (ROTTEN FOOD): size-1 & score-1";
			ctx.fillText(intruc_textF, 100, 210);
			var intruc_textG = "Orange pellets (RIPE FOOD): size+0 & score+5";
			ctx.fillText(intruc_textG, 100, 240);
			var intruc_textH = "Purple pellets (REVEAL): reveals normal and rotten food";
			ctx.fillText(intruc_textH, 100, 270);
			var intruc_textJ = "Oh, and use the arrow keys to move!";
			ctx.fillText(intruc_textJ, 100, 300);
			var intruc_textI = "GOOD LUCK!!! <3";
			ctx.fillText(intruc_textI, 100, 330);
		}else{
			var intruc_textI = "press 'i' to view instructions.";
			ctx.fillText(intruc_textI, 5, 10);
		}
	}
	
	//generic function to paint cells (snake body and normal food)
	function paint_cell(x, y){
		//painting 10px wide cells (cw)
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	//paint rotten food cells
	function paint_rotten(x, y){
		//painting 10px wide cells (cw)
		ctx.fillStyle = "green";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	//paint ripe food cells
	function paint_ripe(x, y){
		//painting 10px wide cells (cw)
		ctx.fillStyle = "orange";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	//paint pellets white (invisible)
	function paint_invisible(x, y){
		//painting 10px wide cells (cw)
		ctx.fillStyle = "white";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	//paint reveal pellets
	function paint_reveal(x, y){
		//painting 10px wide cells (cw)
		ctx.fillStyle = "purple";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	//collision with the snake's body
	function check_collision(x, y, array){
		//do the provided (x,y) coordinates exist in an
		//array of cells or not
		for(var i = 0; i < array.length; i++){
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//keyboard controls
	$(document).keydown(function(e){
		var key = e.which;
		//second clause prevents reverse movement
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
		//these are the arrow keys
		if(key == "73") k = "instructions"; //press "i"
	})
})