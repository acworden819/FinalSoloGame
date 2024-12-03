
var c = document.querySelector(`canvas`)
var ctx = c.getContext(`2d`)
var fps = 1000 / 60
var timer = setInterval(main, fps)

function main() {
    ctx.clearRect(0, 0, c.width, c.height);
    state()
}

//setup
var state;
var button = new GameObject();
var avatar = new GameObject();
var ground = new GameObject();
var wall = new GameObject();
var level = new GameObject();

const carColors = [
    "#e55036",
    "#46ac13",
    "#417caa",
    "#8cab25",
    "#ac8752",
    "#a69bb2",
    "#9bb2a5",
]



function randomCarColor() {
    let randNum = rand(0, 5)
    // let color = carColors[randNum]
    //carColors.splice(randNum, 1)
    return randNum
}

var translatedY = c.height + ground.h - ground.y;
var platformsData = [
    /* {
         w: 200,
         h: 34,
         x: 200,
         y: translatedY-(180*1),
         color: `tan`,
         world: level,
     },
     {
         w: 200,
         h: 34,
         x: 200,
         y: translatedY-(180*2),
         color: `tan`,
         world: level,
     },
     {
         w: 200,
         h: 34,
         x: 200,
         y: translatedY-(180*3),
         color: `tan`,
         world: level,
     },*/


];

var platforms = [];
var trainCars = [];

var numCars = 3
var carSpacing = 25
var trainSpeed = 50

for (let i = 0; i < platformsData.length; i++) {
    var platform = new GameObject();
    var pData = platformsData[i]
    platform.w = pData.w
    platform.h = pData.h
    platform.x = pData.x
    platform.y = pData.y
    platform.color = pData.color
    platform.world = pData.world
    platforms[i] = platform
}


function init() {
    state = menu

    avatar.color = `blue`;

    level.x = 0;
    level.y = 0;

    for (let i = 0; i < numCars; i++) {
        let car = new GameObject();
        //car.color = `black`;
        car.w = (c.width / 2);
        car.h = c.height * .25;
        console.log(car.w, car.h)
        car.x = ((car.w) / 2) + ((carSpacing) * i) + (((car.w)) * i)
        car.y = c.height - (car.h / 2)
        car.world = level
        car.containerId = randomCarColor()
        trainCars[i] = car
    }

}

init();

/*---------------Game Screens (states)----------------*/
function menu() {
    if (clicked(button)) {
        state = game;
    }
    button.render()
}

function win() {

}
function lose() {

}

function game() {


    if (sp == true && avatar.canJump == true) {
        avatar.canJump = false;
        avatar.vy = -25;
    }
    if (a == true) {
        avatar.vx += -1;
    }
    if (d == true) {
        avatar.vx += 1;
    }
    if (ctrl == true && avatar.canJump){
            avatar.h = 25
            avatar.y += 25/2
    }else{
        avatar.h = 50
    }

    avatar.vx *= .85;
    avatar.vy += 1.3;
    avatar.move();

    //used to move the level. 
    var offset = { x: avatar.vx, y: avatar.vy }

    for (let i = 0; i < trainCars.length; i++) {
        let ground = trainCars[i]
        while (ground.isOverPoint(avatar.bottomL())) {
            avatar.vy = 0;
            avatar.y--;
            offset.y--;
             avatar.canJump = true;
        }
    }


    for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i]
        while (platform.isOverPoint(avatar.bottomL()) || platform.isOverPoint(avatar.bottomR()) && avatar.vy >= 0) {
            avatar.vy = 0;
            avatar.y--;
            offset.y--;
            avatar.canJump = true
        }
        platform.render();

    }

    /* while (wall.isOverPoint(avatar.right()) && avatar.vx >= 0) {
         avatar.vx = 0;
         avatar.x--;
         offset.x--;
     }*/

    /*-------Level movement threshold----*/
    //if(avatar.x > 500 || avatar.x < 300)
    //{
    //Level movement code
    //level.x -= offset.x;
    //avatar.x -= offset.x;
    //level.y -= offset.y;
    //avatar.y -= offset.y;
    //}

    //----- Camera Code -----------
    var dx = -trainSpeed//c.width / 2 - avatar.x
    var dy = 0//c.height / 2 - avatar.y

    level.x += dx * .05;
    avatar.x += dx * .05;
    level.y += dy * .15;
    avatar.y += dy * .15;
    //----------------------------/



    for (let i = 0; i < trainCars.length; i++) {
        let car = trainCars[i]

        let end = car.x + (car.w / 2)
        if (end + level.x < 0) {
            let spot = (((car.w) + carSpacing) * numCars)
            car.x += spot
            carColors.push(car.color)
            car.containerId = randomCarColor()
        }

        car.renderImage(document.getElementById("Container" + String(car.containerId)));
    }
    //wall.render();
    avatar.render();

}



