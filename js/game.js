
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
var signalObject = new GameObject();


ctx.globalAlpha = 1

function randomCarColor() {
    let randNum = rand(0, 5)
    // let color = carColors[randNum]
    //carColors.splice(randNum, 1)
    return randNum
}

var translatedY = c.height + ground.h - ground.y;

var platforms = [];
var trainCars = [];
var bushesArray = [];
var mountainArray1 = [];
var mountainArray2 = [];
var signals = [];
var birds = [];

var screenRatio = 1.7680473372781065
var numCars = 3
var carSpacing = window.innerWidth / 30 //25-35
var maxTrainSpeed = window.innerWidth / 8 //90-130
var signalRarity = 2 //1-3
var playerSize = { w: window.innerWidth / 30, h: window.innerWidth / screenRatio / 12 }
var numBirds = 4 // 4
var birdRarity = (window.innerWidth / 1050) * 6  //6
var birdSpeed = maxTrainSpeed / 22 //

let playerSpeed = (maxTrainSpeed) / 110
let trainSpeed = 0
let mtnOffset0 = 0
let mtnOffset1 = 0
let spot0 = 0
let done0 = false
let spot1 = 0
let done1 = false
let signalPasses = 0
let signal = null
let accel = 0
let currentCar = null
let score = 0
let lastBird = null

state = menu

const carColors = [
    "#e55036",
    "#46ac13",
    "#417caa",
    "#8cab25",
    "#ac8752",
    "#a69bb2",
    "#9bb2a5",
]

function randomBirdX() {
    let birdPos = (rand(0, birdRarity) * (500))
    return birdPos
}
function randomBirdY() {
    let birdPos = rand(c.height * .2, c.height * .5)
    return birdPos
}


function init() {
    c.width = window.innerWidth
    c.height = window.innerWidth / screenRatio

    avatar.color = `blue`;
    avatar.w = playerSize.w
    avatar.h = playerSize.h
    avatar.x = c.width / 7
    avatar.y = c.height * .75

    level.x = 0;
    level.y = 0;

    for (let i = 0; i < numBirds; i++) {
        let bird = null
        if (birds[i]) {
            bird = birds[i]
        } else {
            bird = new GameObject();
        }
        //bird = birds[i]
        bird.h = c.height / 9
        bird.w = bird.h
        let lastX = 0
        if (birds.length > 0) lastX = birds[birds.length - 1].x
        bird.x = c.width + (i * ((birdRarity * (1000)) + randomBirdX()))
        bird.y = randomBirdY()
        bird.color = "red"
        bird.world = level
        birds[i] = bird
        birds[i].passes = 0
    }

    for (let i = 0; i < numCars; i++) {
        let car = null
        if (trainCars[i]) {
            car = trainCars[i]
        } else {
            car = new GameObject();
        }
        car.w = (c.width / 2);
        car.h = c.height * .25;
        car.x = ((car.w) / 2) + ((carSpacing) * i) + (((car.w)) * i)
        car.y = c.height - (car.h / 2) + (c.height / 20)
        car.world = level
        car.containerId = randomCarColor()
        trainCars[i] = car
    }

    currentCar = trainCars[0]
    trainCars[0].stepped = true
    for (let i = 0; i < 2; i++) {
        let bushes = null
        if (bushesArray[i]) {
            bushes = bushesArray[i]
        } else {
            bushes = new GameObject();
        }
        // bushes.color = `black`;
        bushes.w = (c.width * 2);
        bushes.h = bushes.w * .4;
        bushes.x = ((bushes.w) / 2) + (((bushes.w)) * i)
        bushes.y = c.height / 2.5 //c.height - (bushes.h / 2) + 20
        bushes.world = level
        bushesArray[i] = bushes

        //bushes.containerId = randomCarColor()
    }
    for (let i = 0; i < 2; i++) {
        let mountain = null
        if (mountainArray1[i]) {
            mountain = mountainArray1[i]
        } else {
            mountain = new GameObject();
        }
        mountain.w = (c.width * 2);
        mountain.h = mountain.w / 4;
        mountain.x = ((mountain.w) / 2) + ((((mountain.w)) * i))
        mountain.y = c.height / 3.5//c.height - (bushes.h / 2) + 20
        mountain.world = level
        mountainArray1[i] = mountain

        let mountain2 = null
        if (mountainArray2[i]) {
            mountain2 = mountainArray2[i]
        } else {
            mountain2 = new GameObject();
        }
        mountain2.w = (c.width * 2);
        mountain2.h = mountain.w / 3.5;
        mountain2.x = ((mountain2.w) / 2) + ((((mountain2.w)) * i))
        mountain2.y = c.height / 3.5//c.height - (bushes.h / 2) + 20
        mountain2.world = level
        mountainArray2[i] = mountain2

    }




    signalObject.color = "black"
    signalObject.h = c.height / 1.2
    signalObject.w = signalObject.h / 7
    signalObject.x = c.width
    signalObject.y = c.height + (signalObject.h / 9)
    signalObject.world = level

    ctx.imageSmoothingEnabled = true
}

init();

function resetGame() {
    state = game;
    ctx.clearRect(c.width / 2, c.height / 2, c.width, c.height)
    init()
    score = 0
    avatar.vx = 0
    avatar.vy = 0
    avatar.canJump = false
    avatar.isFalling = true
    trainSpeed = 0
}

/*---------------Game Screens (states)----------------*/
function menu() {
    document.getElementById("canvas").style.backgroundColor = "black"
    ctx.fillStyle = "white"
    ctx.font = "bold " + String(c.width / 70) + "px" + " Trebuchet MS"

    button.color = "#1a1a1a"
    button.x = c.width / 2
    button.y = c.height * .65
    button.w = c.width / 10
    button.h = button.w / 2.8

    let lineHeight = c.width / 40
    let yPos = c.width / 5.5
    ctx.textAlign = "center"
    ctx.fillText("You are a newborn traffic cone.", c.width / 2, yPos)
    ctx.fillText("Afraid of loud noises, you run off from your first jobsite and hop onto a nearby train.", c.width / 2, yPos + (1 * lineHeight))
    ctx.fillText("You soon realize you've made a grave mistake, this train is heading directly back to the jobsite.", c.width / 2, yPos + (2 * lineHeight))
    ctx.fillText("It's too dangerous to jump, you have to hop off the back.", c.width / 2, yPos + (3 * lineHeight))

    ctx.fillText("Canadian freight trains carry about 114 cars on average.", c.width / 2, yPos + (5 * lineHeight))
    // ctx.fillText("Lucky for you, this one is only 50 cars long.", c.width/2, yPos+(7*lineHeight))

    //
    //ctx.fillText("Canadian freight trains carry about 114 cars on average.", c.width/2, 200)

    if (clicked(button)) {
        state = game;
    }
    button.render()
    ctx.fillText("PLAY", button.x, button.y + (button.h / 10))

}

function win() {

}
function lose() {

    document.getElementById("canvas").style.backgroundColor = "black"
    ctx.fillStyle = "red"
    ctx.font = "bold " + String(c.width / 45) + "px" + " Trebuchet MS"

    button.color = "#1a1a1a"
    button.x = c.width / 2
    button.y = c.height * .65
    button.w = c.width / 10
    button.h = button.w / 2.8

    let lineHeight = c.width / 15
    let yPos = c.width / 4.5
    ctx.textAlign = "center"
    ctx.fillText("YOU LOSE", c.width / 2, yPos)
    ctx.fillStyle = "white"
    ctx.font = "bold " + String(c.width / 70) + "px" + " Trebuchet MS"

    ctx.fillText("Press space or click respawn.", c.width / 2, yPos + lineHeight)

    if (clicked(button)) {
        resetGame()
    }
    if (doReset) {
        doReset = false
        resetGame()
    }
    button.render()
    ctx.fillText("RESPAWN", button.x, button.y + (button.h / 10))

}

function game() {
    document.getElementById("canvas").style.backgroundColor = "#a6ceff"

    accel = playerSpeed
    if (trainSpeed <= maxTrainSpeed) trainSpeed += (maxTrainSpeed / 250);

    if (sp == true && avatar.canJump == true) {
        avatar.canJump = false;
        avatar.vy = -playerSpeed * 20;
    }
    if (a == true) {
        avatar.vx += -accel;
    }
    if (d == true) {
        avatar.vx += accel;
    }


    avatar.vx *= .85;
    avatar.vy += c.height / 500;

    if (ctrl == true && avatar.canJump) {
        avatar.h = playerSize.h / 2
        avatar.y += 25 / 2
        avatar.vx *= .7
    } else {
        avatar.h = playerSize.h
        accel = playerSpeed
    }

    avatar.move();
    //avatar.canJump = false
    //used to move the level. 
    var offset = { x: avatar.vx, y: avatar.vy }

    let carOffset = trainCars[1].y - c.height + (trainCars[1].h / 2)
    let voidLevel = c.height - (trainCars[1].h) + carOffset + 2
    for (let i = 0; i < trainCars.length; i++) {
        let ground = trainCars[i]
        while (ground.isOverPoint(avatar.bottomL()) && !avatar.falling) {
            // console.log(ground.x , currentCar.x)
            if (currentCar != ground && !ground.stepped) {
                ground.stepped = true
                currentCar = ground
                score++
            }
            avatar.vy = 0;

            avatar.y -= .2;
            offset.y--;
            avatar.canJump = true;
        }
    }

    if (avatar.bottomL().y > voidLevel) {
        avatar.falling = true;
        avatar.canJump = false;
    } else {
        avatar.falling = false
    }


    //----- Camera Code -----------
    var dx = -trainSpeed//c.width / 2 - avatar.x
    var dy = 0//c.height / 2 - avatar.y

    level.x += dx * .05;
    avatar.x += dx * .05;
    level.y += dy * .15;
    avatar.y += dy * .15;

    //----------------------------/


    signalObject.x -= trainSpeed / 110

    let signalX = (signalObject.x + level.x) * (signalPasses + 1)
    if (signalX < 0) {
        signalPasses++;
        signalObject.x += c.width * ((Math.random() * signalRarity) + 1)
    }

    for (let i = 0; i < mountainArray1.length; i++) {
        mtnOffset0 -= trainSpeed * .0005
        let mtn1 = mountainArray1[i]

        let mtn1End = mtn1.x + level.x + (mtn1.w / 2)

        mtn1.x = (spot0) + (-level.x + mtnOffset0 + (mtn1.w * i)) - (mtn1.w / 4)

        if (mtn1End - mtn1.w < 0) {
            if (i == 1 && !done0) {
                done0 = true
                spot0 += (mtn1.w * (mountainArray1.length - 1))
            }

        } else {
            done0 = false
        }

        mtn1.renderImage(document.getElementById("Mountain1"), true)


    }
    for (let i = 0; i < mountainArray2.length; i++) {
        mtnOffset1 -= trainSpeed * .001

        let mtn2 = mountainArray2[i]

        let mtn2End = mtn2.x + level.x + (mtn2.w / 2)

        mtn2.x = (spot1) + (-level.x + mtnOffset1 + (mtn2.w * i))

        if (mtn2End - mtn2.w < 0) {
            if (i == 1 && !done1) {
                done1 = true
                spot1 += (mtn2.w * (mountainArray2.length - 1))
            }
        } else {
            done1 = false
        }
        mtn2.renderImage(document.getElementById("Mountain2"))

    }

    ctx.globalAlpha = 1
    ctx.drawImage(document.getElementById("Sky"), 0, 0, c.width, c.height)
    ctx.globalAlpha = 1

    for (let i = 0; i < bushesArray.length; i++) {
        // if (bushesArray[i]) {

        let bush = bushesArray[i]
        bush.x -= trainSpeed / 150

        let bushEnd = bush.x + (bush.w / 2)
        if (bushEnd + level.x < 0) {
            let spot = (bush.w * bushesArray.length)
            bush.x += spot
        }

        bush.renderImage(document.getElementById("Bushes"))
        //}
    }

    for (let i = 0; i < trainCars.length; i++) {
        let car = trainCars[i]

        let end = car.x + (car.w / 2)
        if (end + level.x < 0) {
            let spot = (((car.w) + carSpacing) * numCars)
            car.x += spot
            carColors.push(car.color)
            car.containerId = randomCarColor()
            car.stepped = false
        }


        car.renderImage(document.getElementById("Container" + String(car.containerId)));
    }

    //wall.render();
    avatar.renderImage(document.getElementById("Cone"));
    signalObject.renderImage(document.getElementById("Signal"));

    for (let i = 0; i < birds.length; i++) {
        let bird = birds[i]
        bird.x -= birdSpeed
        if (bird.x + level.x < c.width) bird.y += birdSpeed / 30
        if (bird.x + level.x < 0) {
            if (lastBird == null) lastBird = [birds.length - 1]
            bird.x = (birds[lastBird].x) + (birdRarity * (1000)) + randomBirdX()
            bird.y = randomBirdY()
            lastBird = i
        }

        bird.renderImage(document.getElementById("Eagle"));

        if (avatar.overlaps(bird) || avatar.y > c.height || avatar.x + avatar.w < 0 || avatar.x - avatar.w > c.width) state = lose; doReset = false; sp = false

    }
    ctx.fillStyle = "black"
    ctx.font = "30px Gotham Black"
    ctx.fillText(score, 20, 40, 1000)
    //WIN / LOSE CONDITIONS
    if (avatar.overlaps(signalObject) || avatar.y > c.height || avatar.x + avatar.w < 0 || avatar.x - avatar.w > c.width) state = lose; ; doReset = false; sp = false

}




