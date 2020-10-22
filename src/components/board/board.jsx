import React from "react";
import './board.css';
import Cell from '../cell/cell';

const Board = ({isGameOver, getCellClassName, initialGame}) => {
    const boardArray = Array(792).fill('');
    return(
        <div className="board-game">
            {boardArray.map((cell, index) =>{
                return <Cell isGameOver={isGameOver} getCellClassName={getCellClassName} value={cell} key={index} id={index} initialGame={initialGame}/>
            })}
        </div>
    );
}

export default Board;