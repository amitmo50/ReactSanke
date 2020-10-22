import React from "react";
import './cell.css';

const Cell = ({isGameOver, value, id, getCellClassName, initialGame}) => {
    return(
        <div id={id} className={getCellClassName(isGameOver, id, initialGame.snake, initialGame.snack)}>{value}</div>
    );
}

export default Cell;