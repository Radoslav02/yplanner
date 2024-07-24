/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Home.scss";
import AppointmentCard from "../AppointmentCard/AppointmentCard";
import { truncateDateString } from "../../helpers/truncateDateString";
import { addOneWeek } from "../../helpers/addOneWeek";
import { subtractOneWeek } from "../../helpers/subtractOneWeek";
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

export default function Home() {
  const [weekDays, setWeekDays] = useState<string[]>([] as string[]);
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

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.uid) {
      fetchAppointments();
    }
  }, [user]);

  useEffect(() => {
    setWeekDays(calcWeekDays());
  }, [relativeDay]);

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
      console.error("Error fetching appointments:", error);
      toast.error("Error fetching appointments");
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
      toast.success("Termin usešno obrisan");
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting appointment:", error);
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
    } catch (error) {
      console.error("Error adding termin:", error);
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
    } catch (error) {
      console.error("Error adding termin:", error);
      toast.error("Greška pri izmeni termina");
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

  function filterAppointmentsByDate(weekDate: string) {
    const day = weekDate.slice(weekDate.indexOf("-") + 2);
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
    setEditAppointmentClicked(false)
  }

  function saveAppointment(appointment: Appointment) {
    addAppointment(appointment);
    closeNewAppointment();
    fetchAppointments();
  }

  function changeAppointment(appointment: Appointment) {
    editAppointment(appointment)
    closeEditAppointment()
    fetchAppointments()
  }

  return (
    <div className="home-container">
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
          setRelativeDay((oldDate: Date) => subtractOneWeek(oldDate))
        }
      ></div>
      <div className="appointments-wrapper">
        {weekDays?.length &&
          weekDays.map((day: string) => (
            <div key={day}>
              <AppointmentCard
                day={day}
                data={filterAppointmentsByDate(day)}
                setDeleteClicked={setDeleteClicked}
                setSelectedAppointment={setSelectedAppointment}
                setAppointmentClicked={setAddAppointmentClick}
                setDefaultDate={setDefaultDate}
                setEditAppointmentClicked={setEditAppointmentClicked}
              />
            </div>
          ))}
      </div>
      <div
        className="right-swipe"
        onClick={() => setRelativeDay((oldDate: Date) => addOneWeek(oldDate))}
      ></div>
      <NavBar />
    </div>
  );
}
