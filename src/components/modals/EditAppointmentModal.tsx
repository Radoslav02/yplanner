/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Material } from "../../models/material";

interface NewAppointmentProps {
    close: () => void;
    confirm(appointment: Appointment): void;
    data: Appointment;
}

export default function EditAppointmentModal(props: NewAppointmentProps) {
    const { close, confirm, data } = props;

    const { user } = useAuth();

    const [date, setDate] = useState<string>(formatDateTime(data.date));
    const [client, setClient] = useState<string>(data.name);
    const [service, setService] = useState<string>(data.service);
    const [material, setMaterial] = useState<string>(data.material ?? "");
    const [note, setNote] = useState<string>(data.note);
    const [done, setDone] = useState<boolean>(data.done);
    const [price, setPrice] = useState<string>(data.price ?? "0");
    const [clientsData, setClientsData] = useState<Client[]>([] as Client[]);
    const [services, setServices] = useState<Service[]>([] as Service[]);
    const [materials, setMaterials] = useState<Material[]>([] as Material[]);

    // Placeholder data for clients and services

    useEffect(() => {
        fetchClients();
        fetchServices();
        fetchMaterials();
    }, []);

    const handleSave = () => {
        const newAppointment: Appointment = {
            date: cutTimeFromDate(date),
            name: client,
            id: data.id,
            service,
            note,
            material,
            price,
            done,
            hour: getHoursFromDate(date),
        };
        confirm(newAppointment);
    };

    function getHoursFromDate(date: string) {
        const index = date.indexOf("T");
        if (index > 0) {
            return date.slice(index + 1);
        } else return "08:00";
    }

    function cutTimeFromDate(date: string) {
        const index = date.indexOf("T");
        if (index > 0) {
            const cutedDate = date.slice(0, index);
            const array = cutedDate.split("-");
            return `${array[2]}.${array[1]}.${array[0]}`;
        } else {
            return date;
        }
    }

    function formatDateTime(date: string) {
        const formatedDate = date.split(".");
        return `${formatedDate[2]}-${formatedDate[1]}-${formatedDate[0].length === 1 ? "0" + formatedDate[0] : formatedDate[0]
            }T${data.hour}`;
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

    async function fetchMaterials() {
        try {
            const materialCollectionRef = collection(
                db,
                `users/${user!.uid}/materials`
            );
            const materialsDocs = await getDocs(materialCollectionRef);
            const materialsData = materialsDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMaterials(materialsData as Material[]);
        } catch (error) {
            console.error("Error fetching clients");
            toast.error("Error fetching clients");
        }
    }

    return (
        <div className="modal-container">
            <div className="modal-content">
                <div className="modal-heading">Izmeni termin</div>
                <form className="modal-form">
                    <div className="form-group">
                        <label htmlFor="date">Vreme</label>
                        <input
                            type="datetime-local"
                            defaultValue={date}
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
                                setClient(e.target.value);
                            }}
                            required
                        >
                            <option value="" disabled>
                                izaberi klijenta
                            </option>
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
                            {services
                                .map((service: Service) => service.type)
                                .map((service) => (
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
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="service">Odrađeno</label>
                        <div>
                            <input
                                type="checkbox"
                                id="status"
                                name="status"
                                defaultChecked={done}
                                onChange={() => setDone((oldState: boolean) => !oldState)}
                            />
                        </div>
                    </div>
                    {done && (
                        <div className="form-group">
                            <label htmlFor="service">Cena</label>
                            <div>
                                <input
                                    type="number"
                                    id="price"
                                    defaultValue={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    {done && (
                        <div className="form-group">
                            <label htmlFor="service">Materijal</label>
                            <select
                                id="service"
                                defaultValue={data.material}
                                onChange={(e) => setMaterial(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    izaberi materijal
                                </option>
                                {materials
                                    .map((material: Material) => material.type)
                                    .map((material: string) => (
                                        <option key={material} value={material}>
                                            {material}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}
                </form>
                <div className="modal-buttons-wrapper">
                    <button onClick={handleSave}>sačuvaj</button>
                    <button onClick={close}>zanemari</button>
                </div>
            </div>
        </div>
    );
}
