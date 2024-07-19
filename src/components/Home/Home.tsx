import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Home.scss";
import AppointmentCard from "../AppointmentCard/AppointmentCard";

export default function Home() {
  const [weekDays, setWeekDays] = useState<string[]>([] as string[]);

  useEffect(() => {
    setWeekDays(calcWeekDays());
  }, []);

  useEffect(() => {
    if (weekDays.length) console.table(weekDays);
  }, [weekDays]);

  function calcWeekDays() {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    console.log(currentDate.getDay());

    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - daysToMonday);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date.toString());
    }
    return week;
  }

  return (
    <div className="home-container">
      {weekDays?.length && weekDays.map((day: string) => (
        <div key={day}>
          <AppointmentCard day={day} />
        </div>
      ))}
      <NavBar />
    </div>
  );
}
