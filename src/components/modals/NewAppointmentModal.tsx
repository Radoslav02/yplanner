import { useEffect, useState } from "react";
import { Appointment } from "../../models/appointment";
import "./NewAppointment.scss";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { Client } from "../../models/client";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { Service } from "../../models/service";
import Select, { MultiValue, StylesConfig } from "react-select";
import AsyncSelect from 'react-select/async';

interface NewAppointmentProps {
  close: () => void;
  confirm(appointment: Appointment): void;
  defaultDate: string;
}

interface ServiceOption {
  label: string;
  value: string;
}

export default function NewAppointmentModal(props: NewAppointmentProps) {
  const { close, confirm, defaultDate } = props;
  const { user } = useAuth();

  const [date, setDate] = useState<string>(defaultDate);
  const [client, setClient] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<MultiValue<ServiceOption>>([]);
  const [note, setNote] = useState<string>("");
  const [clientsData, setClientsData] = useState<Client[]>([] as Client[]);

  useEffect(() => {
    fetchClients();
    fetchServices();
  }, []);

  const handleSave = () => {
    console.log("Selected Services:", selectedServices);

    if (Array.isArray(selectedServices)) {
      const newAppointment: Appointment = {
        date: cutTimeFromDate(date),
        name: client,
        service: selectedServices.map((s) => s.value).join(","), // Extract values from selected options
        note,
        done: false,
        hour: getHoursFromDate(date),
      };

      confirm(newAppointment);
    } else {
      console.error("Selected services is not an array");
      toast.error("Error with selected services");
    }
  };

  function formatDateToLocalInput(date: string) {
    const split = [...date.split(".")];
    return `${split[2]}-${split[1]}-${
      split[0].length === 1 ? "0" + split[0] : split[0]
    }T08:00`;
  }

  const customStyles: StylesConfig<ServiceOption, true> = {
    input: (provided) => ({
      ...provided,
      display: "none", // Hides the input field
      paddingLeft: "10px"
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "auto", // Adjusts the control height if needed
      paddingLeft: "10px"
    }),


  };

  const serviceOptions = services.map(service => ({
    label: service.type, // Assuming 'name' is a property of the Service model
    value: service.id,   // Assuming 'id' is a unique identifier for the Service model
  }));

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
      console.error("Error fetching clients", error);
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
      console.error("Error fetching services", error);
      toast.error("Error fetching services");
    }
  }

  const loadClients = async (inputValue: string) => {
    if (!inputValue) return [];
    // Filter clientsData based on the inputValue
    return clientsData
      .filter((client) => client.name.toLowerCase().startsWith(inputValue.toLowerCase()))
      .map((client) => ({
        label: client.name,
        value: client.name,
      }));
  };

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
            <AsyncSelect
              loadOptions={loadClients}
              onChange={(selectedOption) => setClient(selectedOption?.value || "")}
              isClearable 
              className="multiple-select"
              classNamePrefix="select"
              placeholder="Izaberite klijenta"
            />
          </div>
          <div className="form-group">
            <label htmlFor="service">Usluge</label>
            <Select
              className="multiple-select"
              isMulti
              options={serviceOptions} 
              value={selectedServices}
              onChange={(selectedOptions: MultiValue<ServiceOption>) => {
                setSelectedServices(selectedOptions);
              }}
              styles={customStyles}
              placeholder="Izaberite usluge"
            />
          </div>
          <div className="form-group">
            <label htmlFor="note">Beleška</label>
            <textarea rows={1} onChange={(e) => setNote(e.target.value)} />
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
