var elements = document.getElementsByClassName("square");
var player = 1, bot = -1;
var gameOver = false;


for (let idx = 0; idx < elements.length; idx++) {
    elements[idx].addEventListener("click", function(){
        if(!this.innerText && !gameOver){
            play(+this.getAttribute("el"), +this.parentElement.getAttribute("el"), "X");
            botPlay();
        }
    });
}


function play(row, col, player){
    elements[row+col*3].innerText = player;
    let board = getBoard();
    let moves = movesLeft(board);
    let boardValue = evaluate(board)
    if(!moves || boardValue != 0){
        gameOver = true;
        document.getElementById('footer').classList.remove("hidden");
        result = "";
        if(moves == 0)
            result = "It's a TIE"
        else if(boardValue > 0)
            result = "You LOST!"
        else
            result = "You WON!"
        document.getElementById('result').innerText = result;
    }
}

function getBoard(){
    let board = newBoard();
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            board[i][j] = elements[i+j*3].innerText == "X"? 1 : elements[i+j*3].innerText == "O"? -1 : 0;
    return board;
}

function newBoard(){
    return [[0,0,0],[0,0,0],[0,0,0]];
}

function cleanBoard(){
    for(let i in elements)
        elements[i].innerText = "";
}

function evaluate(board){
    for(let i = 0; i < 3; i++){
        // Won Horizontally
        if(board[i][0] == board[i][1] && board[i][2] == board[i][1]){
            if(board[i][0] == bot) 
                return 10; 
            else if(board[i][0] == player)
                return -10;
        }
        // Won Vertically
        if(board[0][i] == board[1][i] && board[2][i] == board[1][i]){
            if(board[0][i] == bot) 
                return 10; 
            else if(board[0][i] == player)
                return -10;
        }
    }
    // Won Diagonally
    if(
        (board[0][0] == board[1][1] && board[0][0] == board[2][2]) || 
        (board[0][2] == board[1][1] && board[0][2] == board[2][0])
    ){
        if(board[1][1] == bot) 
            return 10; 
        else if(board[1][1] == player)
            return -10;
    }

    return 0;
}

function minimax(board, depth, isMaximizer){
    let score = evaluate(board);
    score += isMaximizer? depth : -depth;

    // Somebody won
    if(score != 0) return score;

    // No more moves left
    if(!movesLeft(board)){
        return 0;
    }

    if(isMaximizer){
        let bestMove = -Infinity;

        for(var i in board){
            for(var k in board[i]){
                if(board[i][k] == 0){
                    board[i][k] = bot;
                    bestMove = Math.max(minimax(board, depth+1, !isMaximizer), bestMove);
                    board[i][k] = 0;
                }
            }
        }
        return bestMove;
    }else{
        let bestMove = Infinity;

        for(let i in board){
            for(let k in board[i]){
                if(board[i][k] == 0){
                    board[i][k] = player;
                    bestMove = Math.min(minimax(board, depth+1, !isMaximizer), bestMove);
                    board[i][k] = 0;
                }
            }
        }
        return bestMove;
    }
}

function findBotBestMove(board){
    let bestMove = -Infinity;
    let move = [-1, -1];

    // Hard Coded Stuff :)
    

    for(let i in board){
        for(let j in board[i]){
            if(board[i][j] == 0){
                board[i][j] = bot;
                let newMoveValue = minimax(board, 0, false);
                // console.log([i, j], newMoveValue)
                if(newMoveValue > bestMove){
                    bestMove = newMoveValue;
                    move = [+i, +j];
                }
                board[i][j] = 0;
            }
        }
    }

    return move;
}
    
function movesLeft(board){
    let moves = 0;
    for(let i in board)
        for(let k in board[i])
            if(board[i][k] == 0) moves++;
    return moves;
}
 
function botPlay(){
    if(!gameOver)
        play(...findBotBestMove(getBoard()), "O");
}

function reset(){
    document.getElementById('footer').classList.add("hidden");
    cleanBoard();
    gameOver = false;
}