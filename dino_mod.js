



// function sleep(milliseconds) {
//     let timeStart = new Date().getTime();
//     while (true) {
//       let elapsedTime = new Date().getTime() - timeStart;
//       if (elapsedTime > milliseconds) {
//         break;
//       }
//     }
//   }

// Mod jump
/**
 * Initialise a jump.
 * @param {number} speed
 */
 Runner.instance_.tRex.startJump = function(speed) {
    if (this.yPos < 0) {
        // Runner.instance_.gameOver();
        this.jumpVelocity = -1.5 * this.jumpVelocity;
        // sleep(1000);
    }
    else{
    // if (!this.jumping) {
        this.update(0, Trex.status.JUMPING);
        // Tweak the jump velocity based on the speed.
        // this.jumpVelocity = this.config.INITIAL_JUMP_VELOCITY + (speed / 10);
        this.jumpVelocity =  0.8 * this.jumpVelocity - 7;
        // this.jumpVelocity -= 5;
        if (this.jumpVelocity < -14) {
            this.jumpVelocity = -14
        }
        this.jumping = true;
        this.reachedMinHeight = false;
        this.speedDrop = false;

        if (this.config.INVERT_JUMP) {
        this.minJumpHeight = this.groundYPos + this.config.MIN_JUMP_HEIGHT;
        }
    }
}
,

    /**
     * Jump is complete, falling down.
     */
Runner.instance_.tRex.endJump = function() {
    if (this.reachedMinHeight &&
        this.jumpVelocity < this.config.DROP_VELOCITY) {
        // this.jumpVelocity = this.config.DROP_VELOCITY;

    }
}
,

    /**
     * Update frame for a jump.
     * @param {number} deltaTime
     */

Runner.instance_.tRex.updateJump = function(deltaTime) {
    const msPerFrame = Trex.animFrames[this.status].msPerFrame;
    const framesElapsed = deltaTime / msPerFrame;

    // Speed drop makes Trex fall faster.
    if (this.speedDrop) {
        this.yPos += Math.round(this.jumpVelocity *
            this.config.SPEED_DROP_COEFFICIENT * framesElapsed);
    } else if (this.config.INVERT_JUMP) {
        this.yPos -= Math.round(this.jumpVelocity * framesElapsed);
    } else {
        this.yPos += Math.round(this.jumpVelocity * framesElapsed);
    }

    this.jumpVelocity += this.config.GRAVITY * framesElapsed;

    // Minimum height has been reached.
    if (this.config.INVERT_JUMP && (this.yPos > this.minJumpHeight) ||
        !this.config.INVERT_JUMP && (this.yPos < this.minJumpHeight) ||
        this.speedDrop) {
        // this.reachedMinHeight = true;
    }

    // Reached max height.
    if (this.config.INVERT_JUMP && (this.yPos > -this.config.MAX_JUMP_HEIGHT) ||
        !this.config.INVERT_JUMP && (this.yPos < this.config.MAX_JUMP_HEIGHT) ||
        this.speedDrop) {
        this.endJump();
    }

    // Back down at ground level. Jump completed.
    if ((this.config.INVERT_JUMP && this.yPos) < this.groundYPos ||
        (!this.config.INVERT_JUMP && this.yPos) > this.groundYPos) {
        this.reset1();
        this.jumpCount++;

        if (Runner.audioCues) {
        Runner.generatedSoundFx.loopFootSteps();
        }
    }
}
,



/**
 * Process keydown.
 * @param {Event} e
 */
Runner.instance_.onKeyDown = function(e) {
    // Prevent native page scrolling whilst tapping on mobile.
    if (IS_MOBILE && this.playing) {
        e.preventDefault();
    }

    if (this.isCanvasInView()) {
        // Allow toggling of speed toggle.
        if (Runner.keycodes.JUMP[e.keyCode] &&
            e.target == this.slowSpeedCheckbox) {
        return;
        }

        if (!this.crashed && !this.paused) {
        // For a11y, screen reader activation.
        const isMobileMouseInput = IS_MOBILE &&
                e.type === Runner.events.POINTERDOWN &&
                e.pointerType == 'mouse' && e.target == this.containerEl ||
            (IS_IOS && e.pointerType == 'touch' &&
                document.activeElement == this.containerEl);

        if (Runner.keycodes.JUMP[e.keyCode] ||
            e.type === Runner.events.TOUCHSTART || isMobileMouseInput ||
            (Runner.keycodes.DUCK[e.keyCode] && this.altGameModeActive)) {
            e.preventDefault();
            // Starting the game for the first time.
            if (!this.playing) {
            // Started by touch so create a touch controller.
            if (!this.touchController && e.type === Runner.events.TOUCHSTART) {
                this.createTouchController();
            }

            if (isMobileMouseInput) {
                this.handleCanvasKeyPress(e);
            }
            this.loadSounds();
            this.setPlayStatus(true);
            this.update();
            if (window.errorPageController) {
                errorPageController.trackEasterEgg();
            }
            }
            // Start jump.
            // if (!this.tRex.jumping && !this.tRex.ducking) {
            if (!this.tRex.ducking) {

            if (Runner.audioCues) {
                this.generatedSoundFx.cancelFootSteps();
            } else {
                this.playSound(this.soundFx.BUTTON_PRESS);
            }
            this.tRex.startJump(this.currentSpeed);
            }
            // Ducking is disabled on alt game modes.
        } else if (
            !this.altGameModeActive && this.playing &&
            Runner.keycodes.DUCK[e.keyCode]) {
            e.preventDefault();
            if (this.tRex.jumping) {
            // Speed drop, activated only when jump key is not pressed.
            this.tRex.setSpeedDrop();
            } else if (!this.tRex.jumping && !this.tRex.ducking) {
            // Duck.
            this.tRex.setDuck(true);

            }
        }
        }
    }
}
,



// Jump screenshakes!!
// window.oldJump = Runner.instance_.tRex.startJump
// Runner.instance_.tRex.startJump = function() {
// window.oldJump.call(Runner.instance_.tRex, null);
//  for(i=0;i<30;i++) {
//   setTimeout(function() {
//    Runner.instance_.tRex.canvas.style.marginTop = (-10+Math.random()*20) + "px";
//    Runner.instance_.tRex.canvas.style.marginLeft = (-10+Math.random()*20) + "px";
//   }, 500 + i * 10);
//  }
// }



// screenshakes trigger
window.shaker = function() {
 iniTop = Runner.instance_.tRex.canvas.style.marginTop;
 iniLeft = Runner.instance_.tRex.canvas.style.marginLeft;
 iniRight = Runner.instance_.tRex.canvas.style.marginRight;
 iniBottom = Runner.instance_.tRex.canvas.style.marginBottom;
 for(i=0;i<20;i++) {
  setTimeout(function() {
   Runner.instance_.tRex.canvas.style.marginTop = (-10+Math.random()*20*(1 + 0.02 * laserDeathCount)) + "px";
   Runner.instance_.tRex.canvas.style.marginLeft = (-10+Math.random()*20*(1 + 0.02 * laserDeathCount)) + "px";
  }, 50 + i * 10);
 }
 Runner.instance_.tRex.canvas.style.marginTop = iniTop;
 Runner.instance_.tRex.canvas.style.marginLeft = iniLeft;
 Runner.instance_.tRex.canvas.style.marginRight = iniRight;
 Runner.instance_.tRex.canvas.style.marginBottom = iniBottom;
}


// shoot laser!!
b = Runner.instance_.clearCanvas;
laserCount = 0;
laserDeathCount = 30 + Math.round(50 * Math.random());
window.addEventListener("keydown", checkKeyPressed, false);
function checkKeyPressed(l) { if (l.keyCode == "68" ) {drawline()}};
function drawline() {
    if (Runner.instance_.horizon.obstacles.length > 0){
        Runner.instance_.clearCanvas=function(){};
        Runner.instance_.canvasCtx.beginPath();
        Runner.instance_.canvasCtx.moveTo(Runner.instance_.tRex.xPos+23,Runner.instance_.tRex.yPos+20);
        Runner.instance_.canvasCtx.lineTo(Runner.instance_.horizon.obstacles[0].xPos+10,Runner.instance_.horizon.obstacles[0].yPos+10);
        Runner.instance_.canvasCtx.stroke();
        setTimeout(function(){
            Runner.instance_.clearCanvas = b;
            window.shaker();
        }, 15);
    Runner.instance_.horizon.removeFirstObstacle();
        laserCount++;
    }
    if (laserCount > laserDeathCount){
        if (laserDeathCount != 44){
            laserCount = 0;
            // laserDeathCount = 10 + Math.round(20 * Math.random());
            Runner.instance_.gameOver();
        }
    }
}

Runner.config.GRAVITY = 0.5;
// Runner.instance_.setSpeed(30);
// Runner.instance_.gameOver = function(){}



    /**
     * Game over state.
     */
Runner.instance_.gameOver = function(){
    Runner.config.GRAVITY = 0.3;
    laserDeathCount = 10 + Math.round(20 * Math.random());
    laserCount = 0;
    // this.xPos = this.xInitialPos;
    // Runner.instance_.xPos = 0;
    this.playSound(this.soundFx.HIT);
    vibrate(200);

    this.stop();
    this.crashed = true;
    this.distanceMeter.achievement = false;

    this.tRex.update(100, Trex.status.CRASHED);

    // Game over panel.
    if (!this.gameOverPanel) {
        const origSpriteDef = IS_HIDPI ?
            Runner.spriteDefinitionByType.original.HDPI :
            Runner.spriteDefinitionByType.original.LDPI;

        if (this.canvas) {
        if (Runner.isAltGameModeEnabled) {
            this.gameOverPanel = new GameOverPanel(
                this.canvas, origSpriteDef.TEXT_SPRITE, origSpriteDef.RESTART,
                this.dimensions, origSpriteDef.ALT_GAME_END,
                this.altGameModeActive);
        } else {
            this.gameOverPanel = new GameOverPanel(
                this.canvas, origSpriteDef.TEXT_SPRITE, origSpriteDef.RESTART,
                this.dimensions);
        }
        }
    }

    this.gameOverPanel.draw(this.altGameModeActive, this.tRex);

    // Update the high score.
    if (this.distanceRan > this.highestScore) {
        this.saveHighScore(this.distanceRan);
    }

    // Reset the time clock.
    this.time = getTimeStamp();

    if (Runner.audioCues) {
        this.generatedSoundFx.stopAll();
        announcePhrase(
            getA11yString(A11Y_STRINGS.gameOver)
                .replace(
                    '$1',
                    this.distanceMeter.getActualDistance(this.distanceRan)
                        .toString()) +
            ' ' +
            getA11yString(A11Y_STRINGS.highScore)
                .replace(
                    '$1',

                    this.distanceMeter.getActualDistance(this.highestScore)
                        .toString()));
        this.containerEl.setAttribute(
            'title', getA11yString(A11Y_STRINGS.ariaLabel));
    }
    this.showSpeedToggle();
    this.disableSpeedToggle(false);
        // this.xPos = this.xInitialPos;
    Runner.instance_.xPos = 0;
}


// window.addEventListener("keydown", checkKeyPressed2, false);
// function checkKeyPressed2(e) {
//     if (e.keyCode == "37" && Runner.instance_.tRex.xPos>>4) {
//         Runner.instance_.tRex.xPos = Runner.instance_.tRex.xPos - 5;
//     }
// }

// window.addEventListener("keydown", checkKeyPressed1, false);
// function checkKeyPressed1(f) {
//   if (f.keyCode == "39" && Runner.instance_.tRex.xPos<=553) {
//       Runner.instance_.tRex.xPos = Runner.instance_.tRex.xPos - -5;
//     }
// };

// right move v1
// window.addEventListener("keydown", checkKeyPressed1, false);
// function checkKeyPressed1(f) {
//     if (f.keyCode == "39" && Runner.instance_.tRex.xPos<=553) {
//         for(i=0; i<20; i++) {
//             setTimeout(function() {
//                 Runner.instance_.tRex.xPos = Runner.instance_.tRex.xPos + 1;
//                 // shaker();
//             },  i * 10);
//         }
//     }
// };


// right move v2
var isMoving = 0;
i = 0;
var rightTimer;
var leftTimer;

function rightMove() {
    for(i=0;i<30;i++) {
        leftOffset = i * 0.06;
        if (i > 15) {
            leftOffset = 15 * 0.06;
        }
        setTimeout(function() {
            Runner.instance_.tRex.xPos = Runner.instance_.tRex.xPos + leftOffset;
        }, i * 10);
    }
    rightTimer = setTimeout(function(){rightMove()}, 100);
}

function leftMove() {
    for(i=0;i<30;i++) {
        rightOffset = i * 0.06;
        if (i > 15) {
            rightOffset = 15 * 0.06;
        }
        setTimeout(function() {
            Runner.instance_.tRex.xPos = Runner.instance_.tRex.xPos - rightOffset;
        }, i * 10);
    }
    leftTimer = setTimeout(function(){leftMove()}, 100);
}



window.addEventListener("keydown", checkKeyPressed1, false);
function checkKeyPressed1(f) {
    // right move
    if (f.keyCode == "39" && !isMoving) {
            isMoving = 1;
            rightMove();
        }

    // left move
    if (f.keyCode == "37" && !isMoving) {
            isMoving = 1;
            leftMove();
        }

    // press s to stop
    if (f.keyCode == "83") {
        clearTimeout(rightTimer);
        clearTimeout(leftTimer);
        isMoving = 0;

    }
};

// window.addEventListener("keydown", checkKeyPressed3, false);
// function checkKeyPressed3(f) {
//     if (f.keyCode == "37") {
//         clearTimeout(isTimeout);
//         keyCount = 0;
//     }
// };


// // left move v1
// window.addEventListener("keydown", checkKeyPressed2, false);
// function checkKeyPressed2(e) {
//     if (e.keyCode == "37" && Runner.instance_.tRex.xPos>>4) {
//         for(i=0; i<20; i++) {
//             setTimeout(function() {
//                 Runner.instance_.tRex.xPos = Runner.instance_.tRex.xPos - 1;
//                 // shaker();
//             },  i * 10);
//         }
//     }
// }


// Mod: Do not update xPos
Runner.instance_.tRex.reset1 = function() {
    this.xPos = this.xPos;
    this.yPos = this.groundYPos;
    this.jumpVelocity = 0;
    this.jumping = false;
    this.ducking = false;
    this.update(0, Trex.status.RUNNING);
    this.midair = false;
    this.speedDrop = false;
    this.jumpCount = 0;
}
,

/**
 * Process key up.
 * @param {Event} e
 */
 Runner.instance_.onKeyUp = function(e) {
    const keyCode = String(e.keyCode);
    const isjumpKey = Runner.keycodes.JUMP[keyCode] ||
        e.type === Runner.events.TOUCHEND || e.type === Runner.events.POINTERUP;
    if (e.keyCode = '39') {
        clearTimeout(rightTimer);
        isMoving = 0;
    }
    if (e.keyCode = '37') {
        clearTimeout(leftTimer);
        isMoving = 0;
    }
    if (this.isRunning() && isjumpKey) {
        this.tRex.endJump();
    } else if (Runner.keycodes.DUCK[keyCode]) {
        this.tRex.speedDrop = false;
        this.tRex.setDuck(false);
    } else if (this.crashed) {
        // Check that enough time has elapsed before allowing jump key to restart.
        const deltaTime = getTimeStamp() - this.time;

        if (this.isCanvasInView() &&
            (Runner.keycodes.RESTART[keyCode] || this.isLeftClickOnCanvas(e) ||
            (deltaTime >= this.config.GAMEOVER_CLEAR_TIME &&
            Runner.keycodes.JUMP[keyCode]))) {
        this.handleGameOverClicks(e);
        }
    } else if (this.paused && isjumpKey) {
        // Reset the jump state
        this.tRex.reset();
        this.play();
    }
}
,

Obstacle.prototype.getGap = function(gapCoefficient, speed) {
    const minGap = Math.round(
       0.1 * (this.width * speed + this.typeConfig.minGap * gapCoefficient));
    const maxGap = 0.1 * Math.round(minGap * Obstacle.MAX_GAP_COEFFICIENT);
    // return getRandomNum(minGap, maxGap);
    return getRandomNum(minGap, maxGap);
  }


Runner.slowConfig = {
    ACCELERATION: 0.001,
    AUDIOCUE_PROXIMITY_THRESHOLD: 190,
    AUDIOCUE_PROXIMITY_THRESHOLD_MOBILE_A11Y: 250,
    GAP_COEFFICIENT: 0.6,
    INVERT_DISTANCE: 700,
    MAX_SPEED: 13,
    MOBILE_SPEED_COEFFICIENT: 1.2,
    SPEED: 6
  };
