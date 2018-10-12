/*Global Variable*/
var currentScreen = "";
var direction = 'right';
var playerScore = 0;
var alienArray = [];
var barrierArray = [];
var projectileArray = [];
var shipLocation = 0;
var playerLives = 3;
var aliensLeft = 40;
var upd = 0;
var ast = 0;
var win = false;


const alien = {
  row: 0,
  column: 0,
  alienX: 50,
  alienY: 50,
  radius: 20,
  color: "green",
  type: 1,
};

const projectile = {
  x: 0,
  y: 0,
  projX: 10,
  projY: 10,
  player: true,
  color: "yellow",
}
const barrier = {
  x: 0,
  y: 400,
  width: 45,
  height: 25,
  color:"red"
};
/*
  Array Properties
  length        - returns length of the array
  Array Methods
  concat()      - Joins 2 or more arrayd and returns a copy of the joined arrays
  copyWithin()  - copies array elements within the array to and from specified positions
  entries()     - returns a key/value pair Array Iteration Object
  every()       - Checks if every element in an array passes a test
  fill()        - Fill the elements in an array with a static value
  filter()      - Creates a new array with every element in an array that pass a test
  find()        - Returns value of the first elmeent in an array to that passes a test
  findIndex()   - Returns index of the firs element in an array that passes a test
  forEach()     - Calls a function for eacharray elements
  from()        - Creates an array from an Object
  pop()         - Removes the last element of an array, and returns the element.
  push()        - Adds new elements to the end of an array and returns the new length.
  shift()       - Removes the first element of an array and returns that element.
  unshift()     - Adds new elements to the beginning of an array and returns the new length.
*/
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
  var canvas = document.getElementById("canvas");
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
}
function callbackClear(callback){
  var canvas = document.getElementById("canvas");
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  callback();
}


function gameOver(){
	//$("#canvas").fillText("Hello",10,50).css("color", "white");
  var gameWon = win;
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
  var bx = 100;
  for (b=0; b < 12; b++){
    var bar = Object.create(barrier);
    bar.x = bx;
    barrierArray.push(bar);
    if (b === 2 || b === 5 || b === 8 || b === 11){
      bx = bx + 150;
    }
    else{
      bx = bx + 50;
    }
  }
  shipLocation = 550;
  //var numLives = 3;
	drawCanvas(ctx);	//Draws background
	drawAliens(ctx);
	drawBarriers(ctx); //4 barriers
	drawShip(ctx, shipLocation);
	//keyboard listener for ship movement and firing

	/*in game variables*/
	var over = false;
	var won = false;
	 //just starting with 4 rows of 10 for now
	/*----------------*/
	//alienArray = Array.apply(null, Array(aliensLeft)).map(Number.prototype.valueOf,1); //array to keep track of all aliens (0=dead, 1=alive)

	//barrierArray = Array.apply(null, Array(12)).map(Number.prototype.valueOf,1); //array to keep track of barriers (0=destroyed, 1=intact)

	//shipLocation = ___    starting ship location

	//while (!over){
    //update(ctx);
  upd = setInterval(update, 300, ctx);
    //alienShoot(aliensLeft);
		//most gameplay stuff goes in here

  ast = setInterval(alienShoot, 1000, ctx, aliensLeft);

  //setInterval(checkCollide, 300, ctx);

	if (aliensLeft === 0){
		over = true;
		won = true;
    console.log('win');
	}
	if (playerLives == 0){
		over = true;
    console.log('lose');
	}


	//clearScreen();
	//gameOver(won, playerScore);


}

function update(ctx, direction){
  //redraw aliens, barriers, projectiles, score, and lives
  //clear screen?
  //check collisions
  //update alien positions
  //update projectile positions
  
  clearScreen();
  direction = redrawAliens(ctx, direction); //redraw the aliens moving right (delay 1 second?). If aliens reach side, flip direction and lower one level
  redrawBarriers(ctx);
  redrawProjectile(ctx);
  drawShip(ctx, shipLocation);
  drawLives(ctx);
  drawScore(ctx);
  checkCollide(ctx);
  if (playerLives == 0){
    win = false;
    clearInterval(upd);
    clearInterval(ast)
    console.log('lose');
    callbackClear(gameOver);
    //gameOver(won, playerScore);
  }
  if (aliensLeft == 0){
    win = true;
    clearInterval(upd);
    clearInterval(ast)
    console.log('win');
    callbackClear(gameOver);
    //gameOver(won, playerScore);
  }
  return direction;
}

function checkCollide(ctx){
  //for every projectile
    //if any part of that projectile overlaps with an alien
      //delete that alien and increase Score
    //if any part of that projectile overlaps with an barriers
      //delete that barrier
    //if any part of that projectile overlaps with the shipLocation
      //decrement life
      //change shipLocation to center

      //return type of alien?
      console.log('a');
      collide = [];
      for (i=0; i < projectileArray.length; i++){
        var type = -1;
        //console.log(projectileArray[i].x);
        var left = projectileArray[i].x;
        var right = projectileArray[i].x + projectileArray[i].projX;
        var up = projectileArray[i].y;
        var down = projectileArray[i].y + projectileArray[i].projY;
        if (projectileArray[i].player){ //only the player can destroy aliens
          for (x=0; x < alienArray.length; x++){
            if (alienArray[x]){
              if (left < alienArray[x].column + alienArray[x].alienX && right > alienArray[x].column && up < alienArray[x].row + alienArray[x].alienY && down > alienArray[x].row){
                //remove aliens
                type = alienArray[x].type;
                alienArray[x] = null;
                aliensLeft = aliensLeft - 1;
                collide.push(i);
                break;
                
                //incrementscore///////////
              }
            }
          }
        }
        else{ //only aliens can collide with barrier and ship
          for (y=0; y < barrierArray.length; y++){

            if (barrierArray[y]){
              if (left < barrierArray[y].x + barrierArray[y].width && right > barrierArray[y].x && up < barrierArray[y].y + barrierArray[y].height && down > barrierArray[y].y){
                //remove barrier
                //console.log('bar');
                barrierArray[y] = null;
                collide.push(i);
                break;
              }
            }
          }
          if (left < shipLocation + 25 && right > shipLocation - 25 && up < 550 && down > 500){
            //reset ship in center
            console.log('hit');
            shipLocation = 550;
            //decrement lives
            playerLives = playerLives - 1;
            
            collide.push(i);
          }
        }
    }
    for(p=0; p < collide.length; p++){
      projectileArray.splice(collide[p], 1);
    }
    return type;

}
function drawLives(ctx){
  ctx.strokeStyle="white";
  ctx.font = "1em Impact";
  ctx.strokeText(`Lives: ${playerLives}`,50,540);
}
function drawScore(ctx){
  ctx.strokeStyle="white";
  ctx.font = "1em Impact";
  ctx.strokeText(`Score: ${playerScore}`,1050,540);
}
function rngShoot(){
  while (true){
	 var x = Math.floor((Math.random() * parseInt(aliensLeft)) + 1);
   if (alienArray[x]){
    break;
   }
  }
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
  initial_height = 50;
  initial_width = 50;
  
  for (i=0; i < 4; i++){
    height = initial_height + (i * 50);
    for (y=0; y < 10; y++){
      var nAlien = Object.create(alien);
      width = initial_width + (y * 80);
      nAlien.alienY = height;
      nAlien.alienX  = width;
      nAlien.row = i;
      nAlien.column = y;
      nAlien.type = i + 1;
      if (i == 0 && y == 4) nAlien.type = 0; //captain
      switch(nAlien.type) {
        case 0:
          nAlien.color = "blue";
          break;
        case 1:
          nAlien.color = "red";
          break;
        case 2:
          nAlien.color = "orange";
          break;
        case 3:
          nAlien.color = "purple";
          break;
        //case 4:
        default:
          nAlien.color = "green";
          break;
      }
      ctx.fillStyle = nAlien.color;
      //ctx.fillCircle(width,height, 25, 25);
      ctx.beginPath();
      ctx.arc(width, height, nAlien.radius, 0, 2 * Math.PI, false);
      ctx.fill();
      alienArray.push(nAlien);
    }
  }

}

function drawBarriers(ctx){

  ctx.fillStyle="red";
  for (i=0; i < barrierArray.length; i++){
    ctx.fillRect(barrierArray[i].x, barrierArray[i].y, barrierArray[i].width, barrierArray[i].height);
  }
}


function drawShip(ctx, x){
	//draw the ship given an x coordinate
ctx.fillStyle="white";
var path=new Path2D();
ctx.clearRect(shipLocation-35, 500, 70, 25);
//ctx.clearRect(0, 450, 1100, 100);
path.moveTo(x-25,525);
path.lineTo(x+25,525);
path.lineTo(x,500);
ctx.fill(path);
}




function redrawAliens(ctx, direction){
  var canvas = document.getElementById("canvas");
	//redraw the remaining aliens (use alienArray) having moved over one spot in the given direction
	//if they reach one edge of the screen, flip the direction and lower them all one level
  var sw = false ;                            //Checks if the direction has changed
  if (direction == "left") {                  //Iterates through each row first then increments the column checks if the value exists then verifies direction
    var x = 0;
    do {
      x = x % 10;
      for(y = 0; y < 4; y++){
        if(alienArray[x + (y * 10)]) {                                          //If exists
          if(nAlien.alienX - 10 < 0) {
            sw = true;
            direction == "right";
          }
        }
      }
      x = x + 1;
    } while(sw == false || x + 30 == 40);
  } else if (direction == "right") {
    var x = 9;
    do {
      if (x < 0) { x = 9; }                                                     //Reset
      for(y = 0; y < 4; y++){
        if(alienArray[x + (y * 10)]) {                                          //If exists
          if(nAlien.alienX + 10 >= canvas.width) {
            sw = true;
            direction == "left";
          }
        }
      }
      x = x - 1;
    } while(sw == false || (x + 40) == 40);
  }
  for(i = 0; i < 40; i++) {                                                     //Iterates through each existing "Alien"
    if (alienArray[i]) {                                                //If the Alien exists in the array
      var nAlien = alienArray[i];                                               //Set nAlien to the currest Alien accessed
      if (direction == "left") {                                                //If Aliens are moving left
        nAlien.alienX = nAlien.alienX - 10;
        if (sw) {
          nAlien.alienY = nAlien.alienY + 40;
        }
      } else {
          nAlien.alienX = nAlien.alienX + 10;
        if (sw) {
          nAlien.alienY = nAlien.alienY + 40;
        }
      }
      //alienArray[i] = nAlien;
      if (nAlien.alienY >= 400) {
        direction = "gameover";
      }
      ctx.beginPath();
      ctx.fillStyle=nAlien.color;
      ctx.arc(nAlien.alienX, nAlien.alienY, nAlien.radius, 0, 2 * Math.PI, false);
    }
  }
  ctx.fill();
  return direction;
}

function redrawBarriers(ctx){
	//redraw the barriers based on which ones are left in barrierArray
  ctx.fillStyle = "red";
  for (i=0; i < barrierArray.length; i++){
    if (barrierArray[i]){
      ctx.fillRect(barrierArray[i].x, barrierArray[i].y, barrierArray[i].width, barrierArray[i].height);
    }
  }
}
function redrawProjectile(ctx){
  
  for (var i = 0; i < projectileArray.length; i++){

    if (projectileArray[i]){
      ctx.fillStyle = projectileArray[i].color;
      if (projectileArray[i].player){
        if (projectileArray[i].y < 25){ //removes projectile at top of screen
          projectileArray.splice(i, 1);
        }
        else{
          projectileArray[i].y = projectileArray[i].y - 25;
          ctx.fillRect(projectileArray[i].x, projectileArray[i].y, projectileArray[i].projX, projectileArray[i].projY);
        }
      }
      else{
        if (projectileArray[i].y > 525){ //removes projectile at bottom of screen
          projectileArray.splice(i, 1);
        }
        else{
          projectileArray[i].y = projectileArray[i].y + 25;
          ctx.fillRect(projectileArray[i].x, projectileArray[i].y, projectileArray[i].projX, projectileArray[i].projY);
        }
      }
    }
  }
}
function alienShoot(ctx, aliensLeft){
  //call the rng function to select a ship
  shooter = alienArray[rngShoot()];
  //draw a missile moving from that ship towards the bottom
  shot = Object.create(projectile);
  shot.x = shooter.alienX;
  shot.y = shooter.alienY;
  shot.player = false;
  //console.log(shot);
  projectileArray.push(shot);
}

function playerShoot(ctx){
	//draw missile moving from player ship towards the top
	//if the missile hits an alien, that alien is destroyed and the playerScore and alienArray should be updated
  p = Object.create(projectile);
  p.x = shipLocation;
  p.y = 500;
  p.player = true;
  p.color = "pink";
  
  projectileArray.push(p);
}


function dealWithKeyboard(event){
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
	if (event.keyCode == 37){
		//left
    if (shipLocation > 100){
   	shipLocation = shipLocation - 10;
	drawShip(ctx, shipLocation);
    }

		//redraw ship and update loacation variables
	}
	else if (event.keyCode == 39){
		//redraw ship and update loacation variables
		//right
    if (shipLocation < 1000){
    shipLocation = shipLocation + 10;
    drawShip(ctx, shipLocation);
    }
	}
	else if (event.keyCode == 32){
    playerShoot(ctx);
  }
		//space
		//shoot and register hit/miss based on alien locations and update score, alienArray and aliensLeft
}
/*-------------------------------*/

function incrementScore(score) {
  //Increments playerScore
  //Adjusts High Score if necessary
  playerScore = playerScore + score;

}

//need to change array to hold alien x and y position instead of 0/1, negative 1 vals can signify the alien is dead
