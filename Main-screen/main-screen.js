var saveButton = document.querySelector('.save-btn');
var mouseHover = document.querySelector('.nhapten');

var playClick = document.querySelector('.play-click');
var playMouseHover = document.querySelector('.play-mouse-hover');

document.querySelector('#menu').style.cursor = "url(../Images/mining-game-icons/regular-cursor.png), auto"
saveButton.addEventListener('click', saveButtonHandler)
saveButton.addEventListener('mouseover', mouseHoverHandler)
mouseHover.addEventListener('mouseover', mouseHoverHandler)

var playerName;


function saveButtonHandler() {
    playClick.play();
    
    playerName = document.querySelector('.nhapten').value;
    
    if (playerName != '') {
        document.querySelector('.player-name').textContent = 'Hi, ' + playerName;
        document.querySelector('.name-info').style.display = 'none';
        document.querySelector('.player-name').style.display = 'block';
        setTimeout(() => {document.querySelector('.select-game-mode').style.display = 'block'}, 500)
        setTimeout(() => {document.querySelector('#kieu-choi').style.display = 'flex'}, 1700);
        
        var highScoreList = JSON.parse(localStorage.getItem('highScore')) || [];
        var player = [playerName, 0];
        
        //check if the player is already exist
        
        
        
        highScoreList.push(player);
        localStorage.setItem('highScore', JSON.stringify(highScoreList)); 
    }
}

function mouseHoverHandler() {
    playMouseHover.play();
}