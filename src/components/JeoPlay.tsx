import { useState } from "react";
import { ArrowLeftIcon, SymbolIcon } from "@radix-ui/react-icons";

import { type IJeo, IMode, type IPlayer } from "../types";
import { useNavigation } from "../navigation";
import { JeoBoard } from "./JeoBoard";
import { JeoScoreboard } from "./JeoScoreboard";
import { ObjectStoreAudio, ObjectStoreImage } from "./ObjectStore";
import { size, price, min } from "../helpers";
import { sound } from "../sound";

export function JeoPlay({ jeo }: { jeo: IJeo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);
  const [usedQuestionsIndexes, setUsedQuestionsIndexes] = useState<number[]>(
    []
  );
  const [usedPlayersIndexes, setUsedPlayersIndexes] = useState<number[]>([]);
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

  const { closeModal } = useNavigation();

  const onReset = () => {
    setQuestionIndex(null);
    setUsedQuestionsIndexes([]);
    setUsedPlayersIndexes([]);
    setIsOpen(false);
    setPlayers((players) =>
      players.map((player) => ({
        ...player,
        score: { correct: 0, $: 0, incorrect: 0 },
      }))
    );
  };

  const onClose = () => {
    if (questionIndex == null) return;
    setUsedQuestionsIndexes((indexes) => indexes.concat(questionIndex));
    setUsedPlayersIndexes([]);
    setQuestionIndex(null);
    setIsOpen(false);
  };

  const onCorrect = (playerIndex: number) => {
    if (questionIndex == null) return;
    if (usedPlayersIndexes.includes(playerIndex)) return;
    sound.correct();
    setUsedPlayersIndexes([]);
    setPlayers((players) =>
      players.map((item, index) =>
        index === playerIndex
          ? {
              ...item,
              score: {
                ...item.score,
                correct: item.score.correct + 1,
                $:
                  item.score.$ +
                  price(size(jeo), jeo.questions[questionIndex], questionIndex),
              },
            }
          : item
      )
    );
    onClose();
  };

  const onIncorrect = (playerIndex: number) => {
    if (questionIndex == null) return;
    if (usedPlayersIndexes.includes(playerIndex)) return;
    sound.incorrect();
    setUsedPlayersIndexes((usedPlayersIndexes) =>
      usedPlayersIndexes.concat(playerIndex)
    );
    setPlayers((players) =>
      players.map((item, index) =>
        index === playerIndex
          ? {
              ...item,
              score: {
                ...item.score,
                incorrect: item.score.incorrect + 1,
                $: Math.max(
                  item.score.$ -
                    price(
                      size(jeo),
                      jeo.questions[questionIndex],
                      questionIndex
                    ),
                  0
                ),
              },
            }
          : item
      )
    );
  };

  const onIncrement = (playerIndex: number) => {
    setPlayers((players) =>
      players.map((item, index) =>
        index === playerIndex
          ? {
              ...item,
              score: { ...item.score, $: item.score.$ + min(jeo) / 2 },
            }
          : item
      )
    );
  };

  const onDecrement = (playerIndex: number) => {
    setPlayers((players) =>
      players.map((item, index) =>
        index === playerIndex
          ? {
              ...item,
              score: {
                ...item.score,
                $: Math.max(item.score.$ - min(jeo) / 2, 0),
              },
            }
          : item
      )
    );
  };

  const onAdd = () => {
    setPlayers((players) =>
      players.concat({
        name: `Player ${players.length + 1}`,
        score: {
          correct: 0,
          $: 0,
          incorrect: 0,
        },
      })
    );
  };

  const onSelect = (questionIndex: number) => {
    setQuestionIndex(questionIndex);
    setUsedPlayersIndexes([]);
    sound.timeIsTicking();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "16px",
            padding: "16px",
          }}
        >
          <button type="button" className="button" onClick={onReset}>
            <SymbolIcon />
            Reset
          </button>
          <button
            type="button"
            className="button button--delete"
            onClick={closeModal}
          >
            <ArrowLeftIcon />
            Exit
          </button>
        </div>
        <div
          style={{
            width: "700px",
            height: "550px",
          }}
        >
          {questionIndex != null ? (
            <div
              style={{
                border: "2px solid black",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                textAlign: "center",
                justifyContent: "center",
                height: "100%",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                {jeo.questions[questionIndex]?.question}
              </div>
              {jeo.questions[questionIndex]?.imageId && (
                <div
                  className="scrollbar"
                  style={{
                    overflowY: "auto",
                    flexShrink: "1",
                    minHeight: "0",
                  }}
                >
                  <ObjectStoreImage
                    style={{
                      display: "block",
                      width: "100%",
                      objectFit: "cover",
                    }}
                    imageId={jeo.questions[questionIndex]?.imageId as string}
                  />
                </div>
              )}
              {jeo.questions[questionIndex]?.audioId && (
                <div>
                  <ObjectStoreAudio
                    audioId={jeo.questions[questionIndex]?.audioId as string}
                    controls
                  />
                </div>
              )}
              {isOpen && (
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                  }}
                >
                  {jeo.questions[questionIndex]?.answer}
                </div>
              )}
              <div>
                {isOpen && (
                  <div style={{ fontSize: "14px", marginBottom: "6px" }}>
                    Nobody gave you a correct answer?
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                >
                  {isOpen && (
                    <button
                      type="button"
                      className="button button--delete"
                      onClick={onClose}
                    >
                      Continue
                    </button>
                  )}
                  {!isOpen && (
                    <button
                      type="button"
                      className="button"
                      onClick={() => setIsOpen(true)}
                    >
                      Show Answer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <JeoBoard
              mode={IMode.Play}
              selectedIndex={null}
              disabled={usedQuestionsIndexes}
              onSelect={onSelect}
              jeo={jeo}
            />
          )}
        </div>
        <div />
      </div>
      <div>
        <JeoScoreboard
          questionIndex={questionIndex}
          players={players}
          usedPlayersIndexes={usedPlayersIndexes}
          onCorrect={onCorrect}
          onIncorrect={onIncorrect}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onAdd={onAdd}
        />
      </div>
    </div>
  );
}
