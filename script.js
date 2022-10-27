
document.addEventListener("DOMContentLoaded", function (event) {
  let isDisabledWin = true;
const body = document.querySelector("body");
let audioMove = new Audio();
const audioStart = new Audio();
const audioVictory = new Audio();
const text = `<div class="game-box widescreen">
<div class="you_won">
    <div class="close_button">
        <p class="exit">&#9587;</p>
    </div>
    <p class="text_you-won">Hooray! You solved the puzzle in <span class="won_time">00:00</span> and <span class="won_step">0</span> moves!</p>
</div>
<div class="over"></div>
<div class="game-buttons">
    <button class="button start">Shuffle and start</button>
    <button class="button stop">Stop</button>
    <button class="button save">Save</button>
    <button class="button results">Results</button>    
</div>
<div class="game-info-center">
    <div>Moves:</div>
    <div class="param step">0</div>
    <div>Time:</div>
    <div class="param time">00:00</div>
</div>
<div class="game-content">
    <div class="overlay"></div>
    <div class="field"></div>
</div>
<div class="center">Frame size: <span class="width">4</span>x<span class="height">4</span>
</div>
<div class="center select_field" data-size="resizer">Other sizes:
    <a href="#" data-width="3" data-height="3">3x3</a> 
    <a href="#" data-width="4" data-height="4">4x4</a> 
    <a href="#" data-width="5" data-height="5">5x5</a> 
    <a href="#" data-width="6" data-height="6">6x6</a> 
    <a href="#" data-width="7" data-height="7">7x7</a> 
    <a href="#" data-width="8" data-height="8">8x8</a> 
</div>
<div class="center">
        <div class="sound_tiles"><span class="text_sound">sounds </span><div class="switch-btn switch-on"></div></div>
    </div>
</div>`;
body.innerHTML = text;
soundInit();
soundInitStart();
soundInitVictory();

let widthSize = document.querySelector(".width");
let heightSize = document.querySelector(".height");
  const start = document.querySelector(".start");
  const save = document.querySelector(".save");
  const results = document.querySelector(".results");
  const overlay = document.querySelector(".overlay");
  let z_index_1 = -10;
  let z_index_2 = 10;
  let z_index_3 = 20;
  let movesValue = 0;
  const time = document.querySelector('.time');
  const won_time = document.querySelector('.won_time');
  const stopTimer = document.querySelector('.stop');
  let sec = 0;
  let min = 0;
  let t = 0;
  const field = document.querySelector(".field");
  let size_links = document.querySelector(".select_field");
  let isTimerStarted = false;
  let isFinished;
  const buttonClose = document.querySelector(".close_button");
  const modal = document.querySelector(".you_won");
  const over = document.querySelector(".over");
  

  game_start(4, 4);
  stopTimerProcedure();
  overlay.style.zIndex = z_index_1;

  for (const size_link of size_links.children) {
    let x = size_link.dataset.width;
    let y = size_link.dataset.height;
    size_link.addEventListener("click", () => {
      if (confirm("Are you sure?")) {
        widthSize.innerHTML = x;
        heightSize.innerHTML = y;
        field.innerHTML = "";
        game_start(x, y);
        startTimerProcedure();
        movesValue = 0;
        document.querySelector('.won_step').innerHTML = movesValue;
        document.querySelector('.step').innerHTML = movesValue;   
      }
    });
  }

  function game_start(x, y) {
    isFinished = false;
    isDisabledWin = false;
    
    let size_x = parseInt(x);
    let size_y = parseInt(y);

    const cellSize = 100;

    field.style.width = size_x * cellSize + "px";
    field.style.height = size_y * cellSize + "px";

    overlay.style.width = size_x * cellSize + "px";
    overlay.style.height = size_y * cellSize + "px";

    const empty = {
      value: size_x * size_y,
      top: 0,
      left: 0,
    };

    const cells = [];
    cells.push(empty);
    const numbers = [...Array(size_x * size_y - 1).keys()];


    for (let i = 1; i <= size_x * size_y - 1; i++) {
      const cell = document.createElement("div");
      const value = size_x * size_y - numbers[i - 1] - 1;
      cell.className = "cell";
      cell.innerHTML = value;

      const left = i % size_x;
      const top = (i - left) / size_x;
      cells.push({
        value: value,
        left: left,
        top: top,
        element: cell,
      });

      cell.style.right = left * cellSize + "px";
      cell.style.bottom = top * cellSize + "px";
      field.append(cell);
      cell.addEventListener("click", () => {
        move(i); 
      });
    }



    for (let j = 0; j <= 50*(size_x * size_y); j++) {
      isDisabledWin = true; 
      let random = Math.floor(Math.random() * (cells.length-1)+1);      
      console.log(j);   //  проверка цикла
      audioMove.muted = true;
      move(random);
      audioMove.muted = false;
    }
    isDisabledWin = false;
    

    start.addEventListener("click", () => {
      soundStartPlay();

      field.innerHTML = "";
      movesValue = 0;
      startTimerProcedure();
      document.querySelector('.won_step').innerHTML = movesValue;
      document.querySelector('.step').innerHTML = movesValue;    
      game_start(size_x, size_y);
    });

 


    function move(index) {
      startTimer();

      const cell = cells[index];
      const leftDiff = Math.abs(empty.left - cell.left);
      const topDiff = Math.abs(empty.top - cell.top);


      if (leftDiff + topDiff > 1) {
        return;
      }
      
      cell.element.style.right = empty.left * cellSize + "px";
      cell.element.style.bottom = empty.top * cellSize + "px";

      const emptyLeft = empty.left;
      const emptyTop = empty.top;
      empty.left = cell.left;
      empty.top = cell.top;
      cell.left = emptyLeft;
      cell.top = emptyTop;
      
      soundClick(); 

      
      if(!isDisabledWin){
        isFinished = cells.every((cell) => {
          if(size_x*size_y - cell.value === cell.top * size_x + cell.left){
              return true;
          };
        });

        movesValue++;
        document.querySelector('.step').innerHTML = movesValue;
        document.querySelector('.won_step').innerHTML = movesValue;
        if (isFinished) {      // Game finished
          stopTimerProcedure();
          soundVictoryPlay(); 
          over.style.zIndex = z_index_2;
          modal.style.zIndex = z_index_3; 
        } 
      } 
    }
  }
    
    function tick(){
        sec++;
        if (sec >= 60) {
            sec = 0;
            min++;
        }
    }
    function add() {
        tick();
        time.textContent = (min > 9 ? min : "0" + min)
                    + ":" + (sec > 9 ? sec : "0" + sec);
        won_time.textContent = (min > 9 ? min : "0" + min)
        + ":" + (sec > 9 ? sec : "0" + sec);            
        timer();
    }
    function timer() {
        t = setTimeout(add, 1000);
    }
    stopTimer.addEventListener("click",() => {
        if(stopTimer.innerHTML == 'Stop'){
            stopTimerProcedure();
            stopTimer.innerHTML = 'Continue'; 
        } else {
            continueTimerProcedure();
            stopTimer.innerHTML = 'Stop';           
        }
    });

    function startTimer(){
        if(!isTimerStarted){
            clearTimeout(t);
            startTimerProcedure();
        } 
    }

    function stopTimerProcedure(){
        clearTimeout(t);
        isTimerStarted = false;
        overlay.style.zIndex = z_index_2;
    }

    function startTimerProcedure(){
        clearTimeout(t);
        t = 0;
        sec = -1;
        min = 0;
        time.textContent = "00:00";
        won_time.textContent = "00:00";
        timer();
        isTimerStarted = true;
        overlay.style.zIndex = z_index_1;
        stopTimer.innerHTML = 'Stop';
    }

    function continueTimerProcedure(){
        if(isFinished){
            return;
        }
        isTimerStarted = true;
        t = setTimeout(add, 1000);
        overlay.style.zIndex = z_index_1;
    }
    const switcher = document.querySelector('.switch-btn');
    switcher.addEventListener('click',() => {
      if (switcher.classList.contains('switch-on')) {
        switcher.classList.remove('switch-on');
        audioMove.muted = true; 
        audioStart.muted = true;
        audioVictory.muted = true;
      } else {
        switcher.classList.add('switch-on');
        audioMove.muted = false; 
        audioStart.muted = false;
        audioVictory.muted = false;
      }
    })
    

    function soundInit(){
      audioMove.src = 'assets/tile.mp3';
      document.querySelector('.game-box').append(audioMove);      
    }

    function soundClick() {
      audioMove.volume = 0.5;
      audioMove.play();
    }
    function soundInitStart(){
      audioStart.src = 'assets/start.mp3';
      document.querySelector('.start').append(audioStart);      
    }

    function soundStartPlay() {
      audioStart.volume = 0.5;
      audioStart.play();

    }function soundInitVictory(){
      audioVictory.src = 'assets/victory.mp3';
      document.querySelector('.you_won').append(audioVictory);      
    }

    function soundVictoryPlay() {
      audioVictory.volume = 0.5;
      audioVictory.play();
    }

    buttonClose.addEventListener('click', () => {
      over.style.zIndex = z_index_1;
      modal.style.zIndex = z_index_1;
    })

});
