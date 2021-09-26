/**
 * 
 * Minimax Algorithm implemented in Vanilla Js using a Tic Tac Toe Game :)
 *                          Made with love <3
 * 
 */

// Square element array
var elements = document.getElementsByClassName("square");

// Player and Bot values in array
var player = 1, bot = -1;

// Game States
var gameOver = false;

// Adding event listeners to squares
for (let idx = 0; idx < elements.length; idx++) {
    elements[idx].addEventListener("click", function(){

        // TODO: Make an option to select who player goes first.

        // If game isnt over and no one has played:
        if(!this.innerText && !gameOver){
            // call play method using X, Y coords in board from user input
            play(+this.getAttribute("el"), +this.parentElement.getAttribute("el"), "X");

            // Make the bot play
            botPlay();
        }
    });
}

/**
 * Make a play using on of the players. 
 * Print to screen if anyone won.
 * 
 * @param {number} row X Position in board
 * @param {number} col Y Position in board
 * @param {number} player Value of wether the bot or player who is playing
 */
function play(row, col, player){

    // Select the element clicked
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

/**
 * 
 * @returns Array representing current board
 */
function getBoard(){
    let board = newBoard();
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            board[i][j] = elements[i+j*3].innerText == "X"? 1 : elements[i+j*3].innerText == "O"? -1 : 0;
    return board;
}

/**
 * 
 * @returns New blank Board
 */
function newBoard(){
    return [[0,0,0],[0,0,0],[0,0,0]];
}

/**
 * Clean current Board
 */
function cleanBoard(){
    for(let i in elements)
        elements[i].innerText = "";
}

/**
 * 
 * @param {Array} board Board to be evaluated and check if someone won.
 * @returns Value of board. 
 *          10 for bot win
 *          -10 for player win 
 *          0 for no win at all
 */
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

/**
 * 
 * @param {Array} board Board to be evaluated
 * @param {number} depth Current depth in tree
 * @param {boolean} isMaximizer Whether or not is the maximixer turn 
 * @returns Score of best move
 */
function minimax(board, depth, isMaximizer){
    let score = evaluate(board);

    // Somebody won
    if(score != 0) {
        score -= depth;
        return score;
    }

    // No more moves left
    if(!movesLeft(board)){
        return 0;
    }

    if(isMaximizer){
        let bestMove = -Infinity;

        // Traverse all cells in board
        for(var i in board){
            for(var k in board[i]){
                if(board[i][k] == 0){
                    // Make the bot move (bot is always the maximizer)
                    board[i][k] = bot;
                    // Calculate the current move and take the maximum
                    bestMove = Math.max(minimax(board, depth+1, !isMaximizer), bestMove);
                    // Return board to previous state
                    board[i][k] = 0;
                }
            }
        }
        return bestMove;
    }else{
        let bestMove = Infinity;

        // Traverse all cells in board
        for(let i in board){
            for(let k in board[i]){
                if(board[i][k] == 0){
                    // Make the player move (player is always the minimizer)
                    board[i][k] = player;
                    // Calculate the current move and take the minimum
                    bestMove = Math.min(minimax(board, depth+1, !isMaximizer), bestMove);
                    // Return board to previous state
                    board[i][k] = 0;
                }
            }
        }
        // return best move
        return bestMove;
    }
}

/**
 * 
 * @param {Array} board A Board :) 
 * @returns The best move for the bot
 */
function findBotBestMove(board){
    let bestMove = -Infinity;
    let move = [-1, -1];

    for(let i in board){
        for(let j in board[i]){
            if(board[i][j] == 0){
                board[i][j] = bot;
                let newMoveValue = minimax(board, 0, false);
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
    
/**
 * 
 * @param {array} board A board
 * @returns Number of availables squares in board
 */
function movesLeft(board){
    let moves = 0;
    for(let i in board)
        for(let k in board[i])
            if(board[i][k] == 0) moves++;
    return moves;
}
 
/**
 * Make the bot play :)
 */
function botPlay(){
    if(!gameOver)
        play(...findBotBestMove(getBoard()), "O");
}

/**
 * Reset game
 */
function reset(){
    document.getElementById('footer').classList.add("hidden");
    cleanBoard();
    gameOver = false;
}