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
import Select, { StylesConfig } from "react-select";
import { MultiValue, SingleValue } from "react-select";

interface NewAppointmentProps {
  close: () => void;
  confirm(appointment: Appointment): void;
  data: Appointment;
}

interface OptionType {
  label: string;
  value: string;
}

export default function EditAppointmentModal(props: NewAppointmentProps) {
  const { close, confirm, data } = props;
  const { user } = useAuth();

  const [date, setDate] = useState<string>(formatDateTime(data.date));
  const [selectedClient, setSelectedClient] = useState<OptionType | null>(null);
  const [selectedServices, setSelectedServices] = useState<OptionType[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<OptionType[]>([]);
  const [note, setNote] = useState<string>(data.note);
  const [done, setDone] = useState<boolean>(data.done);
  const [price, setPrice] = useState<string>(data.price ?? "0");
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [services, setServices] = useState<OptionType[]>([]);
  const [materials, setMaterials] = useState<OptionType[]>([]);

  useEffect(() => {
    fetchClients();
    fetchServices();
    fetchMaterials();
  }, []);

  useEffect(() => {
    // Set default selected services and materials if available
    if (data.service) {
      const defaultServices = data.service.split(", ").map((service) => ({
        label: service,
        value: service,
      }));
      setSelectedServices(defaultServices);
    }

    if (data.material) {
      const defaultMaterials = data.material.split(", ").map((material) => ({
        label: material,
        value: material,
      }));
      setSelectedMaterials(defaultMaterials);
    }

    // Set the default selected client
    if (data.name) {
      const defaultClient = clientsData.find(
        (client) => client.name === data.name
      );
      if (defaultClient && defaultClient.id) {
        // Ensure id is defined
        setSelectedClient({
          label: defaultClient.name,
          value: defaultClient.id,
        });
      }
    }
  }, [data.service, data.material, data.name, clientsData]);

  const handleSave = () => {
    const newAppointment: Appointment = {
      date: cutTimeFromDate(date),
      name: selectedClient ? selectedClient.label : "",
      id: data.id,
      service: selectedServices.map((option) => option.value).join(", "),
      note,
      material: selectedMaterials.map((option) => option.value).join(", "),
      price,
      done,
      hour: getHoursFromDate(date),
    };
    confirm(newAppointment);
  };

  const customStyles: StylesConfig<OptionType, true> = {
    input: (provided) => ({
      ...provided,
      display: "none", // Hides the input field
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "auto", // Adjusts the control height if needed
    }),
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
    return `${formatedDate[2]}-${formatedDate[1]}-${
      formatedDate[0].length === 1 ? "0" + formatedDate[0] : formatedDate[0]
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
      })) as Service[];

      const serviceOptions = servicesData.map((service) => ({
        label: service.type,
        value: service.type,
      }));

      setServices(serviceOptions);
    } catch (error) {
      console.error("Error fetching services");
      toast.error("Error fetching services");
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
      })) as Material[];

      const materialOptions = materialsData.map((material) => ({
        label: material.type,
        value: material.type,
      }));

      setMaterials(materialOptions);
    } catch (error) {
      console.error("Error fetching materials");
      toast.error("Error fetching materials");
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
            <Select
              className="multiple-select"
              id="client"
              value={selectedClient}
              onChange={(option: SingleValue<OptionType>) =>
                setSelectedClient(option)
              }
              options={clientsData
                .filter((client) => client.id) // Ensure id is not undefined
                .map((client) => ({
                  label: client.name,
                  value: client.id!, // Use non-null assertion to ensure id is a string
                }))}
              placeholder="Izaberite klijenta"
              isClearable
            />
          </div>
          <div className="form-group">
            <label htmlFor="service">Usluge</label>
            {services.length > 0 ? (
              <Select
                className="multiple-select"
                isMulti
                options={services}
                value={selectedServices}
                onChange={(selectedOptions: MultiValue<OptionType>) => {
                  setSelectedServices(selectedOptions as OptionType[]);
                }}
                styles={customStyles}
              />
            ) : (
              <div>Loading services...</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="material">Materijali</label>
            {materials.length > 0 ? (
              <Select
                className="multiple-select"
                isMulti
                options={materials}
                value={selectedMaterials}
                onChange={(selectedOptions: MultiValue<OptionType>) => {
                  setSelectedMaterials(selectedOptions as OptionType[]);
                }}
                styles={customStyles}
              />
            ) : (
              <div>Loading materials...</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="note">Beleška</label>
            <textarea
              rows={1}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="done">Odrađeno</label>
            <div>
              <input
                type="checkbox"
                id="done"
                name="done"
                defaultChecked={done}
                onChange={() => setDone((oldState: boolean) => !oldState)}
              />
            </div>
          </div>
          {done && (
            <div className="form-group">
              <label htmlFor="price">Cena</label>
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
        </form>
        <div className="modal-buttons-wrapper">
          <button onClick={handleSave}>sačuvaj</button>
          <button onClick={close}>zanemari</button>
        </div>
      </div>
    </div>
  );
}
