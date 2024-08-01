import "./Statistics.scss";
import NavBar from "../NavBar/NavBar";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { Appointment } from "../../models/appointment";

export default function Statistics() {
  // const [appointmentsData, setAppointmentsData] = useState<Appointment[]>(
  //   [] as Appointment[]
  // );
   const [startDate, setStartDate] = useState<string>("");
   const [endDate, setEndDate] = useState<string>("");

  // const { user } = useAuth();

  // useEffect(() => {
  //   if (user && user.uid) {
  //     fetchAppointments();
  //   }
  // }, [user]);

  // async function fetchAppointments() {
  //   try {
  //     const appointmentsCollectionRef = collection(
  //       db,
  //       `users/${user!.uid}/appointments`
  //     );
  //     const appointmentDocs = await getDocs(appointmentsCollectionRef);
  //     const appointmentsData = appointmentDocs.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setAppointmentsData(appointmentsData as Appointment[]);
  //   } catch (error) {
  //     console.error("Greška pri dobavljanju termina:", error);
  //     toast.error("Greška pri dobavljanju termina");
  //   }
  // }

  return (
    <div className="statistics-container-wrapper">
      <div className="statistics-title-container">Izveštaj</div>
      <div className="date-inputs-container">
        <span>Od:</span>
        <input 
          className="start-date-input-container"
          type="text"
          value={startDate}
          placeholder="dan.mes.god"
          pattern="\d{2}\.\d{2}\.\d{4}"
          onChange={e => setStartDate(e.target.value)}
        ></input>
        <span>Do:</span>
        <input
          className="end-date-input-container"
          type="text"
          value={endDate}
          placeholder="dan.mes.god"
          pattern="\d{2}\.\d{2}\.\d{4}"
          onChange={e => setEndDate(e.target.value)}
        ></input>
      </div>

      <div className="generate-button-container">
        <button className="generate-button">Generiši</button>

      </div>

      <NavBar />
    </div>
  );
}
