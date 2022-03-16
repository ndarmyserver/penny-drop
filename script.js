var players = [];
var playerStacks = [];
var gameEnded = false;
var currentPlayer = 0;
var firstTurn = true;
turnRolls = 0;
turnStartingStack = 0;
turnEndingStack = 0;
var spots = [false, false, false, false, false];
var allRolls = [];
var rounds = 1;
var setupProgression = 0;
var numOfPlayers = 2;
var turnSummary = true;



const modalSetup = document.getElementById('modal-setup');
const modalWin = document.getElementById('modal-win');
const modalSettings = document.getElementById('modal-settings');
const modalTurnSummary = document.getElementById('modal-turn-summary');

// Open Game Setup modal on page load
modalSetup.classList.add("open");

function settingsButtonClicked() {
  modalSettings.classList.add("open");
}

document.getElementById('settings-button').addEventListener('click', () => settingsButtonClicked());


function playerMinusButtonClicked() {
  if (numOfPlayers > 2) {
    numOfPlayers -= 1;
    if (numOfPlayers == 2) {
      document.getElementById("minus-button").style.visibility = "hidden";
    }
    if (numOfPlayers == 4) {
      document.getElementById("plus-button").style.visibility = "visible";
    }
  } else {
    numOfPlayers = 2;
  }
  document.getElementById("num-of-players").innerText = numOfPlayers;
};

document.getElementById('minus-button').addEventListener('click', () => playerMinusButtonClicked());


function playerPlusButtonClick() {
  if (numOfPlayers < 5) {
    numOfPlayers += 1;
    if (numOfPlayers == 5) {
      document.getElementById("plus-button").style.visibility = "hidden";
    }
    document.getElementById("num-of-players").innerText = numOfPlayers;
    if (numOfPlayers > 2) {
      document.getElementById("minus-button").style.visibility = "visible";
    }
  }
};

document.getElementById('plus-button').addEventListener('click', () => playerPlusButtonClick());


function firstNextButtonClicked() {
  setupProgression = 1;
  document.getElementById('setupPrompt').style.display = "none";
  document.getElementById('firstNextButton').style.display = "none";
  document.getElementById('setupButtonWrapper').style.display = "grid";
  document.getElementById('playerNames').style.display = "block";
  document.getElementById('player0').style.display = "block";
  document.getElementById('player0').focus();
}

document.getElementById('firstNextButton').addEventListener('click', () => firstNextButtonClicked());

function backButtonClicked() {
  if (setupProgression == 1) {
    document.getElementById('playerNames').style.display = "none";
    document.getElementById('player0').style.display = "none";
    document.getElementById('setupButtonWrapper').style.display = "none";
    document.getElementById('setupError').style.visibility = "hidden";
    document.getElementById('setupPrompt').style.display = "block";
    document.getElementById('firstNextButton').style.display = "block";
  } else {
    document.getElementById('setupError').style.visibility = "hidden";
    document.getElementById('player' + (setupProgression - 1)).style.display = "none";
    document.getElementById('player' + (setupProgression - 2)).style.display = "block";
    document.getElementById('player' + (setupProgression - 2)).focus();
    if (setupProgression == numOfPlayers) {
      document.getElementById('playButton').style.display = "none";
      document.getElementById('nextButton').style.display = "block";
    }
  }
  setupProgression -= 1;
}

document.getElementById('backButton').addEventListener('click', () => backButtonClicked());

function nextButtonClicked() {
  if (document.getElementById('player' + (setupProgression - 1)).value == "") {
    document.getElementById('setupError').style.visibility = "visible";
    document.getElementById('player' + (setupProgression - 1)).focus();
    return false;
  } else {
    document.getElementById('setupError').style.visibility = "hidden";
    document.getElementById('player' + (setupProgression - 1)).style.display = "none";
    setupProgression += 1;
    document.getElementById('player' + (setupProgression - 1)).style.display = "block";
    document.getElementById('player' + (setupProgression - 1)).focus();
    if (setupProgression == numOfPlayers) {
      document.getElementById('nextButton').style.display = "none";
      document.getElementById('playButton').style.display = "block";
    }
  }
}

document.getElementById('nextButton').addEventListener('click', () => nextButtonClicked());

function setupGame() {
  if (document.getElementById('player' + (setupProgression - 1)).value == "") {
    document.getElementById('setupError').style.visibility = "visible";
    document.getElementById('player' + (setupProgression - 1)).focus();
    return false;
  } else {
    for (var l = 0; l < 5; l++) {
      players.push(document.getElementById('player' + l).value)
    }

    players = players.filter(element => {
      return element !== '';
    });
    console.log(players);

    players.forEach(element => {
      playerStacks.push(10);
    });
    console.log(playerStacks);
    var numColumns = ""
    switch (numOfPlayers) {
      case 2:
         numColumns = "1fr 1fr";
        break;
      case 3:
        numColumns = "1fr 1fr 1fr";
        break;
      case 4:
        numColumns = "1fr 1fr 1fr 1fr";
        break;
      case 5:
        numColumns = "1fr 1fr 1fr 1fr 1fr";
        break;
      default:
        console.log("something went wrong.");
    }
    document.getElementById('stackWrapper').style.gridTemplateColumns = numColumns;

    // Checks if media query for less than 601px wide is true
    if (window.matchMedia('(max-width: 600px)').matches) {
      var stackElements = document.getElementsByClassName('player-stack');
      var nameElements = document.getElementsByClassName('player-name');
      switch (numOfPlayers) {
        case 3:
          Array.from(nameElements).forEach(element => element.classList.add("small-name-font"));
          break;
        case 4:
          Array.from(nameElements).forEach(element => element.classList.add("tiny-name-font"));
          break;
        case 5:
          Array.from(stackElements).forEach(element => element.classList.add("small-stack-font"));
          Array.from(nameElements).forEach(element => element.classList.add("micro-name-font"));
          break;
        default:
          console.log("didn't need to adjust font");
      }
    }
    modalSetup.classList.remove("open");
    playGame();
  }
}

document.getElementById('playButton').addEventListener('click', () => setupGame());

function showTurnSummary(turnCurrentPlayer, turnNextPlayer, passOrRoll) {
  console.log(turnNextPlayer);
  if (turnSummary) {
    const turnResult = turnEndingStack - turnStartingStack;
    if (turnResult > 0) {
      var turnResultClass = "result-bad";
      var turnResultAdd = "+";
    } else {
       var turnResultClass = "result-good";
       var turnResultAdd = "";
    }
    document.getElementById("turnMessage").innerText = passOrRoll == "roll" ? `Pick’em Up!` : `Nice!`;
    document.getElementById("turnRolls").innerText = `Rolls: ${turnRolls}`;
    document.getElementById("turnStart").innerText = `Starting Pennies: ${turnStartingStack}`;
    document.getElementById("turnEnd").innerText = `Ending Pennies: ${turnEndingStack}`;
    document.getElementById("turnResult").innerHTML = `+/- Pennies: <span class="${turnResultClass}">${turnResultAdd}${turnResult}<span>`;
    document.getElementById("turnSummaryNext").innerText = `It’s ${turnNextPlayer}’s Turn`;
    modalTurnSummary.classList.add("open");
    setTimeout(function() {
      modalTurnSummary.classList.remove("open");
    }, 4000);
  }
}

function turnOver(passOrRoll) {
  var prevPlayer = currentPlayer;
  turnEndingStack = playerStacks[currentPlayer];
  if (currentPlayer == (players.length - 1)) {
    currentPlayer = 0;
    rounds++
  } else {
    currentPlayer++;
  }
  document.getElementById('passButton').style.visibility = "hidden";
  firstTurn = true
  setTimeout(function() {
    showTurnSummary(players[prevPlayer], players[currentPlayer], passOrRoll);
    document.getElementById(`player${prevPlayer}-name`).classList.toggle("active-player");
    document.getElementById(`player${currentPlayer}-name`).classList.toggle("active-player");
  }, (passOrRoll == "roll" ? 1000 : 100));
}

function rollDiceAnimation() {
  var randomNumber = (Math.floor(Math.random() * 6) + 1);
  document.getElementById('dice-img').src = "img/dice-" + randomNumber + ".png";
  document.getElementById('dice-img').alt = "Dice - " + randomNumber;
  return new Promise((resolve) => {
    setTimeout(function() {
      resolve();
    }, 20);
  });
}

function afterRolling() {
  var rollDice = (Math.floor(Math.random() * 6) + 1);
  allRolls.push(rollDice);
  document.getElementById('dice-img').src = "img/dice-" + rollDice + ".png";
  document.getElementById('dice-img').alt = "Dice - " + rollDice;

  console.log(firstTurn, turnRolls, turnStartingStack, turnEndingStack);
  if (firstTurn) {
    turnStartingStack = playerStacks[currentPlayer]
    turnRolls = 1;
  } else {
    turnRolls++;
  }
  console.log(firstTurn, turnRolls, turnStartingStack, turnEndingStack);


  if (rollDice >= 1 && rollDice <= 5) {
    if (spots[rollDice - 1]) {
      const numOfPennies = spots.filter(Boolean).length;
      playerStacks[currentPlayer] += numOfPennies;
      document.getElementById('player' + currentPlayer + '-stack').innerHTML = playerStacks[currentPlayer];
      for (let j = 0; j < 5; j++) {
        if (spots[j]) {
          document.getElementById("penny" + (j + 1)).classList.add('slide-up');
        }
      }
      setTimeout(function() {
        for (let j = 0; j < 5; j++) {
          document.getElementById("penny" + (j + 1)).style.visibility = "hidden"
          if (spots[j]) {
            document.getElementById("penny" + (j + 1)).classList.remove('slide-up');
          }
          spots[j] = false;
        }
      }, 1000);

      // Turn is over
      turnOver("roll");


    } else {
      var x = document.getElementById("penny" + rollDice);
      if (x.style.visibility === "hidden") {
        x.style.visibility = "visible";
      } else {
        x.style.visibility = "hidden";
      }

      spots[rollDice - 1] = true;

      playerStacks[currentPlayer]--;
      document.getElementById('player' + currentPlayer + '-stack').innerHTML = playerStacks[currentPlayer];
      if (playerStacks[currentPlayer] == 0) {
        setTimeout(function() {
          displayWinner(players[currentPlayer]);
        }, 1000);
      }
      if (firstTurn) {
        firstTurn = false;
        document.getElementById('passButton').style.visibility = "visible";
      }
    }
  } else { // 6 was rolled
    document.getElementById("penny" + rollDice).style.visibility = "visible";
    setTimeout(function() {
      document.getElementById("penny" + rollDice).classList.add('slide-out');
    }, 500);
    setTimeout(function() {
      document.getElementById("penny" + rollDice).style.visibility = "hidden";
      document.getElementById("penny" + rollDice).classList.remove('slide-out');
    }, 1000);

    playerStacks[currentPlayer]--;
    document.getElementById('player' + currentPlayer + '-stack').innerHTML = playerStacks[currentPlayer];
    if (playerStacks[currentPlayer] == 0) {
      setTimeout(function() {
        displayWinner(players[currentPlayer]);
      }, 1000);

    }
    if (firstTurn) {
      firstTurn = false;
      document.getElementById('passButton').style.visibility = "visible";
    }
  }
}

async function rollButtonPressed() {
  document.getElementById('rollButton').style.pointerEvents = 'none';
  document.getElementById('passButton').style.pointerEvents = 'none';
  document.getElementById('rollButton').style.background = 'rgba(217,141,98,0.5)';
  document.getElementById('passButton').style.background = 'rgba(144,166,138,0.5)';

  console.log("wait to roll again")
  for (var k = 0; k < 25; k++) {
    await rollDiceAnimation();
  }
  afterRolling();
  setTimeout(function() {
    document.getElementById('rollButton').style.pointerEvents = 'auto';
    document.getElementById('passButton').style.pointerEvents = 'auto';
    document.getElementById('rollButton').style.background = '#D98D62';
    document.getElementById('passButton').style.background = '#90a68a';
    console.log("ready to roll again")
  }, 500);
}

function passButtonPressed() {
  turnOver("pass");
}

function playGame() {
  for (const [i, name] of players.entries()) {
    console.log(name);
    document.getElementById('player' + i + '-stack-spot').style.display = "block";
    document.getElementById('player' + i + '-name').innerHTML = name;
    document.getElementById('player' + i + '-stack').innerHTML = playerStacks[i];

  }

  document.getElementById('player' + currentPlayer + '-name').classList.toggle("active-player");
  document.getElementById('passButton').style.visibility = "hidden";
}

function restartCurrentGame() {
  document.getElementById('player' + currentPlayer + '-name').classList.toggle("active-player");
  playerStacks = [];
  gameEnded = false;
  currentPlayer = 0;
  firstTurn = true;
  spots = [];
  spots = [false, false, false, false, false];
  allRolls = [];
  rounds = 1;
  document.getElementById('dice-img').src = "img/dice-0.png";
  document.getElementById('rollButton').style.visibility = "visible";
  document.getElementById('rollButton').style.display = "block";
  document.getElementById('passButton').style.visibility = "hidden";
  document.getElementById('passButton').style.display = "block";
  document.getElementById('showWinButton').style.display = "none";
  // Hide all penny images
  var imgElements = document.getElementsByClassName('penny');
  Array.from(imgElements).forEach(element => element.style.visibility = "hidden");
  players.forEach(element => {
    playerStacks.push(10);
  });
  playGame();
}

document.getElementById('rollButton').addEventListener('click', () => rollButtonPressed());

document.getElementById('passButton').addEventListener('click', () => passButtonPressed());


document.getElementById('settingsResumeButton').addEventListener('click', () => modalSettings.classList.remove("open"));

document.getElementById('settingsRematchButton').addEventListener('click', () => {
  restartCurrentGame();
  modalSettings.classList.remove("open");
});

document.getElementById('settingsNewGameButton').addEventListener('click', () => location.reload());

function turnSummaryCheckboxClicked() {
  if (turnSummary) {
    turnSummary = false;
    document.getElementById('turnSummaryCheckbox').innerHTML = "";
  } else {
    turnSummary = true;
    document.getElementById('turnSummaryCheckbox').innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
  }
}

document.getElementById('turnSummaryCheckbox').addEventListener('click', () => turnSummaryCheckboxClicked());

document.getElementById('rematchButton').addEventListener('click', () => {
  restartCurrentGame();
  modalWin.classList.remove("open");
});

document.getElementById('win-close-button').addEventListener('click', () => modalWin.classList.remove("open"));

// document.getElementById('turn-close-button').addEventListener('click', () => modalTurnSummary.classList.remove("open"));

document.getElementById('newGameButton').addEventListener('click', () => location.reload());

document.getElementById('showWinButton').addEventListener('click', () => modalWin.classList.add("open"));

// Display winner modal
function displayWinner(winner) {
  document.getElementById('rollButton').style.display = "none";
  document.getElementById('passButton').style.display = "none";
  document.getElementById('showWinButton').style.display = "block";
  document.getElementById("winner").innerText = winner;
  console.log("all rolls: " + allRolls);
  document.getElementById("winRounds").innerText = `Rounds: ${rounds}`
  for (x = 1; x < 7; x++) {
    console.log(allRolls.length);
    console.log(allRolls.filter((v) => (v === x)).length);
    console.log((allRolls.filter((v) => (v === x)).length) / allRolls.length);
    document.getElementById("win" + x).innerText = `${Math.round((allRolls.filter((v) => (v === x)).length / allRolls.length) * 100)}%`
  }
  modalWin.classList.add("open");
}