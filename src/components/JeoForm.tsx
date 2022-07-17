import { type IJeo } from "../types";

export function JeoForm({
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
