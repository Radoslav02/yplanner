/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Home.scss";
import AppointmentCard from "../AppointmentCard/AppointmentCard";
import { truncateDateString } from "../../helpers/truncateDateString";
import { addOneWeek } from "../../helpers/addOneWeek";
import { subtractOneWeek } from "../../helpers/subtractOneWeek";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [weekDays, setWeekDays] = useState<string[]>([] as string[]);
  const [relativeDay, setRelativeDay] = useState<Date>(new Date());
  const [appointmentsData, setAppointmentsData] = useState<any>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.uid) {
      fetchAppointments()
    }
  }, [user]);

  useEffect(() => {
    setWeekDays(calcWeekDays());
  }, [relativeDay]);

  useEffect(() => {
    console.log(appointmentsData);
  }, [appointmentsData]);

  async function fetchAppointments() {
    try {
      const appointmentsCollectionRef = collection(db, `users/${user!.uid}/appointments`);
      const appointmentDocs = await getDocs(appointmentsCollectionRef);
      const appointmentsData = appointmentDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointmentsData(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Error fetching appointments");
    }
  }


  function calcWeekDays() {
    const currentDate = new Date(relativeDay);
    const dayOfWeek = currentDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - daysToMonday);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(truncateDateString(date));
    }
    return week;
  }

  return (
    <div className="home-container">
      <div
        className="left-swipe"
        onTouchEnd={() =>
          setRelativeDay((oldDate: Date) => subtractOneWeek(oldDate))
        }
      ></div>
      <div className="appointments-wrapper">
        {weekDays?.length &&
          weekDays.map((day: string) => (
            <div key={day}>
              <AppointmentCard day={day} />
            </div>
          ))}
      </div>
      <div
        className="right-swipe"
        onTouchEnd={() => setRelativeDay((oldDate: Date) => addOneWeek(oldDate))}
      ></div>
      <NavBar />
    </div>
  );
}
