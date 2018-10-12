/*Global Variable*/
var currentScreen = "";
var direction = 'right';
var playerScore = 0;
var alienArray = [];
var barrierArray = [];
var shipLocation = 0;
/*---------------*/


/*Game startup/endgame stuff*/
window.onload = function() {
  titlescreen();
  currentScreen = "title";
};
document.addEventListener("mousedown", getPosition, false);
document.addEventListener("keydown", dealWithKeyboard, false);


function getPosition(event)
{
  var x = event.x;
  var y = event.y;

  var canvas = document.getElementById("canvas");

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  if (y < 400 && y > 300 && x > 450 && x < 650 && currentScreen==="title"){
  	clearScreen();
  	currentScreen = "game";
  	playGame();
  }

}

function titlescreen(){
	//$("#canvas").fillText("Hello",10,50).css("color", "white");
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.font = "8em Impact";
	ctx.strokeStyle="#FF69B4";
	ctx.textAlign = "center"; 
	ctx.strokeText("Space Invaders II",550,120);

	ctx.beginPath();
    ctx.strokeStyle = '#39ff14';
    ctx.strokeRect(450,300,200,100);
    ctx.fill(); 
    ctx.font = "5em Impact";
    ctx.strokeText("PLAY",550,380);
}


function clearScreen(){
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
}


function gameOver(gameWon, playerScore){
	//$("#canvas").fillText("Hello",10,50).css("color", "white");
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.font = "8em Impact";
	if(gameWon){
		ctx.strokeStyle="#39ff14";
		ctx.strokeText("You Won",550,300);
	}
	else{
		ctx.strokeStyle="red";
		ctx.strokeText("You Lost",550,300);
	}
	ctx.textAlign = "center"; 
	ctx.strokeText("Game Over",550,120);
	ctx.strokeStyle="white";
	ctx.strokeText(`Your Score: ${playerScore}`,550,450);
}
/*---------------------------------------*/


/*Gameplay*/

function playGame(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	drawCanvas(ctx);	//Draws background
	drawAliens(ctx);
	drawBarriers(ctx); //4 barriers
	drawShip(ctx);
	//keyboard listener for ship movement and firing

	/*in game variables*/
	var over = false;
	var won = false;
	var aliensLeft = 40; //just starting with 4 rows of 10 for now
	/*----------------*/
	alienArray = Array.apply(null, Array(aliensLeft)).map(Number.prototype.valueOf,1); //array to keep track of all aliens (0=dead, 1=alive)
	barrierArray = Array.apply(null, Array(16)).map(Number.prototype.valueOf,1); //array to keep track of barriers (0=destroyed, 1=intact)
	//shipLocation = ___    starting ship location

	while (!over){

		redrawAliens(aliensLeft, direction); //redraw the aliens moving right (delay 1 second?). If aliens reach side, flip direction and lower one level
		alienShoot(aliensLeft);

		//most gameplay stuff goes in here






		if (aliensLeft === 0){
			over = true;
			won = true;	
		}
		if (numLives === 0){
			over = true;
		}
	}

	clearScreen();
	gameOver(won, playerScore);
	
}

function rngShoot(aliensLeft){
	var x = Math.floor((Math.random() * aliensLeft) + 1);
	return x;
}

function drawCanvas(ctx) {
	//Draws background.
	var canvas = document.getElementById("canvas");
	var width = canvas.width;
	var height = canvas.height;
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0, width, height);
}

function drawAliens(ctx){
	//initially draw all 40 (can change the number later)
	
}

function drawBarriers(ctx){
	//initially draw all 4 (each made of 4 small barriers) completely
	//Barriers are boxes.
}


function drawShip(ctx, x){
	//draw the ship given an x coordinate
}


function redrawAliens(ctx, direction){
	//redraw the remaining aliens (use alienArray) having moved over one spot in the given direction
	//if they reach one edge of the screen, flip the direction and lower them all one level
}

function redrawBarriers(ctx){
	//redraw the barriers based on which ones are left in barrierArray
}

function alienShoot(ctx, aliensLeft){
	//call the rng function to select a ship
	//draw a missile moving from that ship towards the bottom
	//if the missile hits a barrier, redraw the barrier with the piece missing
	//if the missile hits the ship, redraw the ship in the center and take away a life
}

function playerShoot(ctx){
	//draw missile moving from player ship towards the top
	//if the missile hits an alien, that alien is destroyed and the playerScore and alienArray should be updated

}


function dealWithKeyboard(event){
	if (event.keyCode == 37){
		//left
		//redraw ship and update loacation variables
	}
	else if (event.keyCode == 39){
		//redraw ship and update loacation variables
		//right
	}
	else if (event.keyCode == 32)
		//space
		//shoot and register hit/miss based on alien locations and update score, alienArray and aliensLeft
}
/*-------------------------------*/


//need to change array to hold alien x and y position instead of 0/1, negative 1 vals can signify the alien is dead
