import "./Modals.scss";

interface ProfileModalProps {
  heading: string;
  name: string;
  phone: number;
  instagram: string;
  mail: string;
  note: string;
  close: () => void;
}

export default function ProfileModal(props: ProfileModalProps) {
  const {close, name, phone, instagram, mail, note } = props;

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-heading">Klijent</div>
        <div className="client-modal-content">
          <span>Ime: {name}</span>
          <span>Broj telefona: {phone}</span>
          <span>Instagram: {instagram}</span>
          <span>E-mail: {mail}</span>
          <span>Note: {note}</span>
        </div>
        <div className="modal-buttons-wrapper">
          <button onClick={close}>zatvori</button>
        </div>
      </div>
    </div>
  );
}
