/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Appointment } from "../../models/appointment";
import "./Modals.scss";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Client } from "../../models/client";
import { db } from "../firebase";
import { toast } from "react-toastify";

interface NewAppointmentProps {
    close: () => void;
    confirm(appointment: Appointment): void;
    defaultDate: string;
}

export default function NewAppointmentModal(props: NewAppointmentProps) {
    const { close, confirm, defaultDate } = props;

    const { user } = useAuth();

    const [date, setDate] = useState<string>(
        new Date().toISOString().slice(0, 16)
    );
    const [client, setClient] = useState<string>("");
    const [service, setService] = useState<string>("");
    const [clientsData, setClientsData] = useState<Client[]>([] as Client[]);

    // Placeholder data for clients and services
    const services = ["Service 1", "Service 2", "Service 3"];

    useEffect(() => {
        fetchClients();
    }, []);

    const handleSave = () => {
        const newAppointment: any = {
            date,
            client,
            service,
        };
        confirm(newAppointment);
        addAppointment(newAppointment)
    };

    function formatDateToLocalInput(date: string) {
        const split = [...date.split(".")];
        return `${split[2]}-${split[1]}-${split[0]}T08:00`;
    }

    async function addAppointment(newClient: Appointment) {
        try {
            const clientsCollectionRef = collection(
                db,
                `users/${user!.uid}/appointments`
            );
            await addDoc(clientsCollectionRef, newClient);
            toast.success("Klijent uspešno dodat");
            close();
        } catch (error) {
            console.error("Error adding client:", error);
            toast.error("Error adding client");
        }
    }

    async function fetchClients() {
        try {
            const clientsCollectionRef = collection(db, `users/${user!.uid}/clients`);
            const clientDocs = await getDocs(clientsCollectionRef);
            const clientsData = clientDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setClientsData(clientsData as Client[]);
        } catch (error) {
            console.error("Error fetching clients");
            toast.error("Error fetching clients");
        }
    }

    return (
        <div className="modal-container">
            <div className="modal-content" style={{ height: "270px" }}>
                <div className="modal-heading">Nov termin</div>
                <form className="modal-form">
                    <div className="form-group">
                        <label htmlFor="date">Vreme</label>
                        <input
                            type="datetime-local"
                            defaultValue={formatDateToLocalInput(defaultDate)}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="client">Klijent</label>
                        <select
                            id="client"
                            value={client}
                            onChange={(e) => {
                                setClient(e.target.value)
                            }}
                            required
                        >
                            <option value="" disabled></option>
                            {clientsData
                                ?.map((client: Client) => client.name)
                                .map((client) => (
                                    <option key={client} value={client}>
                                        {client}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="service">Usluga</label>
                        <select
                            id="service"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                izaberi uslugu
                            </option>
                            {services.map((service) => (
                                <option key={service} value={service}>
                                    {service}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
                <div className="modal-buttons-wrapper">
                    <button onClick={handleSave}>sačuvaj</button>
                    <button onClick={close}>zanemari</button>
                </div>
            </div>
        </div>
    );
}
