import { useState } from "react";

import { type IJeo, IMode } from "../types";
import { useNavigation } from "../navigation";
import { JeoBoard } from "./JeoBoard";
import { JeoScoreboard } from "./JeoScoreboard";
import { ObjectStoreAudio, ObjectStoreImage } from "./ObjectStore";
import { size } from "../helpers";

export function JeoPlay({ jeo }: { jeo: IJeo }) {
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);
  const [usedIndexes, setUsedIndexes] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { closeModal } = useNavigation();

  const onClose = () => {
    if (questionIndex == null) return;
    setUsedIndexes((indexes) => indexes.concat(questionIndex));
    setQuestionIndex(null);
    setIsOpen(false);
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
          <button
            type="button"
            className="button button--delete"
            onClick={closeModal}
          >
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
                border: "1px solid black",
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
              disabled={usedIndexes}
              onSelect={(questionIndex) => {
                setQuestionIndex(questionIndex);
              }}
              jeo={jeo}
            />
          )}
        </div>
        <div />
      </div>
      <div>
        <JeoScoreboard
          size={size(jeo)}
          question={questionIndex != null ? jeo.questions[questionIndex] : null}
          questionIndex={questionIndex}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
