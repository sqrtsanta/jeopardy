import { useState } from "react";
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
  onEdit,
  onAdd,
}: {
  questionIndex: number | null;
  players: IPlayer[];
  usedPlayersIndexes: number[];
  onCorrect(index: number): void;
  onIncorrect(index: number): void;
  onIncrement(index: number): void;
  onDecrement(index: number): void;
  onEdit(index: number, name: string): void;
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
          onEdit={(name) => onEdit(index, name)}
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
  onEdit,
}: {
  isActive: boolean;
  player: IPlayer;
  onCorrect(): void;
  onIncorrect(): void;
  onIncrement(): void;
  onDecrement(): void;
  onEdit(name: string): void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="jeo-player">
      {isEditing ? (
        <input
          size={1}
          autoFocus
          style={{
            textAlign: "center",
          }}
          className="unstyled-input"
          value={player.name ?? ""}
          onChange={(event) => onEdit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setIsEditing(false);
            }
          }}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <button className="unstyled-button" onClick={() => setIsEditing(true)}>
          {player.name}
        </button>
      )}

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
