import React from "react";
import Die from "./Die";
import BestTime from "./BestTime";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [resetTimer, setResetTimer] = React.useState(false);
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const numOfRolls = React.useRef(0);
  const [seconds, setSeconds] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  let secondsDisplay = seconds > 9 ? seconds : `0${seconds}`;
  let minutesDisplay = minutes > 9 ? minutes : `0${minutes}`;

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  //controls the timer and resets it for a new game
  React.useEffect(() => {
    if (tenzies) {
      return;
    }

    if (resetTimer) {
      setSeconds(0);
      setMinutes(0);
      setResetTimer(false);
      return;
    }

    let timer = setInterval(() => {
      clearInterval(timer);

      if (seconds < 59) {
        setSeconds(seconds + 1);
      } else {
        setMinutes(minutes + 1);
        setSeconds(0);
      }
    }, 1000);
  }, [seconds, resetTimer]);

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
      numOfRolls.current++;
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      numOfRolls.current = 0;
      setTenzies(false);
      setResetTimer(true);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
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
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <div>Number of Rolls: {numOfRolls.current}</div>
      <BestTime time={(tenzies && [seconds, minutes]) || [0, 0]} />
      <span>Time: {`${minutesDisplay}:${secondsDisplay}`}</span>

      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
