/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Home.scss";
import AppointmentCard from "../AppointmentCard/AppointmentCard";
import { truncateDateString } from "../../helpers/truncateDateString";
import { addOneMonth } from "../../helpers/addOneMonth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Appointment } from "../../models/appointment";
import DeleteModal from "../modals/DeleteModal";
import NewAppointmentModal from "../modals/NewAppointmentModal";
import EditAppointmentModal from "../modals/EditAppointmentModal";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarModal from "../modals/CalendarModal";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import BackupModal from "../modals/BackupModal";
import { subtractOneMonth } from "../../helpers/substactOneMonth";

export default function Home() {
  const [monthDays, setMonthDays] = useState<string[]>([] as string[]);
  const [relativeDay, setRelativeDay] = useState<Date>(new Date());
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>(
    [] as Appointment[]
  );
  const [defaultDate, setDefaultDate] = useState<string>("");
  const [deleteClicked, setDeleteClicked] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>(
    {} as Appointment
  );
  const [addAppointmentClicked, setAddAppointmentClick] =
    useState<boolean>(false);
  const [editAppointmentClicked, setEditAppointmentClicked] =
    useState<boolean>(false);
  const [calendarClicked, setCalendarClicked] = useState<boolean>(false);
  const [backupClicked, setBackupClicked] = useState<boolean>(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.uid) {
      fetchAppointments();
    }
  }, [user]);

  useEffect(() => {
    setMonthDays(calcMonthDays());
  }, [relativeDay]);

  // New effect to set the focus to the current day
  useEffect(() => {
    setRelativeDay(new Date());
  }, []);

  async function fetchAppointments() {
    try {
      const appointmentsCollectionRef = collection(
        db,
        `users/${user!.uid}/appointments`
      );
      const appointmentDocs = await getDocs(appointmentsCollectionRef);
      const appointments = appointmentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointmentsData(appointments as Appointment[]);
    } catch (error) {
      toast.error("Greška pri dobavljanju termina");
    }
  }

  async function backupAppointments() {
    try {
      const jsonData = JSON.stringify(appointmentsData, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `appointments_backup_${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Uspešno preuzeta kolekcija termina");
    } catch (error) {
      toast.error("Desila se greška pri preuzimanju");
    }
  }

  async function deleteAppointment(appointmentId: string) {
    try {
      const appointmentDocRef = doc(
        db,
        `users/${user!.uid}/appointments/${appointmentId}`
      );
      await deleteDoc(appointmentDocRef);
      setAppointmentsData(
        appointmentsData.filter(
          (appointment: Appointment) => appointment.id !== appointmentId
        )
      );
      toast.success("Termin uspešno obrisan");
      closeDeleteModal();
    } catch (error) {
      toast.error("Error deleting appointment");
    }
  }

  async function addAppointment(newAppointment: Appointment) {
    try {
      const appointmentCollectionRef = collection(
        db,
        `users/${user!.uid}/appointments`
      );
      await addDoc(appointmentCollectionRef, newAppointment);
      toast.success("Termin uspešno dodat");
      fetchAppointments();
    } catch (error) {
      toast.error("Greška pri dodavanju termina");
    }
  }

  async function editAppointment(newClient: Appointment) {
    try {
      const appointmentDocRef = doc(
        db,
        `users/${user!.uid}/appointments/${newClient.id}`
      );
      await updateDoc(appointmentDocRef, newClient as { [key: string]: any });
      toast.success("Termin uspešno izmenjen");
      fetchAppointments();
    } catch (error) {
      toast.error("Greška pri izmeni termina");
    }
  }

  function calcMonthDays() {
    const currentDate = new Date(relativeDay);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Get the last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = [];
    let date = firstDayOfMonth;
    while (date <= lastDayOfMonth) {
      daysInMonth.push(truncateDateString(new Date(date)));
      date.setDate(date.getDate() + 1);
    }

    return daysInMonth;
  }

  function filterAppointmentsByDate(monthDate: string) {
    let day = monthDate.slice(monthDate.indexOf("-") + 2);
    day = day.length === 1 ? "0" + day : day;
    if (!appointmentsData) return [];
    const data = appointmentsData;
    const matched = [] as Appointment[];
    data.forEach((appointment: Appointment) => {
      if (day === appointment.date) matched.push(appointment);
    });
    return matched;
  }

  function closeDeleteModal() {
    setDeleteClicked(false);
  }

  function confirmDelete() {
    deleteAppointment(selectedAppointment.id!);
  }

  function closeNewAppointment() {
    setAddAppointmentClick(false);
  }

  function closeEditAppointment() {
    setEditAppointmentClicked(false);
  }

  function saveAppointment(appointment: Appointment) {
    addAppointment(appointment);
    closeNewAppointment();
    fetchAppointments();
  }

  function changeAppointment(appointment: Appointment) {
    editAppointment(appointment);
    closeEditAppointment();
    fetchAppointments();
  }

  return (
    <div className="home-container">
      {backupClicked && (
        <BackupModal
          backupAppointments={backupAppointments}
          setBackupClicked={setBackupClicked}
        />
      )}
      {calendarClicked && (
        <CalendarModal
          setRelativeDay={setRelativeDay}
          setCalendarClicked={setCalendarClicked}
        />
      )}
      {editAppointmentClicked && (
        <EditAppointmentModal
          close={closeEditAppointment}
          confirm={changeAppointment}
          data={selectedAppointment}
        />
      )}
      {deleteClicked && (
        <DeleteModal
          heading={"termin"}
          close={closeDeleteModal}
          confirm={confirmDelete}
        />
      )}
      {addAppointmentClicked && (
        <NewAppointmentModal
          close={closeNewAppointment}
          confirm={saveAppointment}
          defaultDate={defaultDate}
        />
      )}
      <div
        className="left-swipe"
        onClick={() =>
          setRelativeDay((oldDate: Date) => subtractOneMonth(oldDate))
        }
      ></div>
      <div className="appointments-wrapper">
        {monthDays?.length &&
          monthDays.map((day: string, index: number) => (
            <AppointmentCard
              key={index}
              day={day}
              data={filterAppointmentsByDate(day)}
              setDeleteClicked={setDeleteClicked}
              setSelectedAppointment={setSelectedAppointment}
              setAppointmentClicked={setAddAppointmentClick}
              setDefaultDate={setDefaultDate}
              setEditAppointmentClicked={setEditAppointmentClicked}
            />
          ))}
      </div>
      <button
        className="calendar-icon"
        onClick={() => setCalendarClicked(true)}
      >
        <CalendarMonthIcon className="calendar" />
      </button>
      <button className="backup-icon" onClick={() => setBackupClicked(true)}>
        <CloudDownloadIcon className="calendar" />
      </button>
      <div
        className="right-swipe"
        onClick={() => setRelativeDay((oldDate: Date) => addOneMonth(oldDate))}
      ></div>
      <NavBar />
    </div>
  );
}
