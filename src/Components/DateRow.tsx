import React from "react";
import { calendarPic, leftArrow, rightArrow } from "./Pictograms";
import styles from "./DateRow.module.css";
import stylesSeveral from "./SeveralComponents.module.css";

interface DateRowProps {
  activeDate: Date;
  setActiveDate: (date: Date) => void;
  setCalendarDate: (date: Date) => void;
  setShowCalendar: (show: boolean) => void;
  setShowModal: (show: boolean) => void;
}

function DateRow({
  activeDate,
  setActiveDate,
  setCalendarDate,
  setShowCalendar,
  setShowModal,
}: DateRowProps): JSX.Element {
  const currentDate: Date = new Date();
  const year: number = activeDate.getFullYear();
  const month: number = activeDate.getMonth();
  const isEdgeMonth: boolean =
    month === currentDate.getMonth() && year === currentDate.getFullYear();
  const months: string[] = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  function changeDate(n: number): void {
    const newDate: number = activeDate.setDate(activeDate.getDate() + n);
    setActiveDate(new Date(newDate));
  }

  function callCalendar(): void {
    setCalendarDate(activeDate);
    setShowCalendar(true);
    setShowModal(true);
  }

  return (
    <div className={styles.rowBlock}>
      <button
        onClick={() => changeDate(-1)}
        className={stylesSeveral.arrowButton}
      >
        {leftArrow}
      </button>
      <div className={styles.dateBlock} onClick={callCalendar}>
        <div className={styles.calendar}>{calendarPic} &nbsp;</div>
        <div>
          {activeDate.getDate()}&nbsp;{months[activeDate.getMonth()]}&nbsp;
          {currentDate.getFullYear() !== activeDate.getFullYear() &&
            activeDate.getFullYear()}
        </div>
      </div>
      <button
        disabled={isEdgeMonth && currentDate.getDate() === activeDate.getDate()}
        onClick={() => changeDate(1)}
        className={stylesSeveral.arrowButton}
      >
        {rightArrow}
      </button>
    </div>
  );
}

export default DateRow;
