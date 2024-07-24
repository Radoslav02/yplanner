import { useState } from "react";
import "./NewMaterialModal.scss"
import { Material } from "../../models/material";

interface NewMaterialProps {
    close: () => void;
    confirm(material: Material): void;
  }
  
  export default function NewMaterialModal(props: NewMaterialProps) {
    const { close, confirm } = props;
  
    const [manifacturer, setManifacturer] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [color, setColor] = useState<string>("");
    const [type, setType] = useState<string>("");
  
    const handleSave = () => {
      const newMaterial: Material = {
        manifacturer,
        price,
        color,
        type,
      };
      confirm(newMaterial);
    };
  
    return (
      <div className="new-modal-container">
        <div className="new-modal-content">
          <div className="new-modal-heading">Novi klijent</div>
          <form className="new-modal-form">
            <div className="new-form-group">
              <label className="titles">Proizvodjac:</label>
              <input
                type="text"
                onChange={(e) => setManifacturer(e.target.value)}
                required
              />
            </div>
            <div className="new-form-group">
              <label className="titles">Tip:</label>
              <input type="text" onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="new-form-group">
              <label className="titles">Boja:</label>
              <input type="text" onChange={(e) => setColor(e.target.value)} />
            </div>
            <div className="new-form-group">
              <label className="titles">Nabavna cena:</label>
              <input type="number" onChange={(e) => setPrice(parseInt(e.target.value))} />
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
  