import React, { useMemo } from "react";
import stylesSeveral from "./SeveralComponents.module.css";
import styles from "./Calendar.module.css";
import { leftArrow, rightArrow } from "./Pictograms";

interface CalendarProps {
  calendarDate: Date;
  setCalendarDate: React.Dispatch<React.SetStateAction<Date>>;
  setActiveDate: React.Dispatch<React.SetStateAction<Date>>;
  showCalendar: boolean;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Calendar = React.memo(InnerCalendar);

function InnerCalendar({
  calendarDate,
  setCalendarDate,
  setActiveDate,
  showCalendar,
  setShowCalendar,
  setShowModal,
}: CalendarProps): JSX.Element {
  const months: string[] = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];
  const year: number = calendarDate.getFullYear();
  const month: number = calendarDate.getMonth();
  const currentDate: Date = new Date();
  const isEdgeMonth: boolean =
    month === currentDate.getMonth() && year === currentDate.getFullYear();
  const maxDate: number = currentDate.getDate();
  const nutritionsLog: { [key: string]: string } = localStorage.nutritionsLog
    ? JSON.parse(localStorage.nutritionsLog)
    : {};

  //формирование матрицы месяца
  const outputMonth: (number | string)[][] = useMemo(() => {
    const weekDays: string[] = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
    const daysInMonth: number[] = [
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
    ];
    const monthTable: (number | string)[][] = [];
    const firstDay: number = new Date(year, month, 1).getDay();

    let maxDays: number = daysInMonth[month];
    //корректировка для високосного года
    if (
      month === 1 &&
      ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
    )
      maxDays += 1;

    monthTable[0] = weekDays;

    let counter: number = 1;
    for (let row: number = 1; row < 7; row++) {
      monthTable[row] = [];
      for (let col: number = 0; col < 7; col++) {
        monthTable[row][col] = -1;
        if (row === 1 && col + 1 >= firstDay) {
          monthTable[row][col] = counter++;
        } else if (row > 1 && counter <= maxDays) {
          monthTable[row][col] = counter++;
        }
      }
    }
    return monthTable;
  }, [year, month]);

  function changeCurrentDay(day: number | string): void {
    if (typeof day === "number" && day !== -1) {
      const diff: number = (day - calendarDate.getDate()) * 86400000;
      setCalendarDate(new Date(calendarDate.getTime() + diff));
    }
  }

  function changeMonth(n: number): void {
    let newDate: number = calendarDate.setMonth(calendarDate.getMonth() + n);
    if (newDate > currentDate.getTime()) newDate = currentDate.getTime();
    setCalendarDate(new Date(newDate));
  }

  function hideCalendar(): void {
    setActiveDate(calendarDate);
    setShowCalendar(false);
    setShowModal(false);
  }

  //формирование вывода
  let rows: JSX.Element[] = [];
  rows = outputMonth.map((row: (number | string)[], rowIndex: number) => {
    let rowItems: JSX.Element[] = row.map(
      (item: number | string, index: number) => {
        const disableSelector: boolean = isEdgeMonth && maxDate < Number(item);
        const dayKey: string = [year, month, item].join("");
        return (
          <div
            key={index}
            className={[
              (!disableSelector || rowIndex !== 0) && styles.rowItem,
              (disableSelector || rowIndex === 0 || item === -1) &&
                styles.dayRow,
              Number(item) === calendarDate.getDate() && styles.calendarDate,
              Number.isInteger(Number(item)) &&
                !disableSelector &&
                styles.underline,
            ].join(" ")}
            style={{ textDecorationColor: nutritionsLog[dayKey] }}
            onClick={() =>
              !disableSelector && typeof item === "number"
                ? changeCurrentDay(Number(item))
                : {}
            }
          >
            {item !== -1 && item}
          </div>
        );
      }
    );
    return (
      <div key={rowIndex} className={styles.row}>
        {rowItems}
      </div>
    );
  });

  return (
    <div
      className={[
        stylesSeveral.mainBlock,
        styles.calendarBlock,
        showCalendar ? styles.show : styles.hide,
      ].join(" ")}
    >
      <h2 className={styles.header}>Календарь</h2>
      <div className={styles.month}>
        <button
          className={stylesSeveral.arrowButton}
          onClick={() => changeMonth(-1)}
        >
          {leftArrow}
        </button>
        {months[calendarDate.getMonth()]} &nbsp;
        {calendarDate.getFullYear()}
        <button
          className={stylesSeveral.arrowButton}
          disabled={isEdgeMonth}
          onClick={() => changeMonth(1)}
        >
          {rightArrow}
        </button>
      </div>
      {rows}
      <button className={stylesSeveral.commit} onClick={hideCalendar}>
        Выбрать
      </button>
    </div>
  );
}

export default Calendar;
