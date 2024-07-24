import "./ShowMaterialProfileModal.scss"

interface ShowMaterialProfileModalProps {
    heading:string;
    color: string;
    manifacturer: string;
    type: string;
    price: number;
    close: () => void;
  }
  
  export default function ShowMaterialProfileModal(props: ShowMaterialProfileModalProps) {
    const {close, color, manifacturer, price, type } = props;
  
    return (
      <div className="profile-modal-container">
        <div className="profile-modal-content">
          <div className="profile-modal-heading">Klijent</div>
          <div className="profile-modal-text-container">
            <span className="titles">Proizvodjac:</span>
            <span className="description">{manifacturer}</span>
            <span className="titles">Tip:</span>
            <span className="description">{type}</span>
            <span className="titles">Boja:</span>
            <span className="description">{color}</span>
            <span className="titles">Nabavna cena:</span>
            <span className="description">{price}</span>
          </div>
          <div className="profile-modal-buttons-wrapper">
            <button onClick={close}>zatvori</button>
          </div>
        </div>
      </div>
    );
  }