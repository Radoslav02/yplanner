/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Appointment } from "../../models/appointment";
import "./NewAppointment.scss";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { Client } from "../../models/client";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { Service } from "../../models/service";

interface NewAppointmentProps {
    close: () => void;
    confirm(appointment: Appointment): void;
    defaultDate: string;
}

export default function NewAppointmentModal(props: NewAppointmentProps) {
    const { close, confirm, defaultDate } = props;

    const { user } = useAuth();

    const [date, setDate] = useState<string>(defaultDate)
    const [client, setClient] = useState<string>("");
    const [service, setService] = useState<string>("");
    const [note, setNote] = useState<string>('')
    const [clientsData, setClientsData] = useState<Client[]>([] as Client[]);
    const [services, setServices] = useState<Service[]>([] as Service[])

    useEffect(() => {
        fetchClients()
        fetchServices()
    }, []);

    const handleSave = () => {
        const newAppointment: Appointment = {
            date: cutTimeFromDate(date),
            name: client,
            service,
            note,
            done: false,
            hour: getHoursFromDate(date),
        };

        confirm(newAppointment);
    };

    function formatDateToLocalInput(date: string) {
        const split = [...date.split(".")];
        return `${split[2]}-${split[1]}-${split[0].length === 1 ? '0' + split[0] : split[0]}T08:00`;
    }

    function getHoursFromDate(date: string) {
        const index = date.indexOf('T')
        if (index > 0) {
            return date.slice(index + 1)
        } else return '08:00'
    }

    function cutTimeFromDate(date: string) {
        const index = date.indexOf('T')
        if (index > 0) {
            const cutedDate = date.slice(0, index)
            const array = cutedDate.split('-')
            return `${array[2]}.${array[1]}.${array[0]}`
        } else {
            return date
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

    async function fetchServices() {
        try {
            const serviceCollectionRef = collection(db, `users/${user!.uid}/service`);
            const servicesDocs = await getDocs(serviceCollectionRef);
            const servicesData = servicesDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setServices(servicesData as Service[]);
        } catch (error) {
            console.error("Error fetching clients");
            toast.error("Error fetching clients");
        }
    }

    return (
        <div className="modal-container">
            <div className="modal-content">
                <div className="modal-heading">Nov termin</div>
                <form className="modal-form">
                    <div className="form-group">
                        <label htmlFor="date">Vreme</label>
                        <input
                            type="datetime-local"
                            defaultValue={formatDateToLocalInput(date)}
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
                            <option value="" disabled>izaberi klijenta</option>
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
                            {services.map((service: Service) => service.type).map((service) => (
                                <option key={service} value={service}>
                                    {service}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Beleška</label>
                        <textarea
                            rows={1}
                            onChange={(e) => setNote(e.target.value)}
                        />
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
