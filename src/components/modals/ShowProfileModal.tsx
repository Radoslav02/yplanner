import "./ShowProfileModal.scss";

interface ShowProfileModalProps {
  heading: string;
  name: string;
  phone: string;
  instagram: string;
  mail: string;
  note: string;
  close: () => void;
}

export default function ProfileModal(props: ShowProfileModalProps) {
  const {close, name, phone, instagram, mail, note } = props;

  return (
    <div className="profile-modal-container">
      <div className="profile-modal-content">
        <div className="profile-modal-heading">Klijent</div>
        <div className="profile-modal-text-container">
          <span className="titles">Ime:</span>
          <span className="description">{name}</span>
          <span className="titles">Telefona:</span>
          <span className="description">{phone}</span>
          <span className="titles">Instagram:</span>
          <span className="description">{instagram}</span>
          <span className="titles">E-mail:</span>
          <span className="description">{mail}</span>
          <span className="titles">Note:</span>
          <span className="description">{note}</span>
        </div>
        <div className="profile-modal-buttons-wrapper">
          <button onClick={close}>zatvori</button>
        </div>
      </div>
    </div>
  );
}
