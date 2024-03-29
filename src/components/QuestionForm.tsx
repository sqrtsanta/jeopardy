import { type ISize, type IQuestion } from "../types";
import { ObjectStoreImage, ObjectStoreAudio } from "./ObjectStore";
import { price } from "../helpers";
import { set } from "../utils/set";
import { noop } from "../utils/noop";
import { useObjectForm } from "./useObjectStore";

export function QuestionForm({
  size,
  questionIndex,
  value,
  onChange,
}: {
  size: ISize;
  questionIndex: number;
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
    const nextValue = set(event.target.name, event.target.value, question);
    onChange(nextValue);
  };

  const { selectFile, clearFile } = useObjectForm();

  const onSelectFile = (list: FileList | null, key: "imageId" | "audioId") => {
    selectFile(list)
      .then((fileId) => {
        onChange({
          ...question,
          [key]: fileId,
        });
      })
      .catch(noop);
  };

  const onClearFile = (id: string | undefined, key: "imageId" | "audioId") => {
    clearFile(id)
      .then(() => {
        onChange({
          ...question,
          [key]: undefined,
        });
      })
      .catch(noop);
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
        <input
          className="input"
          type="number"
          placeholder={`Cost: ${price(size, question, questionIndex)}`}
          name="cost"
          value={question.cost}
          onChange={changeField}
        />
      </div>
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
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
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
    </form>
  );
}
