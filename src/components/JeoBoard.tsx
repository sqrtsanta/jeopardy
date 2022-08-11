import { type IJeo, type IQuestion, IMode } from "../types";
import {
  buildContainerQuery,
  useStaticContainerQuery,
} from "./useStaticContainerQuery";
import { clsx } from "../utils/clsx";
import { price } from "../helpers";

const CATEGORIES = [...Array(6).keys()];
const QUESTIONS = [...Array(30).keys()];

export function JeoBoard({
  mode,
  jeo,
  disabled,
  selectedIndex,
  onSelect,
}: {
  mode: IMode;
  jeo: IJeo;
  disabled: number[];
  selectedIndex: number | null;
  onSelect(index: number): void;
}) {
  return (
    <div className="jeo-board">
      <JeoTitleCell mode={mode} title={jeo.title} />
      {CATEGORIES.map((categoryIndex) => (
        <JeoHeaderCell
          key={categoryIndex}
          index={categoryIndex}
          mode={mode}
          category={jeo.categories[categoryIndex]}
        />
      ))}
      {QUESTIONS.map((questionIndex) => (
        <JeoCell
          mode={mode}
          key={questionIndex}
          isSelected={selectedIndex === questionIndex}
          isDisabled={disabled.includes(questionIndex)}
          questionIndex={questionIndex}
          question={jeo.questions[questionIndex]}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function JeoTitleCell({ mode, title }: { mode: IMode; title: string }) {
  const { ref, value: fontSize } = useStaticContainerQuery<
    string,
    HTMLDivElement
  >(
    [
      buildContainerQuery("12px", 0, 100),
      buildContainerQuery("14px", 100, 200),
      buildContainerQuery("16px", 200, 300),
      buildContainerQuery("18px", 300, 450),
    ],
    "20px"
  );

  return (
    <div
      ref={ref}
      className={clsx(
        "jeo-cell",
        "jeo-cell--title",
        mode === IMode.Build && !title && "jeo-cell--empty"
      )}
    >
      <div
        style={{
          fontSize,
        }}
      >
        {title || "Title"}
      </div>
    </div>
  );
}

function JeoHeaderCell({
  mode,
  index,
  category,
}: {
  mode: IMode;
  index: number;
  category: string | undefined;
}) {
  const { ref, value: fontSize } = useStaticContainerQuery<
    string,
    HTMLDivElement
  >(
    [
      buildContainerQuery("12px", 0, 100),
      buildContainerQuery("14px", 100, 200),
      buildContainerQuery("16px", 200, 300),
      buildContainerQuery("18px", 300, 450),
    ],
    "20px"
  );

  return (
    <div
      ref={ref}
      className={clsx(
        "jeo-cell",
        "jeo-cell--header",
        mode === IMode.Build && !category && "jeo-cell--empty"
      )}
    >
      <div
        style={{
          fontSize,
        }}
      >
        {category || `Category ${index + 1}`}
      </div>
    </div>
  );
}

function JeoCell({
  mode,
  isDisabled,
  isSelected,
  question,
  questionIndex,
  onSelect,
}: {
  mode: IMode;
  isDisabled: boolean;
  isSelected: boolean;
  question: IQuestion | undefined;
  questionIndex: number;
  onSelect(index: number): void;
}) {
  const { ref, value: fontSize } = useStaticContainerQuery<
    string,
    HTMLButtonElement
  >(
    [
      buildContainerQuery("12px", 0, 100),
      buildContainerQuery("14px", 100, 200),
      buildContainerQuery("16px", 200, 300),
      buildContainerQuery("18px", 300, 450),
    ],
    "20px"
  );

  return (
    <button
      ref={ref}
      type="button"
      className={clsx(
        "jeo-cell",
        isSelected && "jeo-cell--active",
        isDisabled && "jeo-cell--disabled",
        (question == null || !question.question || !question.answer) &&
          "jeo-cell--empty"
      )}
      onClick={() => onSelect(questionIndex)}
    >
      <div>${price(question, questionIndex)}</div>
    </button>
  );
}
