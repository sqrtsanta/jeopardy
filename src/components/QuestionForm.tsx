import { nanoid } from "nanoid";
import { set, del } from "idb-keyval";

import { type IQuestion } from "../types";
import { ObjectStoreImage, ObjectStoreAudio } from "./ObjectStore";

export function QuestionForm({
  value,
  onChange,
}: {
  value: IQuestion | null | undefined;
  onChange(question: IQuestion): void;
}) {
  const initialValues: IQuestion = {
    question: "",
    answer: "",
  };

  const question = value ?? initialValues;

  const changeField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const nextValue = {
      ...question,
      [event.target.name]: event.target.value,
    };
    onChange(nextValue);
  };

  const onSelectFile = (list: FileList | null, key: "imageId" | "audioId") => {
    const file = list?.[0];
    if (!file) return;
    const fileId = nanoid();
    set(`objects/${fileId}`, file).then(() => {
      onChange({
        ...question,
        [key]: fileId,
      });
    });
  };

  const onClearFile = (id: string | undefined, key: "imageId" | "audioId") => {
    del(`objects/${id}`).then(() => {
      onChange({
        ...question,
        [key]: undefined,
      });
    });
  };

  const onClear = () => {
    onChange(initialValues);
  };

  return (
    <form
      className="form"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <div>Question</div>
      <div className="field">
        <textarea
          required
          rows={5}
          className="textarea"
          placeholder="Question"
          name="question"
          value={question.question}
          onChange={changeField}
        />
      </div>
      <div className="field">
        {!question.audioId && !question.imageId && (
          <div style={{ display: "flex", gap: "8px" }}>
            <label className="file-select">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  onSelectFile(event.target.files, "imageId");
                }}
              />
              <span>+ image</span>
            </label>
            <label className="file-select">
              <input
                type="file"
                accept="audio/*"
                onChange={(event) => {
                  onSelectFile(event.target.files, "audioId");
                }}
              />
              <span>+ audio</span>
            </label>
          </div>
        )}
        {question.imageId && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div className="file-image">
              <ObjectStoreImage imageId={question.imageId} />
            </div>
            <button
              className="button button--delete"
              onClick={() => {
                onClearFile(question.imageId, "imageId");
              }}
            >
              Delete
            </button>
          </div>
        )}
        {question.audioId && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div>
              <ObjectStoreAudio audioId={question.audioId} controls />
            </div>
            <button
              className="button button--delete"
              onClick={() => {
                onClearFile(question.audioId, "audioId");
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="field">
        <input
          required
          className="input"
          type="answer"
          placeholder="Answer"
          name="answer"
          value={question.answer}
          onChange={changeField}
        />
      </div>
      <div className="field">
        <button
          type="button"
          className="button button--neutral"
          onClick={onClear}
        >
          Clear
        </button>
      </div>
    </form>
  );
}
