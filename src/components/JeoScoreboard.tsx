import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";

import { type IPlayer } from "../types";

export function JeoScoreboard({
  questionIndex,
  players,
  usedPlayersIndexes,
  onCorrect,
  onIncorrect,
  onIncrement,
  onDecrement,
  onAdd,
}: {
  questionIndex: number | null;
  players: IPlayer[];
  usedPlayersIndexes: number[];
  onCorrect(index: number): void;
  onIncorrect(index: number): void;
  onIncrement(index: number): void;
  onDecrement(index: number): void;
  onAdd(): void;
}) {
  return (
    <div className="jeo-scoreboard">
      {players.map((player, index) => (
        <JeoPlayer
          key={index}
          isActive={
            questionIndex != null && !usedPlayersIndexes.includes(index)
          }
          player={player}
          onCorrect={() => onCorrect(index)}
          onIncorrect={() => onIncorrect(index)}
          onIncrement={() => onIncrement(index)}
          onDecrement={() => onDecrement(index)}
        />
      ))}
      <div className="jeo-scoreboard__button-box">
        <button type="submit" className="button" onClick={onAdd}>
          <PlusIcon />
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
  onIncrement,
  onDecrement,
}: {
  isActive: boolean;
  player: IPlayer;
  onCorrect(): void;
  onIncorrect(): void;
  onIncrement(): void;
  onDecrement(): void;
}) {
  return (
    <div className="jeo-player">
      <div>{player.name}</div>
      <div className="jeo-player__score">
        <button
          type="button"
          className="button button--ghost"
          onClick={onIncrement}
        >
          <PlusIcon />
        </button>
        <div>${player.score.$}</div>
        <button
          type="button"
          className="button button--ghost"
          onClick={onDecrement}
        >
          <MinusIcon />
        </button>
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
