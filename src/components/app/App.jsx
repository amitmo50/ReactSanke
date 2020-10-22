import React, {useEffect, useReducer} from 'react';
import './App.css';
import Board from '../board/board';
import Alert from '../alert/alert';
import cs from 'classnames'

const gameSpeedRate = 300;
// const numOfRows = 24;
const numOfCols = 33;
const boardArraySize = 792;

const directions = {
  up: 'UP',
  down: 'DOWN',
  right: 'RIGHT',
  left: 'LEFT'
}; 

const keyPressCode = {
  38: 'UP',
  39: 'RIGHT',
  37: 'LEFT',
  40: 'DOWN',
};

const getCellClassName = (isGameOver,id, snake, snack) =>{
  return cs(
    'cell',
    {
      'border': isBorder(id),
    },
    {
      'snake': isSnake(id, snake.positions),
    },
    {
      'snack': isPosition(id, snack.positions),
    },
    {
      'crash': isGameOver && isPosition(id, getHeadSnake(snack)),
    },
  )
};

const isSnake = (id, positions) => {
  return positions.filter(pos => isPosition(id, pos)).length;
}
const isPosition = (id, position) => {
  return id === position
}

const isBorder = (id) =>
  ((id >= 0) && (id <= numOfCols - 1)) || ((id >= boardArraySize - numOfCols) && (id <= boardArraySize - 1)) || (id + 1) % numOfCols === 0 || id % numOfCols === 0;

const moveToPlace = {
  UP: (id) => (id - numOfCols),
  DOWN: (id) => (id + numOfCols),
  RIGHT: (id) => (id + 1),
  LEFT: (id) => (id - 1)
}

const getIsSnakeEating = (snake, snack) => {
  return isPosition(getHeadSnake(snake), snack.positions);
}

const getHeadSnake = snake => snake.positions[0];

const getIsSnakeOutside = snakeHead => isBorder(snakeHead);

const getSnakeTail = snake => snake.positions.slice(1);

const getSnakeWithoutStub = snake => snake.positions.slice(0, snake.positions.length - 1);

const getRandomPositions = () => {
  let position = Math.floor(Math.random() * (boardArraySize - 1) + 1);
  while(isBorder(position)){
    position = Math.floor(Math.random() * (boardArraySize - 1) + 1);
  }
  return position;
}
const checkCrashHeadTail = (snake) => {
  return isSnake(getHeadSnake(snake), getSnakeTail(snake));
}

const initialGame = {
  boardGame: {
    direction: directions.right,
    isGameOver: false,
    isStartGame:true,
  },
  snake: {
    positions: [379],
  },
  snack: {
    positions: getRandomPositions(),
  },

};

const reducer = (state, action) => {
  switch (action.type) {
    case 'DIRECTION_CHANGE':
      return {
        ...state,
        boardGame: {
          ...state.boardGame,
          direction: action.direction,
          isStartGame:true,
        },
      };
    case 'SNAKE_MOVE':
      const isSnakeEat = getIsSnakeEating(state.snake, state.snack);
      const snakeHead = moveToPlace[state.boardGame.direction](getHeadSnake(state.snake));
      const snakeTail = isSnakeEat ? state.snake.positions : getSnakeWithoutStub(state.snake);
      const snackPosition = isSnakeEat ? getRandomPositions() : state.snack.positions;
      console.log(snakeTail)
      return {
        boardGame:{
          ...state.boardGame,
          isStartGame:true,
        },
        snake: {
          positions: [snakeHead, ...snakeTail],
        },
        snack: {
          positions: snackPosition,
        },
      };
    case 'GAME_OVER':
      
      return {
        ...state,
        boardGame: {
          ...state.boardGame,
          isGameOver: true,
          isStartGame:false,
        },
      }
    case 'RESTART_GAME':
      return {
        boardGame: {
          direction: directions.right,
          isGameOver: false,
          isStartGame:true,
        },
        snake: {
          positions: [379],
        },
        snack: {
          positions: getRandomPositions(),
        },
      
      }
    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialGame);
   
  const onChangeKey = (e) => {
    if(keyPressCode[e.keyCode]){
      dispatch({
        type: 'DIRECTION_CHANGE',
        direction:keyPressCode[e.keyCode],
      });

    }
  }  

  useEffect(
    () => {
      window.addEventListener('keyup',onChangeKey,false);
      return () => {
        window.removeEventListener('keyup',onChangeKey, false);
      };
    },[]);
  
  useEffect(
    () => {
      const everyIterate = () => {
        if(getIsSnakeOutside(state.snake.positions[0]) || checkCrashHeadTail(state.snake)){
          dispatch({ type: 'GAME_OVER' });
        }else{
          dispatch({ type: 'SNAKE_MOVE' });
        } 
      }
      const interval = setInterval(everyIterate, gameSpeedRate);
      return () => clearInterval(interval)
    },[state]);

    const startGame = () => {
      dispatch({type: 'RESTART_GAME'});
    }
  

  return (
    <div className="App">
      <h1 className="heading">Snake Game</h1>
      <Alert isGameOver={state.boardGame.isGameOver} startGame={startGame} isStartGame={state.boardGame.isStartGame}/>
      <Board isGameOver={state.boardGame.isGameOver} getCellClassName={getCellClassName} initialGame={state}/>
    </div>
  );
}

export default App;
