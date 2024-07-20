/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Appointment } from '../../models/appointment';
import './Modals.scss';

interface NewAppointmentProps {
    close: () => void;
    confirm(appointment: Appointment): void;
    defaultDate: string
}

export default function NewAppointmentModal(props: NewAppointmentProps) {
    const { close, confirm, defaultDate } = props;

    // State variables
    const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 16));
    const [client, setClient] = useState<string>('');
    const [service, setService] = useState<string>('');

    // Placeholder data for clients and services
    const clients = ['Client A', 'Client B', 'Client C'];
    const services = ['Service 1', 'Service 2', 'Service 3'];

    const handleSave = () => {
        const newAppointment: any = {
            date,
            client,
            service,
        };
        confirm(newAppointment);
    };

    console.log(defaultDate);

    function formatDateToLocalInput(date: string) {
        const split = [...date.split('.')]
        return `${split[2]}-${split[1]}-${split[0]}T08:00`
    }

    return (
        <div className="modal-container">
            <div className="modal-content" style={{ height: '270px' }}>
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
                            onChange={(e) => setClient(e.target.value)}
                            required
                        >
                            <option value="" disabled>izaberi klijenta</option>
                            {clients.map((client) => (
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
                            <option value="" disabled>izaberi uslugu</option>
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
