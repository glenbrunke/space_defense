// //////////////////////////////////////////////////////////
// "Space Defense" is a simple shooter type
// game. Enemy ships fly across the visual 
// field and your mission is to blast down as 
// many as possible. If you let a ship escape, it
// causes your health to take a hit. You also have a
// limited amount of ammo. Both can be replenished
// by shooting down supply ships. 
// Created by Glen Brunke, October 10, 2023
/////////////////////////////////////////////////////////////



// Main variables used to control game elements
// Game control is handled by keyboard or with 
// button elements (mobile friendly).

const canvas = document.getElementById("myCanvas");
const fireButton = document.getElementById('fireButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

let gameSpeed = 10;
let enemySpeed = 1;

const ctx = canvas.getContext("2d");

const backgroundImage = new Image();
backgroundImage.src = "background.png";

// class powerUp
// A ship that replenishes ammo and health when shot down.
class powerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "green";
        this.width = 80;
        this.height = 43;
        this.speed = 1;
        this.ammo = 50;
        this.status = "notHit";
        this.image = new Image();
        this.image.src = "power_up.png";
        // hit images are used when the ship is hit by a laser beam to animate the explosion
        this.hitImage1 = new Image();
        this.hitImage1.src = "power_up1.png";
        this.hitImage2 = new Image();
        this.hitImage2.src = "power_up2.png";
        this.hitImageNumber = 0;
        this.damageFrames = 15;
        this.health = 25;
        this.points = 100;
    }
    
    draw(ctx) {
        if (this.status == "notHit") {
            ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
        }
        // if a laserBeam has intersected with the ship, it is "hit" and will start explosion sequence controled by damageFrames
        else if (this.status == "hit") {
            if (this.damageFrames > 0) {
                this.damageFrames -= 1;
                if (this.hitImageNumber == 0 || this.hitImageNumber == 2) {
                    // changing the object size to help animate explosion
                    this.width = 50;
                    this.height = 30;
                    ctx.drawImage(this.hitImage1,this.x, this.y, this.width, this.height);
                    this.hitImageNumber = 1;
                }
                else  {
                    // changing the object size to help animate explosion
                    this.width = 90;
                    this.height = 60;
                    ctx.drawImage(this.hitImage2,this.x, this.y, this.width, this.height);
                    this.hitImageNumber = 2;                    
                }
                //set ammo, points, and health to zero incase use intersects with damaged ship, prevents double counting
                this.ammo = 0;
                this.points = 0;
                this.health = 0;
            }
            // once the damageFrames are completed, the ship is considered destroyed and will be cleaned up through program control
            else {
                this.status = "destroyed";
                this.width = 50;
                this.height = 30;
                ctx.drawImage(this.hitImage1,this.x, this.y, this.width, this.height);
                //set ammo, points, and health to zero incase use intersects with damaged ship, prevents double counting
                this.ammo = 0;
                this.points = 0;
                this.health = 0;
            }
        }
    }

    moveMe() {
        // movement is only left to right
        this.x += this.speed;
    }
}

// class laserBeam
// A simple rectangle object fired from the gun to shoot down enemies and power ups
// Graphics are only filled rectangles

class laserBeam {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "white";
        this.width = 2;
        this.height = 8;
        this.speed = 10;
    }
        // movement is only from bottom to top   
    moveMe() {
        this.y -= this.speed;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// class enemyShip
// A simple rectangle object fired from the gun to shoot down enemies and power ups
// Graphics are only filled rectangles
class enemyShip {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 15;
        this.speed = enemySpeed;
        this.status = "functional";
        this.damage = 10;
        this.health = 1;
        this.image = new Image();
        this.image.src = "ship1.png";
        this.damageImage1 = new Image();
        this.damageImage1.src = "ship2.png";
        this.damageImage2 = new Image();
        this.damageImage2.src = "ship3.png";
        this.damageImage3 = new Image();
        this.damageImage3.src = "ship4.png";
        this.shipImage = 0;
        this.damageFrames = 15;
        this.points = 50;
    }
    
    draw(ctx) {
        if (this.status == "functional") {
            ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
        }
        // if a laserBeam has intersected with the ship, it is "damaged" and will start explosion sequence controled by damageFrames
        else if (this.status == "damaged") {
            if (this.damageFrames > 0) {
                this.damageFrames -= 1;
                //ship can no longer provide points or reduce players health (damage) once it's damaged
                this.damage = 0;
                this.points = 0;
                // switch  images back and change size to animate explosion sequence
                if (this.shipImage == 0 || this.shipImage == 2) {
                    this.width = 50;
                    this.height = 30;
                    ctx.drawImage(this.damageImage1,this.x, this.y, this.width, this.height);
                    this.shipImage = 1; //used to control image switching
                }
                else  {
                    this.width = 70;
                    this.height = 40;
                    ctx.drawImage(this.damageImage2,this.x, this.y, this.width, this.height);
                    this.shipImage = 2; //used to control image switching           
                }
                
            }
            else {
                this.width = 60;
                this.height = 40;
                this.status = "destroyed"; // setting the status to destroyed lets the main program logic know this ship can be removed from the stack
                ctx.drawImage(this.damageImage3,this.x, this.y, this.width, this.height);
                this.shipImage = 2;   
                //ship can no longer provide points or reduce players health (damage) once it's damaged
                this.damage = 0;
                this.points = 0;
            }
        }
    }
    //movement is left to right only, controled by speed
    moveMe() {
        this.x += this.speed;
    }
}

// class laserGun
// The hero of the game, used to fire at enemy ships, and also keep track of player stats
class laserGun {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 73;
        this.image = new Image();
        this.image.src = 'laser.png';
        this.speed = 3;
        this.direction = "S";
        this.shotsRemaining = 100;
        this.power = 1;
        this.score = 0;
        this.enemyLevel = 1;
        this.health = 100;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
// movement is left "L" or right "R" depending on direction. If the direction is hit twice, then the movement stops "S" 
    moveMe() {
        if(this.direction == "L") {
            if (this.x > 0) {
                this.x -= this.speed;
            }
            else {
                this.x = 0;
            }
        }
        else if(this.direction == "R") {
            if (this.x < canvas.width-this.width) {
                this.x += this.speed;
            }
            else {
                this.x = canvas.width-this.width;
            }
        }
    }
}


// arrays to hold the game objects, arrays are added to and deleted from by program logic
const laserBeamArray = [];
const enemyArray = [];
const powerUpArray = [];

// create a laser gun object that is in the middle of the screen
const myGun  = new laserGun((canvas.width/2)-17, canvas.height-73);   

// programFlow() - main program control, checks for game over and increases difficultly as player progresses
function programFlow() {
    
    if (myGun.score < 2000) { // level one, lowest speed level
        gameSpeed = 10;
        enemySpeed = 1;
    }
    else if (myGun.score >= 2000 && myGun.score <= 5000) { // level two, double speed of level 1
        gameSpeed = 10;
        enemySpeed = 2;
    }
    else if (myGun.score >= 5000 && myGun.score <= 10000){// level three, 3x speed of level 1
        gameSpeed = 10;
        enemySpeed = 3;
    }
    else if (myGun.score > 10000){// max level, 4x speed of level 1
        gameSpeed = 10;
        enemySpeed = 4;
    }
    
    if (myGun.health == 0) {
        printGameOver(); // player is out of health, so game is over
    }
    
    else if (myGun.shotsRemaining == 0) {
        printGameOver(); // player is out of ammo, so game is over
    }
    else {
        mainLogic(); // if the game is still playable, proceed to main program logic to display game objects.
    }
}

// printGameOver() - Simple game over screen with relevant information remaining, but no game play objects
function printGameOver(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);  //clear canvas of all objects
    ctx.drawImage(backgroundImage, 0, 0, 350, 450); //add background
    
    // print game over in middle of screen   
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 25px sans-serif";
    ctx.fillText("GAME OVER",canvas.width-250, canvas.height-250);

    // print score dashboard    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("Score: " + myGun.score, canvas.width-345, 20);
    
     // print ammo dashboard   
    ctx.fillStyle = getFillColor(myGun.shotsRemaining);
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("Ammo: " + myGun.shotsRemaining, canvas.width-100, 20);
    
    // print health dashboard
    ctx.fillStyle = getFillColor(myGun.health);
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("Health: " + myGun.health, canvas.width-200, 20);
}

// mainLogic() - controls the objects within the game, checks for hits and controls objects in memory stack
function mainLogic() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas  
    ctx.drawImage(backgroundImage, 0, 0, 350, 450); 
    
    myGun.moveMe(); // process any user input for gun movement
    
    if (enemyReady(myGun.enemyLevel,enemyArray.length)) { //Randomly introduce an enemy into the screen
        let shipAltitude = Math.floor(Math.random() * 100);
        enemyArray.push(new enemyShip(0, shipAltitude+40));        
    }
    
    if (powerUpReady(powerUpArray.length)) {//Randomly introduce a power up into the screen
        let shipAltitude = Math.floor(Math.random() * 100);
        powerUpArray.push(new powerUp(0, shipAltitude+40));        
    }
    
    // check to see if any power ups have run off of the screen or were destroyed, if so, remove them from the array    
    let powerUpIndex = 0;
    powerUpArray.forEach(powerUp => { //check to see if power ups have been hit
        if (powerUp.x > canvas.width+powerUp.width || powerUp.status == "destroyed") {
            powerUpArray.splice(powerUpIndex,1); //remove destroyed power ups from game
            powerUpIndex -=1; //removed a powerup from array, so correcting for one less in index
        }
        
        powerUp.moveMe(); //move the power across screen
        powerUp.draw(ctx);
        powerUpIndex += 1;
    });
    
    // check to see if any enemy ships have run off of the screen or were destroyed, if so, remove them from the array
    let enemyShipIndex = 0;
    enemyArray.forEach(enemyShip => {
        if (enemyShip.x > canvas.width+enemyShip.width || enemyShip.status == "destroyed") {
            myGun.health -= enemyShip.damage;
            if (myGun.health < 0) { myGun.health = 0; }
            enemyArray.splice(enemyShipIndex,1);
            enemyShipIndex -=1; //removed an enemy from array, so correcting for one less in index
        }
        enemyShip.moveMe();
        enemyShip.draw(ctx);
        enemyShipIndex += 1;
    });
    

    let laserBeamIndex = 0;
    laserBeamArray.forEach(laserBeam => {
        //laserBeam.y -= laserBeam.speed;
        laserBeam.moveMe();
        laserBeam.draw(ctx);
        
        if (laserBeam.y < 0) {
            laserBeamArray.splice(laserBeamIndex, 1);
            laserBeamIndex -= 1; //removed laserBeam from array, so correcting for one less in index
        }
        
        // loop through enemies to see if the current laserBeam has hit a ship, if so, set ship status and remove laserBeam
        enemyArray.forEach(enemyShip => {
           if (laserIntersect(laserBeam, enemyShip)) {
                myGun.score += enemyShip.points; //add points to user score
                enemyShip.status = "damaged";
                laserBeamArray.splice(laserBeamIndex, 1);
                laserBeamIndex -= 1; //correct laserBeam index for destroyed laserBeam
           }
        });
        
         // loop through power ups to see if the current laserBeam has hit a ship, if so, set ship status and remove laserBeam       
        powerUpArray.forEach(powerUp => {
           if (laserIntersect(laserBeam, powerUp)) {
                myGun.score += powerUp.points; //add points to user score
                powerUp.status = "hit";
                laserBeamArray.splice(laserBeamIndex, 1);
                laserBeamIndex -= 1;//correct laserBeam index for destroyed laserBeam
                myGun.health += powerUp.health; //add health from ship impact
                if (myGun.health > 100){
                    myGun.health = 100; //ensure health never exceeds 100
                }
                myGun.shotsRemaining += powerUp.ammo; //add ammo to user supply
           }
        });
        
        
        laserBeamIndex += 1;
    });  
    
    ctx.drawImage(myGun.image, myGun.x, myGun.y, myGun.width, myGun.height); // draw the user's gun
    
    // draw updated dashboard with score, ammo, and health
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("Score: " + myGun.score, canvas.width-345, 20);
    
    ctx.fillStyle = getFillColor(myGun.shotsRemaining);
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("Ammo: " + myGun.shotsRemaining, canvas.width-100, 20);
    
    ctx.fillStyle = getFillColor(myGun.health);
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("Health: " + myGun.health, canvas.width-200, 20);
    

}

//getFillColor() - return the color of the dashboard text depending on remaining shots
function getFillColor(shotsRemaining) {
    if (shotsRemaining >= 25) {
        return "#9999FF";
    }
    else if (shotsRemaining < 25 && shotsRemaining >=10) {
        return "#FFFF99";        
    }
    else {
        return "#FF9999";
    }
}

// enemyReady() - randomly returns "true" if game is ready for a new enemy ship and random condition is met, returns "false" otherwise
// game is limited to 3 enemies on the screen at once
function enemyReady(enemyLevel, numberOfEnemies) {
    let returnValue = false; 
    const randomEnemy = Math.floor(Math.random() * (100/enemyLevel)); //1% chance of introducing an enemy
    
    if (numberOfEnemies < 3) {
        if (randomEnemy == 5) {
           returnValue = true;  
        }
    }
    return returnValue;
}

// powerUpReady() - randomly returns "true" if game is ready for a new power up and random condition is met, returns "false" otherwise
function powerUpReady(numberOfPowerUps) {
    let returnValue = false; 
    const randomEnemy = Math.floor(Math.random() * 1500);
    
    if (numberOfPowerUps < 1) {
        if (randomEnemy == 5) {
           returnValue = true;  
        }
    }
    return returnValue;
}


////////////////////////////////////////////////////////////////////////
// MOBILE OR WEBPAGE CONTROL SECTION
// program listens for button clicks to fire, or move laser gun left and 
// right. 
////////////////////////////////////////////////////////////////////////
leftButton.addEventListener('click', function(event) {
    if (myGun.direction == "L") {
        myGun.direction = "S";
    }
    else {
        myGun.direction = "L";
    }
  
});
/////////////////////////////////////////////////////////////////////////
// program updates direction based on user input. If the same direction
// is pressed 2x in a row, then the gun stops
/////////////////////////////////////////////////////////////////////////

rightButton.addEventListener('click', function(event) {
    if (myGun.direction == "R") {
        myGun.direction = "S";
    }
    else {
        myGun.direction = "R";
    }
});

fireButton.addEventListener('click', function(event) {
    if (myGun.shotsRemaining > 0) {
        laserBeamArray.push(new laserBeam(myGun.x+16, myGun.y+2));
        myGun.shotsRemaining -= 1;
    }
});


////////////////////////////////////////////////////////////////////////
// COMPUTER KEYBOARD CONTROL SECTION
// program listens for space bar which is the "fire" command
/////////////////////////////////////////////////////////////////////////

document.addEventListener('keydown', function(event) {
  if (event.key === ' ') {
    if (myGun.shotsRemaining > 0) {
        laserBeamArray.push(new laserBeam(myGun.x+16, myGun.y+2));
        myGun.shotsRemaining -= 1;
    }
  }
});

////////////////////////////////////////////////////////////////////////
// program listens for keyboard input (arrow left and arrow right)
// to control the direction of the laser gun movement
// program updates direction based on user input. If the same direction
// is pressed 2x in a row, then the gun stops
/////////////////////////////////////////////////////////////////////////
document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowRight') {
    if (myGun.direction == "R") {
        myGun.direction = "S";
    }
    else {
        myGun.direction = "R";
    }
  }
});


document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft') {
    if (myGun.direction == "L") {
        myGun.direction = "S";
    }
    else {
        myGun.direction = "L";
    }
  }
});

// laserIntersect(laserBeam, target) - checks to see if two objects have intersected. Takes the laserBeam as first object and ship as second
function laserIntersect(laserBeam, target) {
  return (
    laserBeam.x < target.x + target.width &&
    laserBeam.x + laserBeam.width > target.x &&
    laserBeam.y < target.y + target.height &&
    laserBeam.y + laserBeam.height > target.y
  );
}

///////////////////////////////////////////////////////////////////////////
// main program refresh, can be sped up or slowed down based on gameSpeed.
// each cycle calls the programFlow to control game flow
//////////////////////////////////////////////////////////////////////////
setInterval(programFlow, gameSpeed);
  

