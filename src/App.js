import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { Howl } from "howler";
import chime from "./Alarm03.wav";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [counter, setCounter] = React.useState(0);
  const [best, setBest] = React.useState(3000000);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      var sound = new Howl({
        src: [chime],
      });
      sound.play();
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setCounter((prevCount) => prevCount + 1);
    } else {
      updateBestGame(counter);
      setTenzies(false);
      setDice(allNewDice());
      setCounter(0);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  function updateBestGame(counter) {
    if (counter < best) {
      setBest((prevBest) => counter);
    }
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <div className="App">
      <main>
        {tenzies && <Confetti />}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="dice-container">{diceElements}</div>
        <div className="game-container">
          <div className="game-stats">
            <div className="stats-row">
              This Game: {counter === 1 ? "1 roll" : `${counter} rolls`}
            </div>
            <div className="stats-row">
              Best Game:{" "}
              {best === 3000000 ? "" : best === 1 ? "1 roll!" : `${best} rolls`}
            </div>
          </div>
          <button className="roll-dice" onClick={rollDice}>
            {tenzies ? "New Game" : "Roll"}
          </button>
        </div>
      </main>
    </div>
  );
}
