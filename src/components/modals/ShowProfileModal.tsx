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
  const { close, name, phone, instagram, mail, note } = props;

  return (
    <div className="profile-modal-container">
      <div className="profile-modal-content">
        <div className="profile-modal-heading">{props.heading}</div>
        <div className="profile-modal-text-container">
          <div className="profile-content-wrapper">
            <span className="titles">Ime:</span>
            <span className="description">{name}</span>
          </div>
          <div className="profile-content-wrapper">
            <span className="titles">Telefon:</span>
            <span className="description">{phone}</span>
          </div>
          <div className="profile-content-wrapper">
            <span className="titles">Insta:</span>
            <span className="description">{instagram}</span>
          </div>
          <div className="profile-content-wrapper">
            <span className="titles">E-mail:</span>
            <span className="description">{mail}</span>
          </div>
          <div className="profile-content-wrapper">
            <span className="titles">Note:</span>
            <span className="description">{note}</span>
          </div>
        </div>
        <div className="profile-modal-buttons-wrapper">
          <button onClick={close}>zatvori</button>
        </div>
      </div>
    </div>
  );
}
