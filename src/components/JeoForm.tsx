import { size } from "../helpers";
import { type IJeo } from "../types";
import { range } from "../utils/range";
import { set } from "../utils/set";

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
    const nextValue = set(event.target.name, event.target.value, value);
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
            className="input"
            type="number"
            placeholder="Columns: 6"
            name="size.cols"
            min={1}
            max={6}
            value={value.size?.cols}
            onChange={changeField}
          />
        </div>
        <div className="field">
          <input
            className="input"
            type="number"
            placeholder="Rows: 5"
            name="size.rows"
            min={1}
            max={6}
            value={value.size?.rows}
            onChange={changeField}
          />
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
        }}
      >
        {range(size(value).cols).map((_, index) => (
          <div className="field" key={index}>
            <input
              required
              className="input"
              type="text"
              placeholder={`Category ${index + 1}`}
              name={`categories.${index}`}
              value={value.categories[index] ?? ""}
              onChange={changeField}
            />
          </div>
        ))}
      </div>
      <div className="field"></div>
    </form>
  );
}
