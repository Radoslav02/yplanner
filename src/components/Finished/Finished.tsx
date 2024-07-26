/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Appointment } from "../../models/appointment";
import NavBar from "../NavBar/NavBar";
import "./Finished.scss";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";

export default function Finished() {
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>(
    [] as Appointment[]
  );

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.uid) {
      fetchAppointments();
    }
  }, [user]);

  async function fetchAppointments() {
    try {
      const appointmentsCollectionRef = collection(
        db,
        `users/${user!.uid}/appointments`
      );
      const appointmentDocs = await getDocs(appointmentsCollectionRef);
      const appointmentsData = appointmentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filtered = appointmentsData.filter(
        (appointment: any) => appointment.done
      );
      setAppointmentsData(filtered as Appointment[]);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Greška pri dobavljanju termina");
    }
  }

  // Helper function to convert hour string to a comparable number
  const parseHour = (hour: string) => {
    const [hours, minutes] = hour.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day); // month is zero-indexed
  };

  // Sort the data array first by date, then by hour
  const sortedData = appointmentsData.slice().sort((a, b) => {
    const dateComparison = parseDate(a.date).getTime() - parseDate(b.date).getTime();
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return parseHour(a.hour) - parseHour(b.hour);
  });

  return (
    <div className="finished-container">
      <div className="finished-title">Odrađeni</div>
      <div className="search-client-container">
        <div className="search-icon-container">
          <SearchIcon />
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Pretražite imena, materijal ili usluge"
        />
      </div>
      {sortedData.map((appointment: Appointment) => (
        <div key={appointment.id} className="appointment-container">
          <div className="appointment-info-container">
            <span className="appointment-wrapper">
              <span>{appointment.date} - {appointment.hour}</span>
              <span className="price">{appointment?.price} din</span>
            </span>
            <span className="appointment-wrapper">
              <span>{appointment.name}</span>
              <span>{appointment.service}</span>
            </span>
            <span className="appointment-wrapper">
              <span>{appointment?.material}</span>
              <span>{appointment?.note}</span>
            </span>
          </div>
        </div>
      ))}
      <NavBar />
    </div>
  );
}
