import { useState } from "react";
import { Client } from "../../models/client";
import "./Modals.scss";

interface NewClientProps {
  close: () => void;
  confirm(client: Client): void;
}

export default function NewClientModal(props: NewClientProps) {
  const { close, confirm } = props;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState(0);
  const [instagram, setInstagram] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const handleSave = () => {
    const newClient: Client = {
      name,
      phone,
      instagram,
      email,
      note,
    };
    confirm(newClient);
  };

  return (
    <div className="modal-container">
      <div className="modal-content" style={{ height: "270px" }}>
        <div className="modal-heading">Novi klijent</div>
        <form className="modal-form">
          <div className="form-group">
            <label htmlFor="client">Ime</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="client">Telefon</label>
            <input type="number" onChange={(e) => setPhone(parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Instagram</label>
            <input type="text" onChange={(e) => setInstagram(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="service">E-mail</label>
            <input type="text" onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="service">Note</label>
            <input type="text" onChange={(e) => setNote(e.target.value)} />
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
