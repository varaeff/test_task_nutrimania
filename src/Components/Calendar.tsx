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

  const returnDaysInMonth: number[] = useMemo(() => {
    const daysInMonth: number[] = [
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
    ];
    //корректировка для високосного года
    if (
      month === 1 &&
      ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
    )
      daysInMonth[month] += 1;
    return daysInMonth;
  }, [year]); // eslint-disable-line react-hooks/exhaustive-deps

  //формирование матрицы месяца
  const outputMonth: (number | string)[][] = useMemo(() => {
    const weekDays: string[] = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
    const daysInMonth: number[] = returnDaysInMonth;
    const monthTable: (number | string)[][] = [];
    const firstDay: number = new Date(year, month, 1).getDay();
    const maxDays: number = daysInMonth[month];

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
  }, [year, month]); // eslint-disable-line react-hooks/exhaustive-deps

  function changeCurrentDay(day: number | string): void {
    if (typeof day === "number" && day !== -1) {
      const diff: number = (day - calendarDate.getDate()) * 86400000;
      setCalendarDate(new Date(calendarDate.getTime() + diff));
    }
  }

  function changeMonth(n: number): void {
    const daysInMonth: number[] = returnDaysInMonth;
    const workYear: number = calendarDate.getFullYear();
    const workMonth: number = calendarDate.getMonth();
    let workDate: number = calendarDate.getDate();

    if (workDate > daysInMonth[workMonth + n])
      workDate = daysInMonth[workMonth + n];

    let newDate: number = new Date(workYear, workMonth + n, workDate).getTime();
    if (newDate > currentDate.getTime()) newDate = currentDate.getTime();

    setCalendarDate(new Date(newDate));
  }

  function hideCalendar(changeDate: boolean): void {
    changeDate && setActiveDate(calendarDate);
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
      <button
        className={styles.cancel}
        onClick={() => hideCalendar(false)}
      ></button>
      <h2 className={styles.header}>Календарь</h2>
      <div className={styles.month}>
        <button
          className={stylesSeveral.arrowButton}
          onClick={() => changeMonth(-1)}
        >
          {leftArrow}
        </button>
        {months[calendarDate.getMonth()]} &nbsp;
        {currentDate.getFullYear() !== calendarDate.getFullYear() &&
          calendarDate.getFullYear()}
        <button
          className={stylesSeveral.arrowButton}
          disabled={isEdgeMonth}
          onClick={() => changeMonth(1)}
        >
          {rightArrow}
        </button>
      </div>
      {rows}
      <button
        className={stylesSeveral.commit}
        onClick={() => hideCalendar(true)}
      >
        Выбрать
      </button>
    </div>
  );
}

export default Calendar;
