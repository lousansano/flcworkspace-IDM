// FLC WORKSPACE: The Annoying Work Game
// by Louis Sansano
// Music and SFX by Tate Gregor and Louis Sansano
// Interaction Design Studio, IDM Spring 2024


//GAMEPAD INFO DS4

// SQUARE - BUTTON 2
// CROSS - BUTTON 0
// TRIANGLE - BUTTON 3
// CIRCLE - BUTTON 1
// L1 - BUTTON 4
// R1 - BUTTON 5
// L2 - BUTTON 6
// R2 - BUTTON 7

// DPAD DOWN - 13
// DPAD UP - 12
// DPAD RIGHT - 15
// DPAD LEFT - 14

//flaticon stuff
//<a href="https://www.flaticon.com/free-icons/keystroke" title="keystroke icons">Keystroke icons created by Uniconlabs - Flaticon</a>
//<a href="https://www.flaticon.com/free-icons/keyboard-button" title="keyboard button icons">Keyboard button icons created by UIUX Mall - Flaticon</a>

//code inspo from
//https://www.geeksforgeeks.org/p5-js-millis-function/
//https://editor.p5js.org/jesse_harding/sketches/iKW2_d-bG
//https://editor.p5js.org/billythemusical/sketches/hQyU3W7px
//https://editor.p5js.org/simontiger/sketches/SJOev0Pnx
//https://editor.p5js.org/anvakondak/sketches/RsQBVYOqA
//https://codesandbox.io/p/sandbox/calculator-p5js-6r4s4?
// (lost some bookmarks to other things, but these are the big ones)


class aMathEQ{
  constructor(equation, answer){
    this.equation = equation
    this.answer = answer
  }
}

class controllerPair{
  constructor(controllerIcon, controllerButton){
    this.controllerIcon = controllerIcon // the name of the button + .png
    this.controllerButton = controllerButton //the photo
  }
}

//ALL SCORING STUFF

KBStageScoring = 0

clickCounter = 0
KBMStageScoring = 0

gamepadroundScore = 0

playerMathScore = 0
playerKeyboardScore = 0

finalRoundKBScore = 0
finalRoundClickCounter = 0
finalRoundMathScore = 0
finalRoundGamepadScore = 0

finalgamescore = 0

// ALL GLOBAL STUFF

let themeSong
musicIsLoaded = false

playerName = ''
gameState = 'firstScreen'

wordPrimaryList = []
word3List = []
playerWord = ''
KBStageTimer = 30

correctSFXBank = []
wrongSFXBank = []

var timerStart
timerDuration = 45000
gamepadRoundDuration = 40000
mathDuration = 90000
finalStageDuration = 80000

buttonX = 1000
buttonY = 1000
buttonMoveTimer = 60

let gamepad
allControllerIcons = ['circle.png','cross.png','down.png','l1.png','l2.png','left.png','r1.png','r2.png','right.png','square.png','triangle.png','up.png']
controllerButtonPairs = []
controllerRound5 = []
nextButtonIndex = 0
userPressedButtons = []

buttonPressedState = {}
debounceTimeout = 300
lastButtonPress = 0

mathPrimaryList = []
mathFirst3List = []
mathCurrent = {equation: '', answer: 0}
playerNumber = ''

finalWorkWord = ''


function preload(){
loadStrings('/texts/kbwords.txt', allwordLoad)
loadStrings('/texts/mathstuff.txt', mathLoad)
workWords = loadStrings('/texts/workwords.txt')

largeLogo = loadImage('/art/logos/large_logo_1_white.png')
smallLogo = loadImage ('/art/logos/small_logo_1_white.png')
keyboardimage = loadImage('/art/music_keyboard.png')
firstScreenImage = loadImage('/art/firstscreen.png')

soundFormats('mp3')

correctfx1 = loadSound('/sfx/correct_1.mp3')
correctfx2 = loadSound('/sfx/correct_2.mp3')
correctSFXBank = [correctfx1, correctfx2]

wrongfx1 = loadSound('/sfx/wrong_1.mp3')
wrongfx1a = loadSound('/sfx/wrong_1_fart.mp3')
wrongfx2 = loadSound('/sfx/wrong_2.mp3')
wrongfx2long = loadSound('/sfx/wrong_2_echo.mp3')
wrongSFXBank = [wrongfx1, wrongfx1a, wrongfx2, wrongfx2long]


themeSong = loadSound('/music/windows69_theme.mp3')
gameplayFullSong = loadSound('/music/gameplay_full.mp3')
gameplaypt1 = loadSound('/music/gameplay_p1.mp3')
gameplaypt2 = loadSound('/music/gameplay_p2.mp3')
gameplaypt3 = loadSound('/music/gameplay_p3.mp3')
gamepadSong = loadSound('/music/house_forgamepad.mp3')

font1 = loadFont('/fonts/IBMPlexMono_Regular.otf')

loadControllerIcons()
}

function playCorrectSFX(){
  randomSFXPick = Math.floor(Math.random() * correctSFXBank.length);
  randomSFX = correctSFXBank[randomSFXPick]
  randomSFX.setVolume(0.1)
  randomSFX.play()
}

function playWrongSFX(){
  randomSFXPick = Math.floor(Math.random() * wrongSFXBank.length);
  randomSFX = wrongSFXBank[randomSFXPick]
  randomSFX.setVolume(0.1)
  randomSFX.play()
}

function controller5Load(){
  for (i = 0; i < 5; i++){
    randomIndex = floor(random(controllerButtonPairs.length))
    randomControllerInput = controllerButtonPairs[randomIndex]
    randomControllerInput.name = randomControllerInput.controllerIcon.replace('.png', '')
    controllerRound5.push(randomControllerInput)
}
}

function loadControllerIcons(){
  path = '/art/icons/'
  for (i = 0; i < allControllerIcons.length; i++){
    
    fileName = allControllerIcons[i]
    iconImage = loadImage(path + fileName)
    aGoodPair = new controllerPair (fileName, iconImage)
    controllerButtonPairs.push(aGoodPair)
  }
  controller5Load()
}



function allwordLoad(data){
 let words = data.join('\n').split('\n')
 wordPrimaryList = words.slice()
 threewordLoad()
}

function threewordLoad(){
  for (let i = 0; i < 3; i++){
    let randomIndex = floor(random(wordPrimaryList.length))
    let randomWord = wordPrimaryList[randomIndex];
    word3List.push(randomWord)
    wordPrimaryList.splice(randomIndex,1)
  }
}

function threewordFill(){
  for (let i = 0; i < 3; i++){
    let randomIndex = floor(random(wordPrimaryList.length))
    let randomWord = wordPrimaryList[randomIndex];
    if (word3List.length < 3){
      word3List.push(randomWord)
      wordPrimaryList.splice(randomIndex,1)
    }
  }
}

function mathLoad(data){
  for (let i = 0; i < data.length; i++){
    let QandA = data[i].split('=') 
    let equation = QandA[0].trim();
    let answer = parseFloat(QandA[1].trim());

    mathPrimaryList.push(new aMathEQ(equation, answer))
  }
}

function mathFirstList(){
  mathFirst3List[0].push(mathPrimaryList[0])
  mathFirst3List[1].push(mathPrimaryList[1])
  mathFirst3List[2].push(mathPrimaryList[2])
  }

function pickAMathEquation(){
  if (mathPrimaryList.length > 3){
    randomMathIndex = Math.floor(Math.random() * (mathPrimaryList.length - 3)) + 3
    randomMathEquation = mathPrimaryList[randomMathIndex]
    mathPrimaryList.splice(randomMathIndex, 1)
    mathCurrent = {equation: randomMathEquation.equation, answer: randomMathEquation.answer}
  }
}

function loadWorkWord(lines){
    if (lines.length === 0){
      return ''
    }
    return lines[Math.floor(Math.random() * lines.length)]
  }

if ('getGamepads' in navigator){
  console.log('gamepads are good')
} else {
  console.log('gamepads are not good')
}

function setup() {

  p5.soundOut.audiocontext.bufferSize = 2048

  finalWorkWord = loadWorkWord(workWords)

  console.log(finalWorkWord)

  console.log(musicIsLoaded)
  console.log(wordPrimaryList)
  console.log(word3List)
  console.log(mathPrimaryList)
  console.log(controllerButtonPairs)
  console.log(controllerRound5)

createCanvas(1500, 1125)
buttonSetup()
pickAMathEquation()
console.log(mathCurrent.answer)

}

function draw() {
  console.log(gameState)
  if (gameState === 'firstScreen') {
    firstScreenDraw();
  } else if (gameState === 'loginscreen') {
    background(0)
    startDraw();
  } else if (gameState === 'credits') {
    background(0)
    creditsDraw();
  } else if (gameState === 'gameIntro') {
    background(0)
    gameIntroDraw();
  } else if (gameState === 'KBStage') {
    background(0)
    KBStageDraw();
  } else if (gameState === 'KBMouseStage'){
    background(0)
    KBMouseDraw();
  } else if (gameState === 'CalcStage'){
    background(0)
    CalcStageDraw();
  } else if (gameState === 'GamepadStage'){
    background(0)
    GamepadStageDraw();
  } else if (gameState === 'finalstageintro'){
    background(0)
    beforeFinalStageDraw()
  } else if (gameState === 'finalstage'){
    background(0)
    finalStageDraw()
  } else if (gameState === 'lastscreen'){
    background(0)
    lastScreenDraw()
  }
}

function firstScreenDraw(){
 image(firstScreenImage,0,0)
 gameEnter()
}

function startDraw(){
background(0)
image(largeLogo,250,300)

push()
textSize(50)
fill(255,255,255)
text('Employee Name',575,500)
pop()

playernameInput.show()
namesubmitButton.show()

}

function creditsDraw(){
background(175)

push()
textSize(100)
fill(255)
text('this is the credits screen', 200,200)
pop()
}

function letsgoPressed(){
  introStart()
}

function gameIntroDraw(){
  playernameInput.hide()
  namesubmitButton.hide()
  push()
  textSize(50)
  fill(255,255,255)
  text('EMPLOYEE NAME: ' + playerName, 100,200)
  pop()

  push()
  textSize(25)
  fill(255,255,255)
  textFont(font1)
  text('We appreciate you showing up on time for another great day at FLC Inc.', 100, 400)
  text('Please make sure your perepheral devices are ready for use.', 100, 500)
  text('Follow instructions carefully and make sure to use your printed documentation when needed.', 100, 600)
  pop()

  push()
  textSize(50)
  textFont(font1)
  fill(255,255,255)
  text('Press the “Enter” key to start your day.', 100, 900)
  pop()


  gameStart()
}

function keyTyped(){
  if (gameState === 'KBStage' && keyCode !== 13 && /^[a-zA-Z]$/.test(key)){
    playerWord += key
  }
  
  if (gameState === 'KBStage' && keyIsPressed && keyCode === 13){
    KBStageWordMatch()
  }

  if (gameState === 'KBMouseStage' && keyCode !== 13 && /^[a-zA-Z]$/.test(key)){
    playerWord += key
  }
  if (gameState === 'KBMouseStage' && keyIsPressed && keyCode === 13){
    KBStageWordMatch()
  }

  if (gameState === 'CalcStage' && keyCode !== 13 && (/\d|\./.test(key))){
    playerNumber += key
  }
  if (gameState === 'CalcStage' && keyIsPressed && keyCode === 13){
      CalcStageCheck()
    }


   if (gameState === 'finalstage' && keyCode !== 13 && /^[a-zA-Z]$/.test(key)){
      playerWord += key
    }
    if (gameState === 'finalstage' && keyIsPressed && keyCode === 13){
      KBStageWordMatch()
    }
    if (gameState === 'finalstage' && keyCode !== 13 && (/\d|\./.test(key))){
      playerNumber += key
    }
    if (gameState === 'finalstage' && keyIsPressed && keyCode === 8){
        CalcStageCheck()
      }
}

// KB ONLY STAGE STUFF

function KBStageDraw(){

  timeElapsed = timerDuration - (millis() - timerStart)
  clock = Math.floor(timeElapsed / 1000)

  //console.log(clock)

push()
textSize(25)
fill(255)
text('Employee Name: ' + playerName, 1100,100)
pop()

image(smallLogo, 500,10)

  push()
  textSize(45)
  fill(255)
  text('Type the words shown correctly in any order', 100, 200)
  text('Press ENTER to submit your answer or to reset.', 100,300)
  pop()

  push()
  textSize(50)
  fill(255)
  text(word3List[0], 100,450)
  text(word3List[1], 100,550)
  text(word3List[2], 100,650)
  pop()

  push()
  textSize(60)
  stroke(255)
  strokeWeight(6)
  text('TYPED WORD: ' + playerWord, 100,850)
  pop()

  push()
  textSize(50)
  fill(255)
  text('Correct Answers: ' + KBStageScoring,550,1000)
  pop()

if (timeElapsed > 0 ){
  push()
  textSize(60)
  fill(255)
  text(clock, 50,100)
  pop()
}
  if (timeElapsed <= 0){
    background(0)
    push()
    textSize(50)
    fill(255)
    text('Correct Answers: ' + KBStageScoring,550,1000)
    text ('Time quota reached.', 200,500)
    text('Press the SPACE BAR continue working.', 200, 600)
    pop()
  }
  if (timeElapsed <= 0 && keyIsPressed && keyCode === 32){
    KBMStageStart()
  }
}

function KBStageWordMatch(){
  wordMatch = false
    for (let i = 0; i < word3List.length; i++){
      if (playerWord === word3List[i]){
        console.log("GOT IT")
        playCorrectSFX()
        if (gameState === 'KBStage'){
          KBStageScoring++
        }
        if (gameState === 'KBMouseStage'){
          KBMStageScoring++
        }
        if (gameState === 'finalstage'){
          finalRoundKBScore++
        }
        // make a function to animate YES on the screen and play sound effects
        word3List.splice(i, 1)
        threewordFill()
        playerWord = ''
        wordMatch = true
        break
      }
  }
  if (!wordMatch){
    playWrongSFX()
    console.log('wrong')
    playerWord = ''
  }
}

// KB MOUSE STAGE STUFF

function KBMouseDraw(){

  timeElapsed = timerDuration - (millis() - timerStart)
  clock = Math.floor(timeElapsed / 1000)

push()
textSize(25)
fill(255)
text('Employee Name: ' + playerName, 1100,100)
pop()

image(smallLogo, 500,10)
  
  push()
  textSize(50)
  fill(255)
  text(word3List[0], 100,480)
  text(word3List[1], 100,580)
  text(word3List[2], 100,680)
  pop()

  push()
  textSize(60)
  stroke(255)
  strokeWeight(6)
  text('TYPED WORD: ' + playerWord, 100,850)
  pop()

  if (timeElapsed > 0 ){
    push()
    textSize(60)
    fill(255)
    text(clock, 50,100)
    pop()
  }

  push()
  textSize(45)
  fill(255)
  text('Type the words shown correctly.', 150, 200)
  text('Press ENTER to submit your answer or to reset.', 150,275)
  text('Click the buttons as fast as you can!', 350,350)

  text('Words Correct: ' + KBMStageScoring, 200, 1000)
  text('Click Counter: ' + clickCounter, 800,1000)
  pop()

  kbmousebutton1.show()
  kbmousebutton2.show()
  kbmousebutton3.show()
  kbmousebutton4.show()
  kbmousebutton5.show()

  buttonMoveTimer = buttonMoveTimer - 1

  if (buttonMoveTimer === 0){
    kbmousebutton1.position(random(buttonX), random(buttonY))
    kbmousebutton2.position(random(buttonX), random(buttonY))
    kbmousebutton3.position(random(buttonX), random(buttonY))
    kbmousebutton4.position(random(buttonX), random(buttonY))
    kbmousebutton5.position(random(buttonX), random(buttonY))
    buttonMoveTimer = 120
  }
  
 
  if (timeElapsed <= 0){
    background(0)
    push()
    textSize(45)
    fill(255)
    text('Words Correct: ' + KBMStageScoring, 200, 1000)
    text('Click Counter: ' + clickCounter, 800, 1000)
  kbmousebutton1.hide()
  kbmousebutton2.hide()
  kbmousebutton3.hide()
  kbmousebutton4.hide()
  kbmousebutton5.hide()
    text ('Time quota reached.', 200,500)
    text('Press the SPACE BAR to continue working.', 200, 600)
    pop()
  }

  if (timeElapsed <= 0 && keyIsPressed && keyCode === 32){
    calcStageStart()
  }
}

function KBMouseClick(){
  if (gameState === 'KBMouseStage'){
    clickCounter += 1
  }
  if (gameState === 'finalstage'){
    finalRoundClickCounter += 1
  }
}

// CALC STAGE STUFF

function CalcStageDraw(){
background(128,128,128)

timeElapsed = mathDuration - (millis() - timerStart)
clock = Math.floor(timeElapsed / 1000)

push()
textSize(25)
fill(255)
text('Employee Name: ' + playerName, 1100,100)
pop()

image(smallLogo, 500,10)

if (timeElapsed > 0 ){
  push()
  textSize(60)
  fill(255)
  text(clock, 50,100)
  pop()

push()
textSize(70)
fill(255)
text(mathCurrent.equation, 400,500)
pop()

push()
textSize(55)
fill(255)
stroke(0)
strokeWeight(6)
text('YOUR ANSWER:',550, 650)
text(playerNumber,570,750)
pop()
}

push()
fill(255)
textSize(50)
text('DO SOME MATH! USE THE CALCULATOR IF NEEDED.',100,200)
text('Enter answer on the numberpad and hit ENTER to submit.', 100,300)
text('ROUND TO 100ths place.', 100,350)
text('CORRECT ANSWERS: '+ playerMathScore,450, 1000)
pop()

if (timeElapsed <= 0){
  background(128,128,128)

  push()
  fill(255)
  textSize(50)
  text('CORRECT ANSWERS: '+ playerMathScore,450, 1000)
  pop()

  push()
  fill(255)
  textSize(50)
  text ('Time quota reached.', 200,500)
  text('Press the SPACE BAR to continue working.', 200, 600)
  pop()
  }

if (timeElapsed <= 0 && keyIsPressed && keyCode === 32){
  gamepadStageStart()
}

}

function CalcStageCheck(){

  convertedPlayerNumber = parseFloat(playerNumber)
  console.log(convertedPlayerNumber)

  if (convertedPlayerNumber === mathCurrent.answer){
    console.log('CORRECT')
    playCorrectSFX()
    if (gameState === 'CalcStage'){
      playerMathScore++
    }
    if (gameState === 'finalstage'){
      finalRoundMathScore ++
    }
    playerNumber = ''
    mathCurrent = {equation: '', answer: 0}
    pickAMathEquation()

  } else {
    console.log('WRONG')
    playWrongSFX()
    playerNumber = ''
  }
}

// GAMEPAD STAGE STUFF

function GamepadStageLogic(gamepad) {
  expectedButtonPresses = controllerRound5.map(button => button.name)
  
    for (let i = 0; i < gamepad.buttons.length; i++) {
      if (gamepad.buttons[i].pressed && !buttonPressedState[i] && !gamepadDebounce()) {
        let buttonPressed = ''
        switch (i) {
          case 0:
            buttonPressed = 'cross'
            break
          case 1:
            buttonPressed = 'circle'
            break
          case 2:
            buttonPressed = 'square'
            break
          case 3:
            buttonPressed = 'triangle'
            break
          case 4:
            buttonPressed = 'l1'
            break
          case 5:
            buttonPressed = 'r1'
            break
          case 6:
            buttonPressed = 'l2'
            break
          case 7:
            buttonPressed = 'r2'
            break
          case 12:
            buttonPressed = 'up'
            break
          case 13:
            buttonPressed = 'down'
            break
          case 14:
            buttonPressed = 'left'
            break
          case 15:
            buttonPressed = 'right'
            break
        }
        console.log(expectedButtonPresses)
        if (buttonPressed === expectedButtonPresses[nextButtonIndex]) {
          userPressedButtons.push(buttonPressed)
  
          correctfx1.setVolume(0.1)
          correctfx1.play()
          console.log(buttonPressed.toUpperCase() + ' PRESSED CORRECTLY!')
          nextButtonIndex++
          console.log(nextButtonIndex)
        } else {
          userPressedButtons = []
          playWrongSFX()
          console.log(buttonPressed.toUpperCase() + ' PRESSED INCORRECTLY!')
          nextButtonIndex = 0
        }
      
        buttonPressedState[i] = true
      } else {
        buttonPressedState[i] = false
      }
    }
  
    if (nextButtonIndex === expectedButtonPresses.length){
      nextButtonIndex = 0
      controllerRound5 = []
      userPressedButtons = []
      controller5Load()
      if (gameState === 'GamepadStage'){
        gamepadroundScore++
      }
      if (gameState === 'finalstage'){
        finalRoundGamepadScore++
      }
    }
  }

function gamepadDebounce(){
    now = millis()
    if (now - lastButtonPress  < debounceTimeout){
      return true
    }
    lastButtonPress = now
    return false
  }
  
function GamepadStageDraw(){
    background(156, 155, 137)
    let gamepads = navigator.getGamepads()
  
    timeElapsed = gamepadRoundDuration - (millis() - timerStart)
    clock = Math.floor(timeElapsed / 1000, 0)
    
    
    if (!gamepads || !gamepads[0]) {
      push()
      textSize(50)
      fill(255)
      text('PLUG IN THE CONTROL DEVICE', 350,900)
      pop()
  
    } else if (gamepads && gamepads[0]){
      let gamepad = gamepads[0];
      console.log ('GAMEPAD CONNECTED')
  
      push()
      textSize(35)
      fill(255)
      text('CONTROL DEVICE CONNECTED SUCESSFULLY, GO!!', 330,900)
      pop()
  
      GamepadStageLogic(gamepad)
    }
  
  
    push()
    textSize(50)
    fill(255)
    text('Press the buttons from left to right in order!', 275,300)
    pop()
  
    push()
    scale(1.2)
    image(controllerRound5[0].controllerButton, 200,325)
    image(controllerRound5[1].controllerButton, 400,325)
    image(controllerRound5[2].controllerButton, 600,325)
    image(controllerRound5[3].controllerButton, 800,325)
    image(controllerRound5[4].controllerButton, 1000,325)
    
  
    for (i = 0; i < userPressedButtons.length; i++){
      const buttonName = userPressedButtons[i]
      const buttonIndex = controllerRound5.findIndex(button => button.controllerIcon === buttonName + '.png')
      if (buttonIndex !== -1) {
        image(controllerRound5[buttonIndex].controllerButton, 200 + i * 200, 450)
      }
    }
    pop()
  
    push()
    textSize(25)
    fill(255)
    text('Your Name: ' + playerName, 1100,100)
    pop()
    
    image(smallLogo, 500,10)
    
    push()
    textSize(50)
    text('ROUNDS COMPLETED: ' + gamepadroundScore, 450,1000)
    pop()
  
      if (timeElapsed > 0){
        push()
        textSize(60)
        fill(255)
        text(clock, 50,100)
        pop()
      }
  
    if (timeElapsed <= 0){
      background(175)
      push()
      fill(255)
      textSize(50)
      text ('Time quota reached.', 200,500)
      text('Press the SPACE BAR continue working.', 200, 600)
      pop()
          }
      
    if (gameState === 'GamepadStage' && timeElapsed <= 0 && keyIsPressed && keyCode === 32){
        finalStageIntroStart()
          }
  }

function beforeFinalStageDraw(){

  push()
  textSize(30)
  fill(255,255,255)
  textFont(font1)
  text('Another incredible day innovating at FLC Inc.', 100, 300) 
  text('Your final task for the day includes all your previously honed skills.', 100, 500)

  pop()

  push()
  textSize(50)
  textFont(font1)
  fill(255,255,255)
  text('Press ENTER to begin!', 100, 700)
  pop()

  if (gameState === 'finalstageintro' && keyIsPressed && keyCode === 13){
    finalStageStart()
  }

}

function finalStageDraw(){
  background(156, 155, 137)
  let gamepads = navigator.getGamepads()

  timeElapsed = finalStageDuration - (millis() - timerStart)
  clock = Math.floor(timeElapsed / 1000, 0)
   
  if (!gamepads || !gamepads[0]) {
    push()
    textSize(45)
    fill(255)
    text('PLUG IN THE CONTROL DEVICE', 390,1000)
    pop()

  } else if (gamepads && gamepads[0]){
    let gamepad = gamepads[0];
    console.log ('GAMEPAD CONNECTED')

    push()
    textSize(30)
    fill(255)
    text('CONTROL DEVICE CONNECTED SUCESSFULLY, GO!!', 335,1000)
    pop()

    GamepadStageLogic(gamepad)
  }
  
  push()
  textSize(25)
  fill(255)
  text('Your Name: ' + playerName, 1100,100)
  image(smallLogo, 500,10)
  pop()
  

  // gamepad stuff

  push()
  scale(0.9)
  image(controllerRound5[0].controllerButton, 200,825)
  image(controllerRound5[1].controllerButton, 400,825)
  image(controllerRound5[2].controllerButton, 600,825)
  image(controllerRound5[3].controllerButton, 800,825)
  image(controllerRound5[4].controllerButton, 1000,825)
  

  for (let i = 0; i < userPressedButtons.length; i++){
    const buttonName = userPressedButtons[i]
    const buttonIndex = controllerRound5.findIndex(button => button.controllerIcon === buttonName + '.png')
    if (buttonIndex !== -1) {
      image(controllerRound5[buttonIndex].controllerButton, 200 + i * 200, 925)
    }
  }
  
  pop()
  
 
  // typing/mouse stuff

  push()
  textSize(35)
  fill(255)
  text('Press ENTER to submit your word answer or to reset!', 150,200)
  text('Press BACKSPACE to submit your math answer or to reset!', 150,250)
  text('Click the buttons as fast as you can!', 150,300)
  pop()

  push()
  textSize(30)
  text('CLICK COUNTER: ' + finalRoundClickCounter, 1000,1050)
  text('WORDS CORRECT: ' + finalRoundKBScore, 600, 1050)
  text('CORRECT ANSWERS: ' + finalRoundMathScore, 100, 1050)
  text('BUTTON ROUNDS COMPLETED: ' + finalRoundGamepadScore, 500,1100)
  pop()

  push()
  textSize(40)
  fill(255)
  text(word3List[0], 100,400)
  text(word3List[1], 100,500)
  text(word3List[2], 100,600)
  pop()

  push()
  textSize(42)
  fill(255)
  stroke(0)
  strokeWeight(5)
  text('YOUR WORD: ' + playerWord, 100,700)
  text('Math Answer: ' + playerNumber, 850, 650)
  pop()

  kbmousebutton1.show()
  kbmousebutton2.show()
  kbmousebutton3.show()
  kbmousebutton4.show()
  kbmousebutton5.show()

  buttonMoveTimer = buttonMoveTimer - 1

  if (buttonMoveTimer === 0){
    kbmousebutton1.position(random(buttonX), random(buttonY))
    kbmousebutton2.position(random(buttonX), random(buttonY))
    kbmousebutton3.position(random(buttonX), random(buttonY))
    kbmousebutton4.position(random(buttonX), random(buttonY))
    kbmousebutton5.position(random(buttonX), random(buttonY))
    buttonMoveTimer = 120
  }
  


      if (timeElapsed > 0 ){
        push()
        textSize(60)
        fill(255)
        text(clock, 50,100)
        pop()
      
      
      // math stuff
      push()
      textSize(40)
      fill(255)
      text(mathCurrent.equation, 850,500)
      
      pop()
      }
 
  if (timeElapsed <= 0){
    background(0)
    push()
    textSize(30)
    fill(255)
    text('CLICK COUNTER: ' + finalRoundClickCounter, 1000,1050)
    text('WORDS CORRECT: ' + finalRoundKBScore, 600, 1050)
    text('CORRECT ANSWERS: ' + finalRoundMathScore, 100, 1050)
    text('BUTTON ROUNDS COMPLETED: ' + finalRoundGamepadScore, 500,1100)
    
    kbmousebutton1.hide()
    kbmousebutton2.hide()
    kbmousebutton3.hide()
    kbmousebutton4.hide()
    kbmousebutton5.hide()
    pop()

    push()
    textSize(55)
    fill(255)
    textFont(font1)
    text ('the time is up, nice work!', 200,500)
    text('press ENTER for your productivity score', 200, 600)
    pop()
  }
  if (timeElapsed <= 0 && keyIsPressed && keyCode === 13){
    lastscreenStart()
  }
}

function lastScreenDraw(){
  
  push()
  textSize(25)
  fill(255)
  text('Employee Name: ' + playerName , 1100,100)
  pop()
  
  image(smallLogo, 500,10)
  
  push()
  textSize(40)
  fill(255)
  text('INDIVIDUAL WORK STAGES', 100,250)
  text('FINAL WORK STAGE',970, 250)
  pop()

  push()
  textSize(35)
  fill(255)

  //first rounds scoring
  text('TYPING SCORE 1: ' + KBStageScoring, 150, 350)
  text('CLICKING SCORE: ' + clickCounter, 150, 400)
  text('TYPING SCORE 2: ' + KBMStageScoring, 150, 450)
  text('BUTTONS SCORE: ' + gamepadroundScore, 150, 500)
  text('MATH SCORE: ' + playerMathScore, 150, 550)
  text('MUSIC SCORE: ' + playerKeyboardScore, 150, 600)

  //final round scoring
  text('TYPING SCORE: ' + finalRoundKBScore, 1020, 350)
  text('CLICKING SCORE: ' + finalRoundClickCounter, 1020, 400)
  text('MATH SCORE: ' + finalRoundMathScore, 1020, 450)
  text('BUTTON SCORE: ' + finalRoundGamepadScore, 1020, 500)
  pop()

  push()
  textSize(50)
  fill(255)
  text('YOUR FINAL SCORE: ' + finalgamescore, 450, 700)
  text('YOUR WORK PERFORMANCE WAS: ' + finalWorkWord, 50, 800)
  pop()

  push()
  textSize(50)
  fill(255)
  text('RECORD YOUR FINAL SCORE ON THE SCORE SHEET', 150,1000)
  text('Alt-R TO RESET FOR THE NEXT EMPLOYEE', 150, 1100)
  pop()
}

function gameEnter(){
  if (gameState === 'firstScreen' && keyCode === 13){
    gameState = 'loginscreen'
    themeSong.setVolume(0.1)
    themeSong.loop()
  }
}

function introStart(){
  if (gameState === 'loginscreen'){
    gameState = 'gameIntro'
  }
}

function gameStart(){
  if (gameState === 'gameIntro' && keyCode === 13){
      gameState = 'KBStage'
      timerStart = millis()
      themeSong.stop()
      gameplaypt1.setVolume(0.1)
      gameplaypt1.loop()
    }
  }

function KBMStageStart(){
 if (gameState === 'KBStage'){
  gameState = 'KBMouseStage'
  timerStart = millis()
  playerWord = ''
 }
}

function calcStageStart(){
  if(gameState === 'KBMouseStage'){
    gameState = 'CalcStage'
    timerStart = millis()
    gameplaypt1.stop()
    gameplaypt3.setVolume(0.1)
    gameplaypt3.loop()
  }
}

function gamepadStageStart(){
  if (gameState === 'CalcStage'){
    gameState = 'GamepadStage'
    timerStart = millis()
    gameplaypt3.stop()
    gamepadSong.setVolume(0.1)
    gamepadSong.loop()
  }
}

function finalStageIntroStart(){
  if (gameState === 'GamepadStage'){
    gameState = 'finalstageintro'
    gamepadSong.stop()
    themeSong.loop()
}
}

function finalStageStart(){
  if (gameState === 'finalstageintro'){
    gameState = 'finalstage'
    timerStart = millis()
    playerNumber = ''
    playerWord = ''
    nextButtonIndex = 0
    controllerRound5 = []
    userPressedButtons = []
    controller5Load()
}
}

function lastscreenStart(){
  if (gameState === 'finalstage'){
    theFinalScore()
    gameState = 'lastscreen'
    
}
}



function theFinalScore(){
   finalgamescore = KBStageScoring +
                   clickCounter +
                   KBMStageScoring +
                   gamepadroundScore +
                   playerMathScore +
                   playerKeyboardScore +
                   finalRoundKBScore +
                   finalRoundClickCounter +
                   finalRoundMathScore +
                   finalRoundGamepadScore;
}


function writePlayerName(){
  playerName = this.value()
}

function buttonSetup(){
  playernameInput = createInput('')
  playernameInput.position(500, 550)
  playernameInput.input(writePlayerName)
  playernameInput.class('nameEntryClass')
  playernameInput.hide()

  namesubmitButton = createButton('LOGIN')
  namesubmitButton.class('loginbutton')
  namesubmitButton.position(670,700)
  namesubmitButton.mousePressed(letsgoPressed)
  namesubmitButton.hide()

  kbmousebutton1 = createButton('click me')
  kbmousebutton1.class('kbmousebutton')
  kbmousebutton1.mousePressed(KBMouseClick)

  kbmousebutton2 = createButton('click me')
  kbmousebutton2.class('kbmousebutton')
  kbmousebutton2.mousePressed(KBMouseClick)

  kbmousebutton3 = createButton('click me')
  kbmousebutton3.class('kbmousebutton')
  kbmousebutton3.mousePressed(KBMouseClick)

  kbmousebutton4 = createButton('click me')
  kbmousebutton4.class('kbmousebutton')
  kbmousebutton4.mousePressed(KBMouseClick)

  kbmousebutton5 = createButton('click me')
  kbmousebutton5.class('kbmousebutton')
  kbmousebutton5.mousePressed(KBMouseClick)

  kbmousebutton1.hide()
  kbmousebutton2.hide()
  kbmousebutton3.hide()
  kbmousebutton4.hide()
  kbmousebutton5.hide()
}