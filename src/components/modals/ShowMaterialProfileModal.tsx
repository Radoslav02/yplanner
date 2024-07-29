import "./ShowMaterialProfileModal.scss"

interface ShowMaterialProfileModalProps {
    heading:string;
    color: string;
    manifacturer: string;
    type: string;
    price: string;
    close: () => void;
  }
  
  export default function ShowMaterialProfileModal(props: ShowMaterialProfileModalProps) {
    const {close, color, manifacturer, price, type } = props;
  
    return (
      <div className="profile-modal-container">
        <div className="profile-modal-content">
          <div className="profile-modal-heading">Materijal</div>
          <div className="profile-modal-text-container">
            <div className="profile-content-wrapper">
            <label className="titles">Proizvođač:</label>
            <span className="description">{manifacturer}</span>
            </div>
            <div className="profile-content-wrapper">
            <label className="titles">Tip:</label>
            <span className="description">{type}</span>
            </div>
            <div className="profile-content-wrapper">
            <label className="titles">Boja:</label>
            <span className="description">{color}</span>
            </div>
            <div className="profile-content-wrapper">
            <label className="titles">Cena(din):</label>
            <span className="description">{price}</span>
            </div>
          </div>
          <div className="profile-modal-buttons-wrapper">
            <button onClick={close}>zatvori</button>
          </div>
        </div>
      </div>
    );
  }