import "./Statistics.scss";
import NavBar from "../NavBar/NavBar";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { Appointment } from "../../models/appointment";
import { useReactToPrint } from "react-to-print";

export default function Statistics() {
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [generateClicked, setGenerateClicked] = useState<boolean>(false);
  const [filteredAppointmentsData, setFilteredAppointmentsData] = useState<Appointment[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);

  const { user } = useAuth();
  const printableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (user && user.uid) {
      fetchAppointments();
    }
  }, [user]);

  async function fetchAppointments() {
    try {
      const appointmentsCollectionRef = collection(db, `users/${user!.uid}/appointments`);
      const appointmentDocs = await getDocs(appointmentsCollectionRef);
      const appointmentsData = appointmentDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointmentsData(appointmentsData as Appointment[]);
    } catch (error) {
      toast.error("Greška pri dobavljanju termina");
    }
  }

  function convertDateFormat(date: string): string {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  }

  function handleGenerateClicked() {
    if (!startDate || !endDate) {
      toast.error("Unesite početni i krajnji datum!");
      return;
    }

    const start = convertDateFormat(startDate);
    const end = convertDateFormat(endDate);

    const filtered = appointmentsData.filter(appointment => 
      appointment.date >= start &&
      appointment.date <= end &&
      appointment.done === true
    );

    let sumTotalIncome = 0;
    let sumIncome = 0;
    filtered.forEach(appointment => {
      const price = appointment.price ? parseInt(appointment.price, 10) : 0;
      sumTotalIncome += price;
      sumIncome += price - 500;
    });

    setTotalIncome(sumTotalIncome);
    setIncome(sumIncome);
    setFilteredAppointmentsData(filtered);
    setGenerateClicked(true);
  }

  const handlePrint = useReactToPrint({
    content: () => printableRef.current as HTMLTableElement,
    documentTitle: `Izveštaj ${startDate} - ${endDate}`,
  });

  return (
    <div className="statistics-container-wrapper">
      <div className="statistics-title-container">Izveštaj</div>
      <div className="date-inputs-container">
        <span>Od:</span>
        <input
          className="start-date-input-container"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span>Do:</span>
        <input
          className="end-date-input-container"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="generate-button-container">
        <button onClick={handleGenerateClicked} className="generate-button">
          Generiši
        </button>
      </div>
      {generateClicked && (
        <div className="generated-content-container">
          <table ref={printableRef}>
            <thead>
              <tr>
                <th>Klijent</th>
                <th>Datum</th>
                <th>Cena</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointmentsData.map(appointment => (
                <tr key={appointment.id}>
                  <td>{appointment.name}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.price}</td>
                </tr>
              ))}
              <tr>
                <th>Ukupno klijenata:</th>
                <th>Ukupna zarada:</th>
                <th>Zarada sa troškovima:</th>
              </tr>
              <tr>
                <td>{filteredAppointmentsData.length}</td>
                <td>{totalIncome}</td>
                <td>{income}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {generateClicked && (
        <div className="print-button-container">
          <button className="print-button" onClick={handlePrint}>
            Štampaj
          </button>
        </div>
      )}
      <NavBar />
    </div>
  );
}