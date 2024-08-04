import "./Statistics.scss";
import NavBar from "../NavBar/NavBar";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { Appointment } from "../../models/appointment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Statistics() {
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>(
    [] as Appointment[]
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [generateClicked, setGenerateClicked] = useState<boolean>(false);
  const [filteredAppointmentsData, setFilteredAppointmentsData] = useState<
    Appointment[]
  >([] as Appointment[]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);

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
    if (!startDate && !endDate) {
      toast.error("Unesite poćetni i krajnji datum!");
      return;
    }
    if (!startDate) {
      toast.error("Unesite početni datum!");
      return;
    }
    if (!endDate) {
      toast.error("Unesite krajnji datum!");
      return;
    }

    const start = convertDateFormat(startDate);
    const end = convertDateFormat(endDate);

    const filtered = appointmentsData.filter((appointment) => {
      return (
        appointment.date >= start &&
        appointment.date <= end &&
        appointment.done === true
      );
    });

    let sumTotalIncome = 0;
    filtered.forEach((appointment) => {
      const price = appointment.price ? parseInt(appointment.price, 10) : 0;
      sumTotalIncome += price;
    });
    setTotalIncome(sumTotalIncome);

    let sumIncome = 0;
    filtered.forEach((appointment) => {
      const price = appointment.price ? parseInt(appointment.price, 10) : 0;
      sumIncome += price - 500;
    });
    setIncome(sumIncome);

    setFilteredAppointmentsData(filtered);
    setGenerateClicked(true);
  }

  async function handlePrintClicked() {
    const input = document.getElementById("generated-content-container");
    if (!input) return;
  
    const canvas = await html2canvas(input, { scale: 1 }); // Use scale 1 to avoid upscaling
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
  
    const imgWidth = 150; // Adjusted width
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
    const pageWidth = pdf.internal.pageSize.getWidth();
    const xOffset = (pageWidth - imgWidth) / 2; // Center horizontally
  
    pdf.addImage(imgData, "PNG", xOffset, 10, imgWidth, imgHeight); // Centered horizontally, 10 units margin from top
    let heightLeft = imgHeight - (pdf.internal.pageSize.getHeight() - 10);
  
    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(imgData, "PNG", xOffset, -heightLeft, imgWidth, imgHeight); // Continue adding the image with adjusted position
      heightLeft -= pdf.internal.pageSize.getHeight();
    }
  
    pdf.save("report.pdf");
  }
  
  
  
  

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
        ></input>
        <span>Do:</span>
        <input
          className="end-date-input-container"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        ></input>
      </div>

      <div className="generate-button-container">
        <button onClick={handleGenerateClicked} className="generate-button">
          Generiši
        </button>
      </div>
      {generateClicked && (
        <div id="generated-content-container" className="generated-content-container">
          <table>
            <thead>
              <tr>
                <th>Klijent</th>
                <th>Datum</th>
                <th>Cena</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointmentsData.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.name}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.price}</td>
                </tr>
              ))}
              <tr>
                <th>Ukupno klijenata:</th>
                <th>Ukupna zarada: </th>
                <th>Zarada sa troskovima: </th>
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
          <button onClick={handlePrintClicked} className="print-button">
            Štampaj
          </button>
        </div>
      )}
      <NavBar />
    </div>
  );
}
