import React, { useEffect, useState } from "react";
import styles from "./DayNutritions.module.css";
import stylesSeveral from "./SeveralComponents.module.css";

interface NutritionItem {
  text: string;
  color: string;
  selected: boolean;
}

interface DayNutritionsProps {
  activeDate: Date;
  nutritionsLog: { [key: string]: string };
  setNutritionLog: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
}

function DayNutritions({
  activeDate,
  nutritionsLog,
  setNutritionLog,
}: DayNutritionsProps): JSX.Element {
  let initialState: NutritionItem[] = [
    {
      text: "hello world",
      color: "#19c152",
      selected: false,
    },
    {
      text: "hello world",
      color: "#ffc700",
      selected: false,
    },
    {
      text: "hello world",
      color: "#919191",
      selected: false,
    },
  ];

  const dayKey: string = [
    activeDate.getFullYear(),
    activeDate.getMonth(),
    activeDate.getDate(),
  ].join("");

  const checkColor: string | undefined = nutritionsLog[dayKey];

  const [nutritions, setNutrinions] = useState<NutritionItem[]>(initialState);

  useEffect(() => {
    const newState: NutritionItem[] = nutritions.map((item) =>
      item.color === checkColor
        ? { ...item, selected: true }
        : { ...item, selected: false }
    );
    setNutrinions(newState);
  }, [checkColor]); // eslint-disable-line react-hooks/exhaustive-deps

  //выбор записи по клику
  function selectHandler(color: string): void {
    setNutrinions(
      nutritions.map((item) =>
        item.color === color
          ? { ...item, selected: true }
          : { ...item, selected: false }
      )
    );
    const newLog = { ...nutritionsLog, [dayKey]: color };
    localStorage.setItem("nutritionsLog", JSON.stringify(newLog));
    setNutritionLog(newLog);
  }

  //сброс к начальному состоянию
  function resetHandler(): void {
    setNutrinions(nutritions.map((item) => ({ ...item, selected: false })));
    delete nutritionsLog[dayKey];
    localStorage.setItem("nutritionsLog", JSON.stringify(nutritionsLog));
    setNutritionLog(nutritionsLog);
  }

  //формирование вывода
  let output: JSX.Element[] = [];
  const selected: JSX.Element[] = [];
  for (let i = 0; i < nutritions.length; i++) {
    const item = (
      <div
        className={[
          !nutritions[i].selected ? styles.nutritionEl : undefined,
          nutritions[i].selected ? styles.nutritionElSelected : undefined,
        ].join(" ")}
        key={i}
        style={{ color: nutritions[i].color }}
        onClick={() =>
          !selected.length ? selectHandler(nutritions[i].color) : {}
        }
      >
        {nutritions[i].text}
      </div>
    );
    if (nutritions[i].selected) {
      selected.push(item);
      break;
    } else output.push(item);
  }
  if (selected.length) output = selected;

  return (
    <div className={stylesSeveral.mainBlock}>
      <div>{output}</div>
      {selected.length > 0 && (
        <button className={stylesSeveral.commit} onClick={resetHandler}>
          Отменить выбор
        </button>
      )}
    </div>
  );
}

export default DayNutritions;
