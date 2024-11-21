
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

var translatedY = c.height+ground.h-ground.y;
var platformsData = [
    {
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
    },


];

var platforms = [];

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

    avatar.color = `green`;

    level.x = 0;
    level.y = 0;

    ground.color = `brown`;
    ground.w = c.width;
    ground.h = c.height * .25;
    ground.y = c.height - ground.h / 2;
    ground.world = level



    wall.h = 200;
    wall.w = 34;
    wall.color = `purple`
    wall.x = 700;
    wall.world = level

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

    avatar.vx *= .85;
    avatar.vy += 1.3;
    avatar.move();

    //used to move the level. 
    var offset = { x: avatar.vx, y: avatar.vy }

    while (ground.isOverPoint(avatar.bottomL())) {
        avatar.vy = 0;
        avatar.y--;
        offset.y--;
        avatar.canJump = true;
    }

    for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i]
        while (platform.isOverPoint(avatar.bottomL()) || platform.isOverPoint(avatar.bottomR()) && avatar.vy >= 0) {
            avatar.vy = 0;
            avatar.y--;
            offset.y--;
            avatar.canJump = true;
        }
        platform.render();

    }

    while (wall.isOverPoint(avatar.right()) && avatar.vx >= 0) {
        avatar.vx = 0;
        avatar.x--;
        offset.x--;
    }

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
    var dx = c.width / 2 - avatar.x
    var dy = c.height / 2 - avatar.y

    level.x += dx * .05;
    avatar.x += dx * .05;
    level.y += dy * .15;
    avatar.y += dy * .15;
    //----------------------------/


    ground.render();
    wall.render();
    avatar.render();

}



