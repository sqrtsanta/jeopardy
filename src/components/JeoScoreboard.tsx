import { useState, useEffect } from "react";

import { price } from "../helpers";
import { type IQuestion, type IPlayer, type ISize } from "../types";

export function JeoScoreboard({
  size,
  question,
  questionIndex,
  onClose,
}: {
  size: ISize;
  question: IQuestion | null;
  questionIndex: number | null;
  onClose(): void;
}) {
  const [players, setPlayers] = useState<IPlayer[]>([
    {
      name: "Player 1",
      score: {
        correct: 0,
        $: 0,
        incorrect: 0,
      },
    },
  ]);
  const [usedIndexes, setUsedIndexes] = useState<number[]>([]);

  useEffect(() => {
    setUsedIndexes([]);
  }, [questionIndex]);

  const onCorrect = (playerIndex: number) => {
    if (questionIndex == null) return;
    if (usedIndexes.includes(playerIndex)) return;
    setUsedIndexes([]);
    setPlayers((players) =>
      players.map((item, index) =>
        index === playerIndex
          ? {
              ...item,
              score: {
                ...item.score,
                correct: item.score.correct + 1,
                $: item.score.$ + price(size, question, questionIndex),
              },
            }
          : item
      )
    );
    onClose();
  };

  const onIncorrect = (playerIndex: number) => {
    if (questionIndex == null) return;
    if (usedIndexes.includes(playerIndex)) return;
    setUsedIndexes((usedIndexes) => usedIndexes.concat(playerIndex));
    setPlayers((players) =>
      players.map((item, index) =>
        index === playerIndex
          ? {
              ...item,
              score: { ...item.score, incorrect: item.score.incorrect + 1 },
            }
          : item
      )
    );
  };

  return (
    <div className="jeo-scoreboard">
      {players.map((player, index) => (
        <JeoPlayer
          key={index}
          isActive={!!questionIndex && !usedIndexes.includes(index)}
          player={player}
          onCorrect={() => onCorrect(index)}
          onIncorrect={() => onIncorrect(index)}
        />
      ))}
      <div className="jeo-scoreboard__button-box">
        <button
          type="submit"
          className="button"
          onClick={() =>
            setPlayers((players) =>
              players.concat({
                name: `Player ${players.length + 1}`,
                score: {
                  correct: 0,
                  $: 0,
                  incorrect: 0,
                },
              })
            )
          }
        >
          Add
        </button>
      </div>
    </div>
  );
}

function JeoPlayer({
  isActive,
  player,
  onCorrect,
  onIncorrect,
}: {
  isActive: boolean;
  player: IPlayer;
  onCorrect(): void;
  onIncorrect(): void;
}) {
  return (
    <div className="jeo-player">
      <div>{player.name}</div>
      <div className="jeo-player__score">
        <div>{player.score.correct}</div>
        <div>${player.score.$}</div>
        <div>{player.score.incorrect}</div>
      </div>
      <div className="jeo-player__buttons">
        <button
          type="button"
          className="button"
          disabled={!isActive}
          onClick={onCorrect}
        >
          Yes
        </button>
        <button
          type="button"
          className="button button--delete"
          disabled={!isActive}
          onClick={onIncorrect}
        >
          No
        </button>
      </div>
    </div>
  );
}
