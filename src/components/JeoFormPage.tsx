import { useState, useLayoutEffect } from "react";
import { nanoid } from "nanoid";
import {
  CrumpledPaperIcon,
  ArrowLeftIcon,
  MixIcon,
} from "@radix-ui/react-icons";

import { type IJeo, IMode } from "../types";
import { NavEnum, useNavigation } from "../navigation";
import { useJeos } from "./useJeos";
import { JeoBoard } from "./JeoBoard";
import { JeoForm } from "./JeoForm";
import { QuestionForm } from "./QuestionForm";
import { size } from "../helpers";

export function JeoFormPage() {
  const [jeo, setJeo] = useState<IJeo>({
    id: nanoid(),
    title: "",
    createdAt: Date.now(),
    categories: [],
    questions: [],
  });
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);

  const { jeos, create, update, destroy } = useJeos();
  const { go, page, openModal } = useNavigation();

  if (page.type !== NavEnum.JeoForm) {
    return null;
  }

  const existingJeo = jeos.find((item) => item.id === page.jeoId);

  useLayoutEffect(() => {
    if (existingJeo) {
      setJeo(existingJeo);
    }
  }, [existingJeo]);

  const onSubmit = () => {
    if (page.jeoId) {
      update(jeo);
    } else {
      create(jeo);
    }

    go({ type: NavEnum.Jeos });
  };

  const onPlay = () => {
    openModal({ type: NavEnum.JeoPlay, jeo });
  };

  const onDestroy = () => {
    if (window.confirm("Are you sure?")) {
      destroy(jeo);
      go({ type: NavEnum.Jeos });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
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
          <div>
            <button className="button" type="button" onClick={onSubmit}>
              <ArrowLeftIcon />
              Save & Exit
            </button>
          </div>
          <div>
            <button className="button" type="button" onClick={onPlay}>
              <MixIcon />
              Play
            </button>
          </div>
          {page.jeoId && (
            <div>
              <button
                className="button button--delete"
                type="button"
                onClick={onDestroy}
              >
                <CrumpledPaperIcon />
                Delete
              </button>
            </div>
          )}
        </div>
        <div
          style={{
            width: "700px",
            height: "550px",
          }}
        >
          <JeoBoard
            mode={IMode.Build}
            jeo={jeo}
            disabled={[]}
            selectedIndex={questionIndex}
            onSelect={(questionIndex) => setQuestionIndex(questionIndex)}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "32px",
          }}
        >
          <div>
            <JeoForm value={jeo} onChange={(jeo) => setJeo(jeo)} />
          </div>
          {questionIndex != null && (
            <QuestionForm
              key={questionIndex}
              size={size(jeo)}
              questionIndex={questionIndex}
              value={jeo.questions[questionIndex]}
              onChange={(question) => {
                const nextJeo = {
                  ...jeo,
                  questions: [...jeo.questions],
                };

                nextJeo.questions[questionIndex] = question;

                setJeo(nextJeo);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
