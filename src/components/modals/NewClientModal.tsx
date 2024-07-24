import { useState } from "react";
import { Client } from "../../models/client";
import "./NewClientModal.scss";

interface NewClientProps {
  close: () => void;
  confirm(client: Client): void;
}

export default function NewClientModal(props: NewClientProps) {
  const { close, confirm } = props;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
    <div className="new-modal-container">
      <div className="new-modal-content">
        <div className="new-modal-heading">Novi klijent</div>
        <form className="new-modal-form">
          <div className="new-form-group">
            <label className="titles">Ime:</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="new-form-group">
            <label className="titles">Telefon:</label>
            <input type="tel" onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="new-form-group">
            <label className="titles">Instagram:</label>
            <input type="text" onChange={(e) => setInstagram(e.target.value)} />
          </div>
          <div className="new-form-group">
            <label className="titles">E-mail:</label>
            <input type="text" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="new-form-group">
            <label className="titles">Note:</label>
            <textarea
              onChange={(e) => setNote(e.target.value)}
              placeholder={note}
            />
          </div>
        </form>
        <div className="new-modal-buttons-wrapper">
          <button onClick={handleSave}>sačuvaj</button>
          <button onClick={close}>zanemari</button>
        </div>
      </div>
    </div>
  );
}
