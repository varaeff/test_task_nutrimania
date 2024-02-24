import React, { useState } from "react";
import Calendar from "./Components/Calendar";
import DateRow from "./Components/DateRow";
import DayNutritions from "./Components/DayNutritions";
import styles from "./App.module.css";
import Modal from "./Components/Modal";

function App(): JSX.Element {
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  const [nutritionsLog, setNutritionLog] = useState<{ [key: string]: string }>(
    localStorage.nutritionsLog ? JSON.parse(localStorage.nutritionsLog) : {}
  );

  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className={styles.app}>
      <DateRow
        activeDate={activeDate}
        setActiveDate={setActiveDate}
        setCalendarDate={setCalendarDate}
        setShowCalendar={setShowCalendar}
        setShowModal={setShowModal}
      />
      <DayNutritions
        activeDate={activeDate}
        nutritionsLog={nutritionsLog}
        setNutritionLog={setNutritionLog}
      />
      <Modal showModal={showModal} />
      <Calendar
        calendarDate={calendarDate}
        setCalendarDate={setCalendarDate}
        setActiveDate={setActiveDate}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        setShowModal={setShowModal}
      />
    </div>
  );
}

export default App;
