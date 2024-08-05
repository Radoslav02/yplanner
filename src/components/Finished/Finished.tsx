/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef } from "react";
import { Appointment } from "../../models/appointment";
import NavBar from "../NavBar/NavBar";
import "./Finished.scss";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, query, orderBy, startAfter, where } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";

export default function Finished() {
  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState<any>(null); // Store the last fetched document
  const [hasMore, setHasMore] = useState(true); // Flag to check if there are more appointments
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const appointmentIds = useRef<Set<string>>(new Set()); // Track added appointment IDs

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.uid && !appointmentsData.length) {
      fetchAppointments();
    }
  }, [user]);


  const fetchAppointments = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const appointmentsCollectionRef = collection(
        db,
        `users/${user.uid}/appointments`
      );

      // Create a query with ordering and pagination
      const appointmentsQuery = query(
        appointmentsCollectionRef,
        where("done", "==", true),
        orderBy("date"),  // Assuming date is a field in the appointment
        orderBy("hour"),  // Assuming hour is a field in the appointment
        startAfter(lastVisible || 0), // Start after the last visible document
        // limit(10) // Fetch 10 documents per page
      );

      const appointmentDocs = await getDocs(appointmentsQuery);
      console.log(appointmentDocs);
      const newAppointments = appointmentDocs.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

      const uniqueAppointments = newAppointments.filter(
        (appointment: any) => !appointmentIds.current.has(appointment.id)
      );

      uniqueAppointments.forEach((appointment: any) => {
        appointmentIds.current.add(appointment.id);
      });

      // Update state with new appointments
      setAppointmentsData((prev) => [...prev, ...uniqueAppointments]);
      setLastVisible(appointmentDocs.docs[appointmentDocs.docs.length - 1]); // Update the last visible document
      setHasMore(!appointmentDocs.empty); // Check if there are more documents
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Greška pri dobavljanju termina");
    } finally {
      setLoading(false);
    }
  }, [user, lastVisible,]);

  // Infinite scroll event listener
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const bottomOffset = 100; // Pixels from the bottom of the page to trigger loading more
    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const threshold = document.documentElement.offsetHeight - bottomOffset;

    if (scrollPosition >= threshold) {
      fetchAppointments();
    }
  }, [fetchAppointments, loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter appointments based on the search query
  const filteredData = appointmentsData.filter((appointment) => {
    return (
      appointment.name.toLowerCase().includes(searchQuery) ||
      appointment.service.toLowerCase().includes(searchQuery) ||
      appointment.material?.toLowerCase().includes(searchQuery) ||
      appointment.price.toString().includes(searchQuery) ||
      appointment.note?.toString().includes(searchQuery)

    );
  });

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
  const sortedData = filteredData.slice().sort((a, b) => {
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
          value={searchQuery}
          onChange={handleInputChange} // Update search query on input change
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
      {!sortedData.length && <div className="end-of-results">Nema termina po ovom kriterijumu pretrage</div>}
      {loading && <div className="loading">Učitavanje...</div>}
      {!hasMore && <div className="end-of-results">Nema više termina</div>}
      <NavBar />
    </div>
  );
}
