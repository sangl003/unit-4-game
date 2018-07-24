var characters, gameState
var messageA = $("<p>");
var messageD = $("<p>");
   
      // jQuery alternative to: var newDiv = document.createElement("div");
    // jQuery alternative to: newDiv.textContent = "A pleasure to meet you!";
function startGame () {

   characters = resetCharacters()
   gameState = resetGameState() 
 
  ChooseCharacter()
}

function resetCharacters () {
  return {
    'obiWanKenobi': {
      name: 'Obi-Wan Kenobi',
      health: 120,
      attack: 8,
      imageUrl: 'assets/images/OBi.jpg',
      enemyAttackBack: 15
    },
    'lukeSkywalker': {
      name: 'Luke Skywalker',
      health: 100,
      attack: 14,
      imageUrl: 'assets/images/luke.jpg',
      enemyAttackBack: 5
    },
    'darthSidious': {
      name: 'Darth Sidious',
      health: 150,
      attack: 8,
      imageUrl: 'assets/images/darth.jpg',
      enemyAttackBack: 20
    },
    'darthMaul': {
      name: 'Darth Maul',
      health: 180,
      attack: 7,
      imageUrl: 'assets/images/maul.jpg',
      enemyAttackBack: 25
    }
  }
}

function resetGameState () {
  return {
    selectedCharacter: null,
    selectedDefender: null,
    enemiesLeft: 0,
    numOfAttacks: 0
  }
}


function cCharDiv (character, key) {
  var charDiv = $("<div class='character' data-name='" + key + "'>")
  var charName = $("<div class='character-name'>").text(character.name)
  var charImage = $("<img alt='image' class='character-image'>").attr('src', character.imageUrl)
  var charHealth = $("<div class='character-health'>").text(character.health)
  charDiv.append(charName).append(charImage).append(charHealth)
  return charDiv
}

function ChooseCharacter () {
  console.log('Choosing characters')
  var keys = Object.keys(characters)
  for (var i = 0; i < keys.length; i++) {
    var characterKey = keys[i]
    var character = characters[characterKey]
    var charDiv = cCharDiv(character, characterKey)
    $('#character-area').append(charDiv)
  }
}

function ListOpponent (selectedCharacterKey) {
  var characterKeys = Object.keys(characters)
  for (var i = 0; i < characterKeys.length; i++) {
    if (characterKeys[i] !== selectedCharacterKey) {
      var enemyKey = characterKeys[i]
      var enemy = characters[enemyKey]

      var enemyDiv = cCharDiv(enemy, enemyKey)
      $(enemyDiv).addClass('enemy')
      $('#available-to-attack-section').append(enemyDiv)
    }
  }
}


function enableEnemySelection () {
  $('.enemy').on('click.enemySelect', function () {
    console.log('opponent selected')
    var opponentKey = $(this).attr('data-name')
    console.log('opponent selected '+opponentKey);
    gameState.selectedDefender = characters[opponentKey]
    $('#defender').append(this)
    $('#attack-button').show()
    $('.enemy').off('click.enemySelect')
  })
}

function attack (numOfAttacks) {

  gameState.selectedDefender.health -= gameState.selectedCharacter.attack * numOfAttacks  
  messageA.text(gameState.selectedCharacter.name + " Attacked by " + gameState.selectedCharacter.attack * numOfAttacks  +" damages");
$("#game-message").append(messageA);
}

function defend () {
  gameState.selectedCharacter.health -= gameState.selectedDefender.enemyAttackBack 
  messageD.text(gameState.selectedDefender.name + " defended by " + gameState.selectedDefender.enemyAttackBack  +" damages");
$("#game-message").append(messageD);
}

function isCharacterDead (character) {
  console.log('checking if player is dead')
  return character.health <= 0

}
function isGameWon () {
  console.log('checking if you won the game')
  return gameState.enemiesLeft === 0
}

function isAttackPhaseComplete () {

  if (isCharacterDead(gameState.selectedCharacter)) {
  
    messageA.text('You were defeated by ' + gameState.selectedDefender.name + '. Click reset to play again.');
    $("#game-message").append(messageA);
   
    $('#selected-character').empty()
    $("#game-message").empty();
    $('#reset-button').show()

    return true 
  } else if (isCharacterDead(gameState.selectedDefender)) {
   
    console.log('defender dead')
    messageA.text("defender dead");
    $("#game-message").append(messageA);

  
    gameState.enemiesLeft--
    $('#defender').empty()

  
    if (isGameWon()) {
        $("#game-message").empty();
        messageA.text('You win! Click Reset to play again');
        $("#game-message").append(messageA);
      $('#reset-button').show()
    } else {
       
        $("#game-message").empty();
        messageA.text('You defeated ' + gameState.selectedDefender.name + '! Select another enemy to fight.');
        $("#game-message").append(messageA);
      enableEnemySelection()
    }
    return true 
  }
  
  return false
}


function emptyDivs () {

  $('#selected-character').empty()
  $('#defender').empty()
  $('#available-to-attack-section .enemy').empty()
  $('#character-area').empty()
  $('#characters-section').show()
}

$(document).ready(function () {
 
  $('#character-area').on('click', '.character', function () {
   
    var selectedKey = $(this).attr('data-name')
    gameState.selectedCharacter = characters[selectedKey]
    console.log('player selected')
  
    $('#selected-character').append(this)

    ListOpponent(selectedKey)


    $('#characters-section').hide()

   
    gameState.enemiesLeft = Object.keys(characters).length - 1
    enableEnemySelection()
  })

  $('#attack-button').on('click.attack', function () {
    console.log('attack clicked')
   
    gameState.numOfAttacks++

    attack(gameState.numOfAttacks)
    defend()

 
    $('#selected-character .character-health').text(gameState.selectedCharacter.health)
    $('#defender .character-health').text(gameState.selectedDefender.health)

 
    if (isAttackPhaseComplete()) {
      $(this).hide()
    }
  })

  $('#reset-button').on('click.reset', function () {
    $("#game-message").empty();
    
    messageA.text('Resetting game......................');
    $("#game-message").append(messageA);
    
    emptyDivs()

  
    $(this).hide()

  
    startGame()
  })


  startGame()
})
