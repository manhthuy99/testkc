
var allIcon = document.querySelectorAll('.image');

var bombsCoolerItem = document.querySelector('.bombs-cooler-item');
var treasureItem = document.querySelector('.treasure-item');
var shuffleItem = document.querySelector('.shuffle-item');
var freeSwapItem = document.querySelector('.free-swap-item');
var dynamiteBombsItem = document.querySelector('.dynamite-bombs-item');

var giveHintsButton = document.querySelector('.give-hints-btn');
var newGameButton = document.querySelector('.new-game-btn');
var newGameButtonPause = document.querySelector('.pause-new-game-btn');
var pauseButton = document.querySelector('.pause-btn');
var resumeButton = document.querySelector('.resume-btn');
var soundButton = document.querySelector('.sound-btn');
var musicButton = document.querySelector('.music-btn');


//sound variables
var allowSound = true;
var allowMusic = true;
var muteComboNewGame = false; //mute the sound of function autoCheck at the beginning of a game
var playBackgroundMusic = document.getElementById('background-music');
var playClick = document.getElementById('click-sound');
var playBombsCoolerUsed = document.getElementById('bombs-cooler-used-sound');
var playShuffleUsed = document.getElementById('shuffle-used-sound');
var playTreasureCreated = document.getElementById('treasure-created-sound');
var playTreasureUsed = document.getElementById('treasure-used-sound');
var playFreeSwapUsed = document.getElementById('free-swap-used-sound');
var playDynamiteBombsUsed = document.getElementById('dynamite-bombs-used-sound');
var playHintsUsed = document.getElementById('hints-used-sound');
var playCombo1 = document.getElementById('combo-1-sound');
var playCombo2 = document.getElementById('combo-2-sound');
var playCombo3 = document.getElementById('combo-3-sound');
var playInvalidMoveNoComboMove = document.getElementById('invalid-move-no-combo-move-sound');
var playMouseHoverSound = document.getElementById('mouse-hover-sound');
var playSwapSound = document.getElementById('swap-sound');
var playGameOverSound = document.getElementById('game-over-sound');


allIcon.forEach(item => item.addEventListener('mousedown', firstCell));
allIcon.forEach(item => item.addEventListener('mouseup', secondCell));
allIcon.forEach(item => item.addEventListener('mouseover', mouseHover));

bombsCoolerItem.addEventListener('click', bombsCoolerItemHandler);
treasureItem.addEventListener('click', treasureItemHandler);
shuffleItem.addEventListener('click', shuffleItemHandler);
freeSwapItem.addEventListener('click', freeSwapItemHandler);
dynamiteBombsItem.addEventListener('click', dynamiteBombsItemHandler);

giveHintsButton.addEventListener('click', giveHintsButtonHandler);
newGameButton.addEventListener('click', newGameButtonHandler);
newGameButtonPause.addEventListener('click', newGameButtonPauseHandler);
pauseButton.addEventListener('click', pauseButtonHandler);
resumeButton.addEventListener('click', resumeButtonHandler);
soundButton.addEventListener('click', soundButtonHandler);
musicButton.addEventListener('click', musicButtonHandler);

var playerScore = document.getElementById('player-score');
var moves = document.getElementById('count-moves');
var score = 0;
var countLife = 3;
var firstPos = [1,1], secondPos = [1,2]; //first picked position, second picked position
var check; //true or false, to check if the autocheck function is needed to go on
var fireTreasure = false; //true or false, to check if the treasure is newly created or needed to be fired
var fireDynamiteBombs = false;
var fireFreeSwap = false;
var firePause = false;
var newGame = false;
var countMoves = 0;
var countConsecutive = 0;
var hintsLeft;
var changeYellow, changeRed, timeLeft;

//store this game in an array
var arr = [];
var random = () => Math.floor((Math.random()*8)+1);
var randomLuckyJewel = () => Math.floor(Math.random()*20+1);



//create a new game as soon as the player enters the game screen
newGameButtonHandler();


function newGameButtonHandler() {
    newGame = true;
    if (allowSound) { playClick.play() };
    
    //create a random game
    resetGame();
    
    //set all the items quantity back to 0
    document.getElementById('bombs-cooler').textContent = 0;
    document.getElementById('treasure').textContent = 0;
    document.getElementById('shuffle').textContent = 0;
    document.getElementById('free-swap').textContent = 0;
    document.getElementById('dynamite-bombs').textContent = 0;
    
    //give 2 random items
    giveARandomItem();
    giveARandomItem();
    
    //add grey background for unavailable items 
    if (document.getElementById('bombs-cooler').textContent == 0) {
        document.querySelector('.bombs-cooler-item').classList.add('unavailable-item');
    }
    if (document.getElementById('treasure').textContent == 0) {
        document.querySelector('.treasure-item').classList.add('unavailable-item');
    }
    if (document.getElementById('shuffle').textContent == 0) {
        document.querySelector('.shuffle-item').classList.add('unavailable-item');
    }
    if (document.getElementById('free-swap').textContent == 0) {
        document.querySelector('.free-swap-item').classList.add('unavailable-item');
    }
    if (document.getElementById('dynamite-bombs').textContent == 0) {
        document.querySelector('.dynamite-bombs-item').classList.add('unavailable-item');
    }
    
    //display top 5 player in High Score Board
    var getPlayerScore = JSON.parse(localStorage.getItem('highScore')) || [];
    
    //order high score
    var inOrder;
    do {
        inOrder = true;
        for (let i = 0; i < getPlayerScore.length - 1; i++) {
            if (getPlayerScore[i][1] < getPlayerScore[i+1][1]) {
                [getPlayerScore[i][1], getPlayerScore[i+1][1]] = [getPlayerScore[i+1][1], getPlayerScore[i][1]];
                [getPlayerScore[i][0], getPlayerScore[i+1][0]] = [getPlayerScore[i+1][0], getPlayerScore[i][0]];
                inOrder = false;
            }
        }
    } while (!inOrder)
        
    if (getPlayerScore.length < 5) {
        for (let i = 0; i < 5; i++) {
            if (i < getPlayerScore.length) {
                document.querySelector('.name-'+ i).textContent = getPlayerScore[i][0];
                document.querySelector('.score-'+ i).textContent = getPlayerScore[i][1];
            } else {
                document.querySelector('.name-'+ i).textContent = null;
                document.querySelector('.score-'+ i).textContent = null;
            }
        }
        
    } else {
        for (let i = 0; i < 5; i++) {
            document.querySelector('.name-'+ i).textContent = getPlayerScore[i][0];
            document.querySelector('.score-'+ i).textContent = getPlayerScore[i][1];
        }
    }
    
    //set score to 0
    score = 0;
    playerScore.textContent = 0;
    
    //set moves to 0
    countMoves = 0;
    moves.textContent = countMoves;
    countLife = 3;
    document.getElementById('life').textContent = countLife;
    newGame = false;
    
}

function newGameButtonPauseHandler() {
    resumeButtonHandler();
    newGameButtonHandler();
}

function endGame() {
    if (allowSound) { playGameOverSound.play() };
    document.querySelector('.game-container').style.filter = 'brightness(0%)';
    document.querySelector('.game-container').style.filter = 'blur(10px)';
    document.querySelector('.left-container').style.display = 'none';
    document.querySelector('.right-container').style.display = 'none';
    document.querySelector('.item-container').style.display = 'none';
    document.querySelector('.resume-btn').style.display = 'none';
    document.querySelector('.pause-board').style.display = 'block';
    document.querySelector('.uscore-section').style.display = 'block';
    
    
    document.querySelector('.u-score').textContent = score;
    
    
    var getPlayerScore = JSON.parse(localStorage.getItem('highScore')) || [];
    var playerName = getPlayerScore[getPlayerScore.length - 1][0];
    var playerPreviousScore = getPlayerScore[getPlayerScore.length - 1][1];
    
    if (playerPreviousScore < score) {
        getPlayerScore.pop();
        getPlayerScore.push([playerName, score]);
        localStorage.setItem('highScore', JSON.stringify(getPlayerScore));

        var inOrder;
        do {
            inOrder = true;
            for (let i = 0; i < getPlayerScore.length - 1; i++) {
                if (getPlayerScore[i][1] < getPlayerScore[i+1][1]) {
                    [getPlayerScore[i][1], getPlayerScore[i+1][1]] = [getPlayerScore[i+1][1], getPlayerScore[i][1]];
                    [getPlayerScore[i][0], getPlayerScore[i+1][0]] = [getPlayerScore[i+1][0], getPlayerScore[i][0]];
                    inOrder = false;
                }
            }
        } while (!inOrder)
    }
    
    //display top 5 player in High Score Board
    if (getPlayerScore.length < 5) {
        for (let i = 0; i < 5; i++) {
            if (i < getPlayerScore.length) {
                document.querySelector('.name-'+ i).textContent = getPlayerScore[i][0];
                document.querySelector('.score-'+ i).textContent = getPlayerScore[i][1];
            } else {
                document.querySelector('.name-'+ i).textContent = null;
                document.querySelector('.score-'+ i).textContent = null;
            }
        }
        
    } else {
        for (let i = 0; i < 5; i++) {
            document.querySelector('.name-'+ i).textContent = getPlayerScore[i][0];
            document.querySelector('.score-'+ i).textContent = getPlayerScore[i][1];
        }
    }
    
}

function pauseButtonHandler() {
    if (allowSound) { playClick.play() };
    document.querySelector('.game-container').style.filter = 'brightness(0%)';
    document.querySelector('.game-container').style.filter = 'blur(10px)';
    document.querySelector('.left-container').style.display = 'none';
    document.querySelector('.right-container').style.display = 'none';
    document.querySelector('.item-container').style.display = 'none';
    document.querySelector('.pause-board').style.display = 'block';
    document.querySelector('.resume-btn').style.display = 'block';
    document.querySelector('.uscore-section').style.display = 'none';
    //add a div in html, then add a class into it to display resume, new game, home, etc.

}

function resumeButtonHandler() {
    if (allowSound) { playClick.play() };
    document.querySelector('.game-container').style.filter = 'brightness(100%)';
    document.querySelector('.game-container').style.filter = 'blur(0px)';
    document.querySelector('.left-container').style.display = 'block';
    document.querySelector('.right-container').style.display = 'block';
    document.querySelector('.item-container').style.display = 'block';
    document.querySelector('.pause-board').style.display = 'none';
    document.querySelector('.uscore-section').style.display = 'none';
    //remove a class from the div
    
}

function soundButtonHandler() {
    playClick.play();
    
    if (allowSound) {
        allowSound = false;
        soundButton.src = "../Images/mining-game-icons/sound-off.png";
    } else {
        allowSound = true;
        soundButton.src = "../Images/mining-game-icons/sound-on.png";
    }
}

function musicButtonHandler() {
    if (allowSound) { playClick.play() };
    
    if (allowMusic) {
        allowMusic = false;
        playBackgroundMusic.pause();
        musicButton.src = "../Images/mining-game-icons/music-off.png";
    } else {
        allowMusic = true;
        playBackgroundMusic.play();
        musicButton.src = "../Images/mining-game-icons/music-on.png";
    }
    playBackgroundMusic.loop = true;
}

function mouseHover() {
    if (allowSound) { playMouseHoverSound.play() };
    if (allowMusic) { playBackgroundMusic.play() };
}


//create a random color on screen and on our array
function createRandomColor(i,j) {
    arr[i][j] = random();
    let cell = document.getElementById(i+'-'+j).src;
    cell = cell.slice(0, cell.length - 5) + arr[i][j] + '.png';
    document.getElementById(i+'-'+j).src = cell;
}
    
function resetGame() {
    for (let i = 0; i <= 9; i++) {
        arr[i] = [];
        for (let j = 0; j <= 9; j++) {
            if (i == 0 || j == 0 || i == 9 || j == 9) {
                arr[i][j] = -2;

            } else {
                createRandomColor(i,j);
            }
        }
    }
    let oldScore = score;
    
    //remove all the existing combos
    muteComboNewGame = true;
    autoCheck();
    muteComboNewGame = false;
    
    score = oldScore;
    playerScore.textContent = score;
    
    //add and remove bombs properties
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            if (arr[i][j] == 8) {
                document.getElementById(i+'-'+j+'-bomb').textContent = 50;
                document.getElementById(i+'-'+j+'-bomb').classList.add('bombs-count-down');
            } else {
                document.getElementById(i+'-'+j+'-bomb').textContent = null;
                document.getElementById(i+'-'+j+'-bomb').classList.remove('bombs-count-down');
            }
        }
    }
}


function createTreasure(i,j) {
    arr[i][j] = 0;
    let cell = document.getElementById(i+'-'+j).src;
    cell = cell.slice(0, cell.length - 5) + arr[i][j] + '.png';
    document.getElementById(i+'-'+j).src = cell;
}


function createLuckyJewel(i,j) {
    arr[i][j] = 'a';
    let cell = document.getElementById(i+'-'+j).src;
    cell = cell.slice(0, cell.length - 5) + arr[i][j] + '.png';
    document.getElementById(i+'-'+j).src = cell;
}


function createBombsCountDown(i,j) {
    arr[i][j] = 8;
    let cell = document.getElementById(i+'-'+j).src;
    cell = cell.slice(0, cell.length - 5) + arr[i][j] + '.png';
    document.getElementById(i+'-'+j).src = cell;
    //add class .bombs-count-down, textContent
    document.getElementById(i+'-'+j+'-bomb').setAttribute('class', 'bombs-count-down');
    document.getElementById(i+'-'+j+'-bomb').textContent = 50;
}

//give a random item
function giveARandomItem() {
    let itemList = ['bombs-cooler', 'treasure', 'shuffle', 'free-swap', 'dynamite-bombs'];
    let randomItem = itemList[Math.floor(Math.random()*5)];
    
    let countItem = parseInt(document.getElementById(randomItem).textContent);
    countItem++;
    document.getElementById(randomItem).textContent = countItem;
    
    //remove grey background for available item
    document.querySelector('.' + randomItem + '-item').classList.remove('unavailable-item');
    
}

//check if it's a valid move, return true or false
function checkValidMove(position_1, position_2) { 
    if ((position_1[0] == position_2[0] && Math.abs(position_1[1] - position_2[1]) <= 1) || 
        (position_1[1] == position_2[1] && Math.abs(position_1[0] - position_2[0]) <= 1)) {
        return true
    } else return false
}

//swap UI and value two elements
function swap() {
    let carrier;
    //swap if selected positions are bombs
    if (arr[firstPos[0]][firstPos[1]] == 8 || arr[secondPos[0]][secondPos[1]] == 8) {
        if (arr[firstPos[0]][firstPos[1]] != arr[secondPos[0]][secondPos[1]]) {
            if (arr[firstPos[0]][firstPos[1]] == 8) {
                //swap text content
               document.getElementById(secondPos[0]+'-'+secondPos[1]+'-bomb').textContent = document.getElementById(firstPos[0]+'-'+firstPos[1]+'-bomb').textContent;
               document.getElementById(firstPos[0]+'-'+firstPos[1]+'-bomb').textContent = null;
               //swap class
               document.getElementById(secondPos[0]+'-'+secondPos[1]+'-bomb').classList.add('bombs-count-down');
               document.getElementById(firstPos[0]+'-'+firstPos[1]+'-bomb').classList.remove('bombs-count-down');
               
            } else {
                //swap text content
                document.getElementById(firstPos[0]+'-'+firstPos[1]+'-bomb').textContent = document.getElementById(secondPos[0]+'-'+secondPos[1]+'-bomb').textContent;
               document.getElementById(secondPos[0]+'-'+secondPos[1]+'-bomb').textContent = null;
               //swap class
               document.getElementById(secondPos[0]+'-'+secondPos[1]+'-bomb').classList.remove('bombs-count-down');
               document.getElementById(firstPos[0]+'-'+firstPos[1]+'-bomb').classList.add('bombs-count-down');
            }
            
        }
    }
    
    if (allowSound) { playSwapSound.play() }
    
    //swap values in our array
    carrier = arr[firstPos[0]][firstPos[1]];
    arr[firstPos[0]][firstPos[1]] = arr[secondPos[0]][secondPos[1]];
    arr[secondPos[0]][secondPos[1]] = carrier;  
    
    //swap two icons on screen
    carrier = document.getElementById(firstPos[0]+ '-' + firstPos[1]).src;
    document.getElementById(firstPos[0]+ '-' + firstPos[1]).src = document.getElementById(secondPos[0]+ '-' + secondPos[1]).src;
    document.getElementById(secondPos[0]+ '-' + secondPos[1]).src = carrier;
    
    
    //add some animation to see the swapping
}

    
function checkCombo(i,j) { //check combo at one position
    let m, n;
    let horizontal;
    let vertical;
    let right = 0;
    let left = 0;
    let top = 0;
    let bottom = 0;
    if (arr[i][j] == 'a') { //check if position [i,j] is lucky jewel
        //check horizontal
        
            //check right
        m = i; n = j + 1;
        if (j == 8) {
            right = 0;
        } else {
            if (arr[i][j+1] == 'a') {
                arr[i][j] = arr[i][j+2];
            } else {
                arr[i][j] = arr[i][j+1];
            }
            while (arr[i][j] == arr[m][n] || arr[m][n] == 'a') {
                right++;
                n++;
            }
        }

            //check left
        m = i; n = j - 1;
        if (j == 1) {
            left = 0;
        } else {
            if (arr[i][j-1] == 'a') {
                arr[i][j] = arr[i][j-2];
            } else {
                arr[i][j] = arr[i][j-1];
            }
            while (arr[i][j] == arr[m][n] || arr[m][n] == 'a') {
                left++;
                n--;
            }   
        }
        
        //calculate horizontal
        if (arr[i][j+1] == arr[i][j-1] || arr[i][j+1] == 'a' || arr[i][j-1] == 'a') {
            horizontal = right + left + 1;
        } else {
            
            if (right < 2) {right = 0};
            if (left < 2) {left = 0};
            if (right == 0 || left == 0) {
                horizontal = Math.max(right, left) + 1;
            }
            if (right == 2 && left == 2) {
                horizontal = 3;
                left = 0;
            } 
            if (right >= 2 && left >= 2 && right != left) {
                horizontal = right + left + 1;
            }
        }
        

        //check vertical
        
            //check top
        m = i - 1; n = j;
        if (i == 1) {
            top = 0;
        } else {
            if (arr[i-1][j] == 'a') {
                arr[i][j] = arr[i-2][j];
            } else {
                arr[i][j] = arr[i-1][j];
            }
            while (arr[i][j] == arr[m][n] || arr[m][n] == 'a') {
                top++;
                m--;
            }
        }

            //check bottom
        m = i + 1; n = j;
        if (i == 8) {
            bottom = 0;
        } else {
            if (arr[i+1][j] == 'a') {
                arr[i][j] = arr[i+2][j];
            } else {
                arr[i][j] = arr[i+1][j];
            }
            while (arr[i][j] == arr[m][n] || arr[m][n] == 'a') {
                bottom++;
                m++;
            }
        }
        
        //calculate vertical
        if (arr[i+1][j] == arr[i-1][j] || arr[i+1][j] == 'a' || arr[i-1][j] == 'a') {
            vertical = top + bottom + 1;
        } else {
            
            if (top < 2) {top = 0};
            if (bottom < 2) {bottom = 0};
            if (top == 0 || bottom == 0) {
                vertical = Math.max(top, bottom) + 1;
            }
            if (top == 2 && bottom == 2) {
                vertical = 3;
                top = 0;
            } 
            if (top >= 2 && bottom >= 2 && top != bottom) {
                vertical = top + bottom + 1;
            }
        }
        arr[i][j] = 'a';
        
    } else { //This is the case where position [i,j] is not lucky jewel
        //check horizontal
        
            //check right
        m = i; n = j + 1;
        while (arr[i][j] == arr[m][n] || arr[m][n] == 'a') {
            right++;
            n++;
        }
        
            //check left
        m = i; n = j - 1;
        while (arr[i][j] == arr[m][n] || arr[m][n] == 'a') {
            left++;
            n--;
        }
        horizontal = right + left + 1;

        //check vertical
        
            //check top
        m = i - 1; n = j;
        while (arr[i][j] == arr[m][n] || arr[m][n] == 'a') {
            top++;
            m--;
        }

            //check bottom
        m = i + 1; n = j;
        while (arr[i][j] == arr[m][n] || arr[m][n] == 'a') {
            bottom++;
            m++;
        }
        vertical = top + bottom + 1;

        if (horizontal < 3) {
            right = 0;
            left = 0;
        }

        if (vertical < 3) {
            top = 0;
            bottom = 0;
        }
    }

    let res = {
        horizontal: horizontal,
        vertical: vertical,
        top: top,
        right: right,
        bottom: bottom,
        left: left,
        combo: Math.max(horizontal, vertical)
    }
    return res;
}


function setRemovedValue() { //set removed value in a specific area
    //set a clone of arr named removed value array, store all the positions need to be removed
    var removedValueArr = [];
    
    for (let i = 0; i <= 9; i++) {
        removedValueArr[i] = [];
        for (let j = 0; j <= 9; j++) {
            removedValueArr[i][j] = arr[i][j];
        }
    }

    //check if selected positions are treasure, set removed value in order to erase later
    if ((arr[firstPos[0]][firstPos[1]] == 0 || arr[secondPos[0]][secondPos[1]] == 0) && fireTreasure && !fireFreeSwap) {
        if (allowSound) { playTreasureUsed.play() };
        
        //check if both selected positions are treasures
        if ((arr[firstPos[0]][firstPos[1]] == 0 && arr[secondPos[0]][secondPos[1]] == 0) ||
            (arr[firstPos[0]][firstPos[1]] == 0 && arr[secondPos[0]][secondPos[1]] == 'a') ||
            (arr[firstPos[0]][firstPos[1]] == 'a' && arr[secondPos[0]][secondPos[1]] == 0)
           ) {
            for (let i = 1; i <= 8; i++) {
                for (let j = 1; j <= 8; j++) {
                    removedValueArr[i][j] = 'removed';
                }
            }

        } else
        
        //check if the first position is treasure
        if (arr[firstPos[0]][firstPos[1]] == 0) {
            for (let i = 1; i <= 8; i++) {
                for (let j = 1; j <= 8; j++) {
                    if (arr[i][j] == arr[secondPos[0]][secondPos[1]]) {
                        removedValueArr[i][j] = 'removed';
                    }
                }
            }
            removedValueArr[firstPos[0]][firstPos[1]] = 'removed';
        } else
        
        //check if the second position is treasure
        if (arr[secondPos[0]][secondPos[1]] == 0) {
            for (let i = 1; i <= 8; i++) {
                for (let j = 1; j <= 8; j++) {
                    if (arr[i][j] == arr[firstPos[0]][firstPos[1]]) {
                        removedValueArr[i][j] = 'removed';
                    }
                }
            }
            removedValueArr[secondPos[0]][secondPos[1]] = 'removed';
        }
        
        check = true;
        
    } else {
    
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 8; j++) {

                //set treasure value or removed value for normal combo
                if (removedValueArr[i][j] != 'removed' && removedValueArr[i][j] != 0) {
                    let checkComboRes = checkCombo(i,j)
                    let left = checkComboRes.left;
                    let right = checkComboRes.right;
                    let top = checkComboRes.top;
                    let bottom = checkComboRes.bottom;
                    let combo = checkComboRes.combo;
                    let horizontal = checkComboRes.horizontal;
                    let vertical = checkComboRes.vertical;

                    if (combo >= 3) {

                        if (combo >= 5) {
                            if (allowSound) { playTreasureCreated.play() };
                            
                            if (horizontal >= 5) {
                                let mid = Math.floor(horizontal/2);
                                for (let c = j - left; c <= j + right; c++) {
                                    removedValueArr[i][c] = 'removed';
                                }
                                removedValueArr[i][j - left + mid] = 0;
                            }

                            if (vertical >= 5) {
                                let mid = Math.floor(vertical/2);
                                for (let r = i - top; r <= i + bottom; r++) {
                                    removedValueArr[r][j] = 'removed';
                                }
                                removedValueArr[i - top + mid][j] = 0;
                            }
                            fireTreasure = false;

                        } else {
                            if (horizontal >= 3) {
                                for (let y = j - left; y <= j + right; y++) {
                                    removedValueArr[i][y] = 'removed';
                                }
                            }

                            if (vertical >= 3) {
                                for (let x = i - top; x <= i + bottom; x++) {
                                    removedValueArr[x][j] = 'removed';
                                }
                            }
                        }

                        check = true;
                    }  
                }
            }
        }
       
    }
    
    let oldScore = score;
    //remove properties of bombs
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            if ((arr[i][j] == 8 && removedValueArr[i][j] == 'removed') || removedValueArr[i][j] == 0) {
                document.getElementById(i+'-'+j+'-bomb').classList.remove('bombs-count-down');
                document.getElementById(i+'-'+j+'-bomb').textContent = null;
            }
            //count score
            if (removedValueArr[i][j] == 'removed') {
                if (arr[i][j] == 0) {
                    score += 50;
                } else if (arr[i][j] == 'a') {
                    score += 30;
                } else score += 10;
            }
        }
    }
    
    if (!newGame) {
        if (score - oldScore <= 60) {
            for (let m = oldScore; m <= score; m++) {
                setTimeout(() => {
                    playerScore.textContent = m;
                    playerScore.style.animation = 'scoreScaling 0.5s ease-in-out';
                }, 15*(m - oldScore))
            }
        } else {
            for (let m = oldScore; m <= score; m++) {
                setTimeout(() => {
                    playerScore.textContent = m;
                    playerScore.style.animation = 'scoreScaling 0.5s ease-in-out';
                }, 7*(m - oldScore))
            }
        }
    }
    
    playerScore.style.animation = '' 
    //set removed value back to original array
    for (let i = 0; i <= 9; i++) {
        for (let j = 0; j <= 9; j++) {
            arr[i][j] = removedValueArr[i][j];
            if (removedValueArr[i][j] == 'removed') {
                //add fading animation
                document.getElementById(i+'-'+j).classList.add('removed-cell-fading');
                setTimeout(() => {
                    document.getElementById(i+'-'+j).classList.remove('removed-cell-fading');
                }, 200)
                
                for (let m = 1; m <= i; m++) {
                    setTimeout(() => {document.getElementById(m+'-'+j).classList.add('falling-down');}, 200)
                    setTimeout(() => {
                        document.getElementById(m+'-'+j).classList.remove('falling-down');
                    }, 400)
                }
                    
            }
        }
    }
    
}

function removeAndFill() { //function remove a column of combos and fill random
    for (let column = 1; column <= 8; column++) {    
        let col = [];
        for (let i = 0; i <= 7; i++) {
            col[i] = arr[i+1][column]
        }

        let totalRemove = col.filter(a => a == 'removed').length;
        let removedCol = col.filter(a => a != 'removed');
        let newCol = [];
        for (let i = 1; i <= totalRemove; i++) {
            if (randomLuckyJewel() == 1) {
                newCol[i-1] = 'a';
            } else newCol[i-1] = random();
        }

        //set back arr-column values
        let doneCol = newCol.concat(removedCol);
        for (let i = 1; i <= 8; i++) {
            let img = document.getElementById(i+'-'+column).src;
            document.getElementById(i+'-'+column).src = img.slice(0,img.length - 5) + doneCol[i-1] + '.png';
            arr[i][column] = doneCol[i-1];
        }

        //add properties for bombs
        for (let i = 1; i <= totalRemove; i++) {
            if (arr[i][column] == 8) {
                document.getElementById(i+'-'+column+'-bomb').classList.add('bombs-count-down');
                document.getElementById(i+'-'+column+'-bomb').textContent = 50;
            }
        }

        //move bombs properties
        let bombsCol = [];
        for (let i = 1; i <= 8; i++) {
            if (col[i-1] == 8) {
                bombsCol.push([i, parseInt(document.getElementById(i+'-'+column+'-bomb').textContent)]);
            }
        }

        if (totalRemove > 0) {
            for (let i = totalRemove + 1; i <= 8; i++) {
                if (arr[i][column] == 8) {
                    document.getElementById(i+'-'+column+'-bomb').textContent = bombsCol[0][1];
                    document.getElementById(i+'-'+column+'-bomb').classList.add('bombs-count-down');
                    bombsCol.shift();
                }
            }
            for (let i = 1; i <= 8; i++) {
                if (arr[i][column] != 8) {
                    document.getElementById(i+'-'+column+'-bomb').textContent = null;
                    document.getElementById(i+'-'+column+'-bomb').classList.remove('bombs-count-down');
                }
            }
        }
    }
    
}

function autoCheckMainJob() {
    
}
    
function autoCheck() { //function auto check combos, remove and fill random
    
    do {
        if (allowSound && !muteComboNewGame) {
            if (countConsecutive == 1) {
                playCombo1.play();
            }
            if (countConsecutive == 2) {
                playCombo2.play();
            }
            if (countConsecutive >= 3) {
                playCombo3.play();
            }
        }
        countConsecutive++;

        check = false;
        //find and set removed value
        setRemovedValue();

        //remove and fill
        removeAndFill();

        fireTreasure = false;

    } while (check == true)
}



//check if there's any combos at 2 selected position, remove and fill random
function checkTwoPosition(pos1, pos2) { 
    
    if (checkCombo(pos1[0], pos1[1]).combo >= 3 || checkCombo(pos2[0], pos2[1]).combo >= 3 || arr[pos1[0]][pos1[1]] == 0 || arr[pos2[0]][pos2[1]] == 0) {
        
//        fromCol = Math.min(pos1[1] - checkCombo(pos1[0], pos1[1]).left, 
//        pos2[1] - checkCombo(pos2[0], pos2[1]).left)
//    
//        toCol = Math.max(pos1[1] + checkCombo(pos1[0], pos1[1]).right,
//        pos2[1] + checkCombo(pos2[0], pos2[1]).right)
//    
//        toRow = Math.max(pos1[0] + checkCombo(pos1[0], pos1[1]).bottom, 
//        pos2[0] + checkCombo(pos2[0], pos2[1]).bottom)
//        
//        if (checkCombo(pos1[0], pos1[1]).combo < 3) {
//            fromCol = pos2[1] - checkCombo(pos2[0], pos2[1]).left;
//            toCol = pos2[1] + checkCombo(pos2[0], pos2[1]).right;
//            toRow = pos2[0] + checkCombo(pos2[0], pos2[1]).bottom;
//        }
//        
//        if (checkCombo(pos2[0], pos2[1]).combo < 3) {
//            fromCol = pos1[1] - checkCombo(pos1[0], pos1[1]).left;
//            toCol = pos1[1] + checkCombo(pos1[0], pos1[1]).right;
//            toRow = pos1[0] + checkCombo(pos1[0], pos1[1]).bottom;
//        }
//        setRemovedValue();
//        console.log(arr)
        //auto check after every move
        setTimeout(autoCheck, 200);

    } else {
        //no available combo
        //add some animation of swapping icons back and forth
        
        //swap back elements
        setTimeout(swap, 200);
        if (allowSound) { playInvalidMoveNoComboMove.play() };
    }
}

    
//function find hints at 2 positions
function findHints(a, b, x, y) {
    let res = [];

    //check if selected positions are treasure, set hints value
    if (arr[a][b] == 0 || arr[x][y] == 0) {
        
        if (arr[a][b] == 0) {
            res.push([a, b]);
        }
        
        if (arr[x][y] == 0) {
            res.push([x, y]);
        }
        
    } else {
        //swap values
        [arr[a][b], arr[x][y]] = [arr[x][y], arr[a][b]];
        
        let pos1 = checkCombo(a, b);
        let pos2 = checkCombo(x, y);
        //check at position [m,n]
        if (pos1.combo >= 3) {
            if (pos1.horizontal >= 3) {
                let row = [];
                for (let j = b - pos1.left; j <= b + pos1.right; j++) {
                    if (j == b) {
                        row.push([x, y]);
                    } else row.push([a, j]);
                }
                res.push(row);
            }
            
            if (pos1.vertical >= 3) {
                let col = [];
                for (let i = a - pos1.top; i <= a + pos1.bottom; i++) {
                    if (i == a) {
                        col.push([x, y]);
                    } else col.push([i, b]);
                }
                res.push(col);
            }
        }
        //check at position [x,y]
        if (pos2.combo >= 3) {
            if (pos2.horizontal >= 3) {
                let row = [];
                for (let j = y - pos2.left; j <= y + pos2.right; j++) {
                    if (j == y) {
                        row.push([a, b])
                    } else row.push([x, j]);
                }
                res.push(row);
            }
            
            if (pos2.vertical >= 3) {
                let col = [];
                for (let i = x - pos2.top; i <= x + pos2.bottom; i++) {
                    if (i == x) {
                        col.push([a, b])
                    } else col.push([i, y]);
                }
                res.push(col);
            }
        }

        //swap back values to original
        [arr[a][b], arr[x][y]] = [arr[x][y], arr[a][b]];
    }
    
    return res;
}

//loop through the whole array to find all the possibilites
function findAllHints() {
    let allHints = []; // store all hints value
    
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            if (i != 8 && j != 8) {
                allHints = allHints.concat(findHints(i, j, i, j+1));
                allHints = allHints.concat(findHints(i, j, i+1, j));
            } else
                if (i == 8 && j != 8) {
                    allHints = allHints.concat(findHints(i, j, i, j+1));
                } else
                    if (i != 8 && j == 8) {
                        allHints = allHints.concat(findHints(i, j, i+1, j));
                    }
        }
    }

    return allHints;
}
    
//give hints, add or remove hints class
function giveHintsButtonHandler() {
    //add click sound
    if (allowSound) { playClick.play() };
    
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            if (document.getElementById(i+'-'+j).classList.contains('hints')) {
                document.getElementById(i+'-'+j).classList.remove('hints');
            }
        }
    }
    
    let allHintsArr = findAllHints();
    
    if (allHintsArr.length > 0) {
        let m = Math.floor(Math.random()*(allHintsArr.length));
        for (let i = 0; i < allHintsArr[m].length; i++) {
            document.getElementById(allHintsArr[m][i][0] + '-' + allHintsArr[m][i][1]).classList.add('hints');
        }
        if (allowSound) { 
            setTimeout(playHintsUsed.play(), 300);
        }
        
    }

    score -= 30;
    playerScore.textContent = score;
 
}

//bombs cooler function
function bombsCoolerItemHandler() {
    //add click sound
    if (allowSound) { playClick.play() };
    
    if (document.getElementById('bombs-cooler').textContent > 0) {
        //add sound effects
        if (allowSound) { setTimeout(playBombsCoolerUsed.play(), 200) };
        
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 8; j++) {

                if (arr[i][j] == 8) {
                    let bomb = parseInt(document.getElementById(i+'-'+j+'-bomb').textContent);
                    bomb += 10;
                    document.getElementById(i+'-'+j+'-bomb').textContent = bomb;

                }
            }
        }
        let countBomb = parseInt(document.getElementById('bombs-cooler').textContent);
        countBomb--;
        document.getElementById('bombs-cooler').textContent = countBomb;
    }
    //add grey background if this item is unavailable
    if (document.getElementById('bombs-cooler').textContent == 0) {
        document.querySelector('.bombs-cooler-item').classList.add('unavailable-item');
    }
    
    //check if game is over
    if (countLife <= 0) {
        endGame();
    } else if (findAllHints().length == 0 &&
    document.getElementById('bombs-cooler').textContent == 0 &&
    document.getElementById('treasure').textContent == 0 &&
    document.getElementById('shuffle').textContent == 0 &&
    document.getElementById('free-swap').textContent == 0 &&
    document.getElementById('dynamite-bombs').textContent == 0
    ) {
        resetGame();
        countLife--;
        document.getElementById('life').textContent = countLife;
    }
}

//treasure item function
function treasureItemHandler() {
    //add click sound
    if (allowSound) { playClick.play() };
    
    if (document.getElementById('treasure').textContent > 0) {
        //add sound effects
        if (allowSound) { setTimeout(playTreasureCreated.play(), 200) };
        
        let i = Math.floor(Math.random()*8)+1;
        let j = Math.floor(Math.random()*8)+1;
        
        //remove bomb properties
        if (arr[i][j] == 8) {
            document.getElementById(i+'-'+j+'-bomb').textContent = null;
            document.getElementById(i+'-'+j+'-bomb').classList.remove('bombs-count-down');
        }
        
        createTreasure(i, j);
        
        let countTreasure = parseInt(document.getElementById('treasure').textContent);
        countTreasure--;
        document.getElementById('treasure').textContent = countTreasure;
    }
    //add grey background if this item is unavailable
    if (document.getElementById('treasure').textContent == 0) {
        document.querySelector('.treasure-item').classList.add('unavailable-item');
    }
    
    //check if game is over
    if (countLife <= 0) {
        endGame();
    } else if (findAllHints().length == 0 &&
    document.getElementById('bombs-cooler').textContent == 0 &&
    document.getElementById('treasure').textContent == 0 &&
    document.getElementById('shuffle').textContent == 0 &&
    document.getElementById('free-swap').textContent == 0 &&
    document.getElementById('dynamite-bombs').textContent == 0
    ) {
        resetGame();
        countLife--;
        document.getElementById('life').textContent = countLife;
    }
}


function shuffleItemHandler() {
    //add click sound
    if (allowSound) { playClick.play() };
    
    if (document.getElementById('shuffle').textContent > 0) {
        //add sound effects
        if (allowSound) { setTimeout(playShuffleUsed.play(), 200) };
        
        //remove all the bombs properties and store in bombsCollection
        let bombsCollection = [];
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 8; j++) {
                if (arr[i][j] == 8) {
                    bombsCollection.push(parseInt(document.getElementById(i+'-'+j+'-bomb').textContent));
                    document.getElementById(i+'-'+j+'-bomb').textContent = null;
                    document.getElementById(i+'-'+j+'-bomb').classList.remove('bombs-count-down');
                }
            }
        }
        
        //shuffle columns
        let shuffleCol = [];
        for (let i = 1; i <= 8; i++) {
            shuffleCol[i-1] = [];
            for (let j = 1; j <= 8; j++) {
                let replace = Math.floor(Math.random()*(9-j))+1;
                shuffleCol[i-1].push(arr[i][replace]);
                arr[i].splice(replace, 1);
            }
        }

        //shuffle rows
        let shuffleRow = [];
        for (let i = 1; i <= 8; i++) {
            shuffleRow[i-1] = [];
            let replace = Math.floor(Math.random()*(9-i))+1;
            for (let j = 1; j <= 8; j++) {
                shuffleRow[i-1].push(shuffleCol[replace-1][j-1]);
            }
            shuffleCol.splice(replace-1, 1);
        }
        
        //set value back to arr
        for (let i = 1; i <= 8; i++) {
            for (let j = 1;j <= 9; j++) {
                if (j == 9) {
                    arr[i][j] = -2;
                } else {
                    arr[i][j] = shuffleRow[i-1][j-1];
                    let cell = document.getElementById(i+'-'+j).src;
                    cell = cell.slice(0, cell.length - 5) + arr[i][j] + '.png';
                    document.getElementById(i+'-'+j).src = cell;
                }
            }
        }

        //add bombs properties
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 8; j++) {
                if (arr[i][j] == 8) {
                    document.getElementById(i+'-'+j+'-bomb').textContent = bombsCollection[0];
                    document.getElementById(i+'-'+j+'-bomb').classList.add('bombs-count-down');
                    bombsCollection.shift();
                }
            }
        }
        
        let countShuffle = parseInt(document.getElementById('shuffle').textContent);
        countShuffle--;
        document.getElementById('shuffle').textContent = countShuffle;
        
        autoCheck();
        
    }
    //add grey background if this item is unavailable
    if (document.getElementById('shuffle').textContent == 0) {
        document.querySelector('.shuffle-item').classList.add('unavailable-item');
    }
    
    //check if game is over
    if (countLife <= 0) {
        endGame();
    } else if (findAllHints().length == 0 &&
    document.getElementById('bombs-cooler').textContent == 0 &&
    document.getElementById('treasure').textContent == 0 &&
    document.getElementById('shuffle').textContent == 0 &&
    document.getElementById('free-swap').textContent == 0 &&
    document.getElementById('dynamite-bombs').textContent == 0
    ) {
        resetGame();
        countLife--;
        document.getElementById('life').textContent = countLife;
    }
}


function freeSwapItemHandler() {
    //add click sound
    if (allowSound) { playClick.play() };
    
    if (document.getElementById('free-swap').textContent > 0) {
        
        fireFreeSwap = true;
        
        //change cursor
        document.querySelector('.game-container').style.cursor = "url(../Images/mining-game-icons/icon-c-cursor.png) 22.5 22.5, auto";
    }
}


function dynamiteBombsItemHandler() {
    //add click sound
    if (allowSound) { playClick.play() };
    
    if (document.getElementById('dynamite-bombs').textContent > 0) {
        fireDynamiteBombs = true;
        
        //change cursor
        document.querySelector('.game-container').style.cursor = "url(../Images/mining-game-icons/icon-b-cursor.png) 22.5 22.5, auto";
    }
}


//receive first cell from player
function firstCell(e) {
    //get position of the first icon
    firstPos = e.target.id.split('-');
    firstPos[0] = parseInt(firstPos[0]);
    firstPos[1] = parseInt(firstPos[1]);

}

//receive second cell from player
function secondCell(e) {
    //get position of the second icon
    secondPos = e.target.id.split('-');
    secondPos[0] = parseInt(secondPos[0]);
    secondPos[1] = parseInt(secondPos[1]);
    fireTreasure = true;
    countConsecutive = 0;

    
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            if (document.getElementById(i+'-'+j).classList.contains('hints')) {
                document.getElementById(i+'-'+j).classList.remove('hints');
            }
        }
    }
    
    //This is the freeSwapItemHandler
    if (fireFreeSwap == true) {
        //add sound effects
        if (allowSound) { setTimeout(playFreeSwapUsed.play(), 120) };
        
        swap();
        autoCheck();

        //change cursor back to normal
        document.querySelector('.game-container').style.cursor = "pointer";
        
        let countFreeSwap = parseInt(document.getElementById('free-swap').textContent);
        countFreeSwap--;
        document.getElementById('free-swap').textContent = countFreeSwap;
        
        //add grey background if this item is unavailable
        if (document.getElementById('free-swap').textContent == 0) {
            document.querySelector('.free-swap-item').classList.add('unavailable-item');
        }
        
        fireFreeSwap = false;
        
    } else 
    
    //This is basically the dynamiteBombsItemHandler
    if (firstPos[0] == secondPos[0] && firstPos[1] == secondPos[1] && fireDynamiteBombs == true) {
        //add sound effects
        if (allowSound) { setTimeout(playDynamiteBombsUsed.play(), 50) };
        
        for (let i = firstPos[0] - 2; i <= firstPos[0] + 2; i++) {
            for (let j = firstPos[1] - 2; j <= firstPos[1] + 2; j++) {
                if (i >= 1 && i <= 8 && j >= 1 && j <= 8) {
                    arr[i][j] = 'removed'
                }
            }
        }
        autoCheck();
        autoCheck();//need to call autoCheck function again because I can't set 'check' to 'true'
        
        //change cursor back to normal
        document.querySelector('.game-container').style.cursor = "pointer";
        
        let countDynamiteBombs = parseInt(document.getElementById('dynamite-bombs').textContent);
        countDynamiteBombs--;
        document.getElementById('dynamite-bombs').textContent = countDynamiteBombs;
        
        //add grey background if this item is unavailable
        if (document.getElementById('dynamite-bombs').textContent == 0) {
            document.querySelector('.dynamite-bombs-item').classList.add('unavailable-item');
        }
        
        fireDynamiteBombs = false;
        
    } else
    
    //check if it's a valid move
    if (checkValidMove(firstPos, secondPos)) {
        countMoves++;
        moves.textContent = countMoves;
        //count down bombs moves after every swap
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 8; j++) {
                if (arr[i][j] == 8) {
                    let countdown = parseInt(document.getElementById(i+'-'+j+'-bomb').textContent);
                    countdown--;
                    document.getElementById(i+'-'+j+'-bomb').textContent = countdown;
                }
            }
        }
        
        //swap elements
        swap();
        //find combo and erase
        checkTwoPosition(firstPos, secondPos);
    
    } else {
        //alert invalid move!
        if (allowSound) { playInvalidMoveNoComboMove.play() };
    }
    

    //give a random item if consecutive >= 3
    setTimeout(() => {
        if (countConsecutive >= 4) {
            giveARandomItem();
            //alert('You won a random item')
            document.querySelector('.alert-won-item').style.display = 'block';
            setTimeout(() => {
                document.querySelector('.alert-won-item').style.display = 'none';
            }, 1500)
        }
    }, 300)
    
    //check if game is over
    setTimeout(() => {
        if (countLife <= 0) {
            endGame();
        } else if (findAllHints().length == 0 &&
        document.getElementById('bombs-cooler').textContent == 0 &&
        document.getElementById('treasure').textContent == 0 &&
        document.getElementById('shuffle').textContent == 0 &&
        document.getElementById('free-swap').textContent == 0 &&
        document.getElementById('dynamite-bombs').textContent == 0
        ) {
            resetGame();
            countLife--;
            document.getElementById('life').textContent = countLife;
            document.querySelector('.alert-won-item').style.display = 'block';
            document.querySelector('.alert-won-item').textContent = 'No More Move!';
            setTimeout(() => {
                document.querySelector('.alert-won-item').style.display = 'none';
                document.querySelector('.alert-won-item').textContent = 'You have just won an item!'
            }, 1500)
        }
    }, 700)
    
    //find out if there's any exploded bombs
    let i = 1;
    let gameOver = false;
    while (i <= 8 && !gameOver) {
        let j = 1;
        while (j <= 8 && !gameOver) {
            if (arr[i][j] == 8 && document.getElementById(i+'-'+j+'-bomb').textContent <= 0) {
                endGame();
                gameOver = true;
            }
            j++;
        }
        i++;
    }
    
}

// [1,6]: 4, [1,7]: a, [2,8]: a
//    [1,8]: 5. doi cho [2,8] cho [1,8] k an duoc, can fix loi


