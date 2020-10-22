import React from "react";
import './alert.css';
import image from '../alert/SnakeGame.png'
const Alert = ({startGame, isStartGame,isGameOver}) => {
   
    return (
        <div className="alert" style={{display:isStartGame? "none":"block"}}>
            <h2 className="alert-heading">{isGameOver?"Game Over":"New Game"}</h2>
            <img className="snake-image" src={image} alt="snake-img"></img>
            <button onClick={startGame} className="start-btn">Start Game</button>
        </div>
    );
}

export default Alert;