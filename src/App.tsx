import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
  useLayoutEffect,
} from "react";
import { nanoid } from "nanoid";
import { get, set, del } from "idb-keyval";

import { buildContainerQuery, useStaticContainerQuery } from "./hooks";
import "./App.css";

function clsx(...list: Array<string | boolean | undefined | null>) {
  return list.filter((item) => typeof item === "string").join(" ");
}

interface IJeo {
  id: string;
  title: string;
  createdAt: number;
  categories: string[];
  questions: IQuestion[];
}

interface IQuestion {
  question: string;
  answer: string;
  imageId?: string;
  audioId?: string;
}

interface IPlayer {
  name: string;
  score: IScore;
}

interface IScore {
  correct: number;
  $: number;
  incorrect: number;
}

enum IMode {
  Play,
  Build,
}

type IPage =
  | {
      type: NavEnum.Jeos;
    }
  | {
      type: NavEnum.JeoForm;
      jeoId?: string;
    };

type IModal = {
  type: NavEnum.JeoPlay;
  jeo: IJeo;
};

enum NavEnum {
  Jeos,
  JeoPlay,
  JeoForm,
}

const navigation = createContext<{
  modal?: IModal;
  page: IPage;
  go(page: IPage): void;
  openModal(modal: IModal): void;
  closeModal(): void;
}>({
  page: { type: NavEnum.Jeos },
  go: () => {},
  openModal: () => {},
  closeModal: () => {},
});

const store = createContext<{
  jeos: IJeo[];
  create: (jeo: IJeo) => void;
  update: (jeo: IJeo) => void;
  destroy: (jeo: IJeo) => void;
}>({
  jeos: [],
  create: () => {},
  update: () => {},
  destroy: () => {},
});

function useNavigation() {
  return useContext(navigation);
}

function useJeos() {
  return useContext(store);
}

function App() {
  const [page, setPage] = useState<IPage>({ type: NavEnum.Jeos });
  const [modal, setModal] = useState<IModal>();
  const [jeos, setJeos] = useState<IJeo[]>(() => {
    const json = localStorage.getItem("jeos");
    if (!json) return [];
    try {
      const value = JSON.parse(json);
      return value;
    } catch (error) {
      console.log(error);
      return [];
    }
  });

  const valueForStore = useMemo(() => {
    const create = (jeo: IJeo) => {
      setJeos((jeos) => jeos.concat(jeo));
    };
    const update = (jeo: IJeo) => {
      setJeos((jeos) => jeos.map((item) => (item.id === jeo.id ? jeo : item)));
    };
    const destroy = (jeo: IJeo) => {
      setJeos((jeos) => jeos.filter((item) => item.id !== jeo.id));
    };

    return {
      create,
      update,
      destroy,
      jeos,
    };
  }, [jeos]);

  const valueForNavigation = useMemo(
    () => ({
      modal,
      page,
      go: setPage,
      openModal: setModal,
      closeModal: () => setModal(undefined),
    }),
    [page]
  );

  useLayoutEffect(() => {
    get("jeos").then((jeos) => {
      if (jeos != null && jeos.length > 0) {
        setJeos(jeos);
      }
    });
  }, []);

  useEffect(() => {
    set("jeos", jeos);
  }, [jeos]);

  return (
    <store.Provider value={valueForStore}>
      <navigation.Provider value={valueForNavigation}>
        <Header />
        <div>
          <div>{page.type === NavEnum.Jeos && <JeosPage />}</div>
          <div>{page.type === NavEnum.JeoForm && <JeoFormPage />}</div>
        </div>
        {modal?.type === NavEnum.JeoPlay && (
          <Modal>
            <JeoPlay jeo={modal.jeo} />
          </Modal>
        )}
      </navigation.Provider>
    </store.Provider>
  );
}

function Modal({ children }: { children: React.ReactNode }) {
  const { closeModal } = useNavigation();

  return (
    <div className="modal-box">
      <div className="modal-content">{children}</div>
    </div>
  );
}

function Header() {
  const { go, page } = useNavigation();

  return (
    <div>
      <div className="header-box">
        <button
          type="button"
          onClick={() => go({ type: NavEnum.Jeos })}
          className="header-button"
        >
          JEOPARTY
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "12px",
          }}
        >
          {page.type === NavEnum.JeoForm && !page.jeoId && "New Jeo"}
          {page.type === NavEnum.JeoForm && page.jeoId && "Edit Jeo"}
          {page.type === NavEnum.Jeos && "My Jeos"}
        </div>
      </div>
    </div>
  );
}

function JeoPlay({ jeo }: { jeo: IJeo }) {
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);
  const [usedIndexes, setUsedIndexes] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { closeModal } = useNavigation();

  const onClose = () => {
    if (questionIndex == null) return;
    setUsedIndexes((indexes) => indexes.concat(questionIndex));
    setQuestionIndex(null);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          padding: "16px",
        }}
      >
        <div
          style={{
            width: "700px",
            height: "550px",
          }}
        >
          <JeoBoard
            mode={IMode.Play}
            selectedIndex={null}
            disabled={usedIndexes}
            onSelect={(questionIndex) => {
              setQuestionIndex(questionIndex);
            }}
            jeo={jeo}
          />
        </div>
        <div>
          <JeoScoreboard questionIndex={questionIndex} onClose={onClose} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          padding: "16px",
        }}
      >
        <button type="button" className="button" onClick={closeModal}>
          Exit
        </button>
      </div>
      {questionIndex != null && (
        <div
          className="mini-modal"
          style={{ width: "400px", minHeight: "150px", padding: "16px" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "700",
              }}
            >
              {jeo.questions[questionIndex]?.question}
            </div>
            {jeo.questions[questionIndex]?.imageId && (
              <div>
                <ObjectStoreImage
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
                  fontSize: "24px",
                  fontWeight: "700",
                }}
              >
                {jeo.questions[questionIndex]?.answer}
              </div>
            )}
            <div
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
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
      )}
    </div>
  );
}

function JeoScoreboard({
  questionIndex,
  onClose,
}: {
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
                $: item.score.$ + price(questionIndex),
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

function JeosPage() {
  const { jeos } = useJeos();

  return (
    <div className="jeo-item-list">
      <JeoItemNew />
      {jeos.map((jeo) => (
        <JeoItem key={jeo.id} jeo={jeo} />
      ))}
    </div>
  );
}

function JeoFormPage() {
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

  useEffect(() => {
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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          padding: "16px",
        }}
      >
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          padding: "16px",
        }}
      >
        <div>
          <button className="button" type="button" onClick={onSubmit}>
            Save
          </button>
        </div>
        <div>
          <button className="button" type="button" onClick={onPlay}>
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
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function JeoItemNew() {
  const { go } = useNavigation();

  return (
    <div className={clsx("jeo-item", "jeo-item-as-button")}>
      <button
        type="button"
        className="overlay-button"
        onClick={() => go({ type: NavEnum.JeoForm })}
      >
        + New
      </button>
    </div>
  );
}

function JeoItem({ jeo }: { jeo: IJeo }) {
  const { go } = useNavigation();

  return (
    <div className="jeo-item">
      <button
        type="button"
        className="overlay-button"
        onClick={() => go({ type: NavEnum.JeoForm, jeoId: jeo.id })}
      >
        <div>{jeo.title}</div>
        <div className="jeo-item__ts">
          {new Date(jeo.createdAt).toLocaleString()}
        </div>
      </button>
    </div>
  );
}

const CATEGORIES = [...Array(6).keys()];
const QUESTIONS = [...Array(30).keys()];

function JeoBoard({
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
        mode === IMode.Build &&
          (question == null || !question.question || !question.answer) &&
          "jeo-cell--empty"
      )}
      onClick={() => onSelect(questionIndex)}
    >
      <div>${price(questionIndex)}</div>
    </button>
  );
}

function price(questionIndex: number) {
  return 200 * (Math.floor(questionIndex / 6) + 1);
}

function JeoForm({
  value,
  onChange,
}: {
  value: IJeo;
  onChange(jeo: IJeo): void;
}) {
  const changeField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const nextValue = {
      ...value,
      [event.target.name]: event.target.value,
    };
    onChange(nextValue);
  };

  const changeCategory = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const nextCategories = [...value.categories];
    nextCategories[index] = event.target.value;
    const nextValue = {
      ...value,
      categories: nextCategories,
    };
    onChange(nextValue);
  };

  return (
    <form
      className="form"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <div>Jeo</div>
      <div className="field">
        <input
          required
          className="input"
          type="text"
          placeholder="Title"
          name="title"
          value={value.title}
          onChange={changeField}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
        }}
      >
        <div className="field">
          <input
            required
            className="input"
            type="text"
            placeholder="Category 1"
            name="categories.0"
            value={value.categories[0] ?? ""}
            onChange={(event) => changeCategory(event, 0)}
          />
        </div>
        <div className="field">
          <input
            required
            className="input"
            type="text"
            placeholder="Category 2"
            name="categories.1"
            value={value.categories[1] ?? ""}
            onChange={(event) => changeCategory(event, 1)}
          />
        </div>
        <div className="field">
          <input
            required
            className="input"
            type="text"
            placeholder="Category 3"
            name="categories.2"
            value={value.categories[2] ?? ""}
            onChange={(event) => changeCategory(event, 2)}
          />
        </div>
        <div className="field">
          <input
            required
            className="input"
            type="text"
            placeholder="Category 4"
            name="categories.3"
            value={value.categories[3] ?? ""}
            onChange={(event) => changeCategory(event, 3)}
          />
        </div>
        <div className="field">
          <input
            required
            className="input"
            type="text"
            placeholder="Category 5"
            name="categories.4"
            value={value.categories[4] ?? ""}
            onChange={(event) => changeCategory(event, 4)}
          />
        </div>
        <div className="field">
          <input
            required
            className="input"
            type="text"
            placeholder="Category 6"
            name="categories.5"
            value={value.categories[5] ?? ""}
            onChange={(event) => changeCategory(event, 5)}
          />
        </div>
      </div>
      <div className="field"></div>
    </form>
  );
}

function QuestionForm({
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

function useObjectStore({ id }: { id: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useLayoutEffect(() => {
    let url: string;
    let unmounted = false;

    get(`objects/${id}`).then((blob) => {
      if (!unmounted && blob != null) {
        url = URL.createObjectURL(blob);
        setUrl(url);
      }
    });

    return () => {
      unmounted = true;
      URL.revokeObjectURL(url);
    };
  }, [id]);

  return url;
}

function ObjectStoreImage({
  imageId,
  ...rest
}: { imageId: string } & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  const url = useObjectStore({ id: imageId });
  if (!url) return null;
  return <img {...rest} src={url} />;
}

function ObjectStoreAudio({
  audioId,
  ...rest
}: { audioId: string } & React.DetailedHTMLProps<
  React.AudioHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
>) {
  const url = useObjectStore({ id: audioId });
  if (!url) return null;
  return <audio {...rest} src={url} />;
}

export default App;
