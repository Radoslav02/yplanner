import { useState, useEffect } from "react";
import { Client } from "../../models/client";
import "./EditClientModal.scss";

interface EditClientProps {
  close: () => void;
  confirm(client: Client): void;
  name: string;
  phone: number;
  email: string;
  instagram: string;
  note: string;
}

export default function EditClientModal(props: EditClientProps) {
  const { close, confirm, name, phone, email, instagram, note } = props;

  const [clientName, setClientName] = useState(name);
  const [clientPhone, setClientPhone] = useState(phone);
  const [clientInstagram, setClientInstagram] = useState(instagram);
  const [clientEmail, setClientEmail] = useState(email);
  const [clientNote, setClientNote] = useState(note);

  useEffect(() => {
    setClientName(name);
    setClientPhone(phone);
    setClientInstagram(instagram);
    setClientEmail(email);
    setClientNote(note);
  }, [name, phone, instagram, email, note]);

  const handleSave = () => {
    const editedClient: Client = {
      name: clientName,
      phone: clientPhone,
      instagram: clientInstagram,
      email: clientEmail,
      note: clientNote,
    };
    confirm(editedClient);
  };

  return (
    <div className="edit-modal-container">
      <div className="edit-modal-content">
        <div className="edit-modal-heading">Izmena klijenta</div>
        <form className="edit-modal-form">
          <div className="edit-form-group">
            <label className="titles">Ime</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder={name}
            />
          </div>
          <div className="edit-form-group">
            <label className="titles">Telefon</label>
            <input
              type="number"
              value={clientPhone}
              onChange={(e) => setClientPhone(parseInt(e.target.value))}
              placeholder={`${phone}`}
            />
          </div>
          <div className="edit-form-group">
            <label className="titles">Instagram</label>
            <input
              type="text"
              value={clientInstagram}
              onChange={(e) => setClientInstagram(e.target.value)}
              placeholder={instagram}
            />
          </div>
          <div className="edit-form-group">
            <label className="titles">E-mail</label>
            <input
              type="text"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder={email}
            />
          </div>
          <div className="edit-form-group">
            <label className="titles">Note</label>
            <textarea
              value={clientNote}
              onChange={(e) => setClientNote(e.target.value)}
              placeholder={note}
            />
          </div>
        </form>
        <div className="edit-modal-buttons-wrapper">
          <button onClick={handleSave}>sačuvaj</button>
          <button onClick={close}>zanemari</button>
        </div>
      </div>
    </div>
  );
}
