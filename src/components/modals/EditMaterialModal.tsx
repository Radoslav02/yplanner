import { useEffect, useState } from "react";
import { Material } from "../../models/material";
import "./EditMaterialModal.scss";

interface EditMaterialProps {
  close: () => void;
  confirm(material: Material): void;
  color: string;
  manifacturer: string;
  type: string;
  price: string;
}

export default function EditMaterialModal(props: EditMaterialProps) {
  const { close, confirm, color, manifacturer, type, price } = props;

  const [materialColor, setMaterialColor] = useState(color);
  const [materialManifacturer, setMaterialManifacturer] = useState(manifacturer);
  const [materialType, setmaterialType] = useState(type);
  const [materialPrice, setMaterialPrice] = useState(price);


  useEffect(() => {
    setMaterialColor(color);
    setMaterialManifacturer(manifacturer);
    setmaterialType(type);
    setMaterialPrice(price);
  }, [color, manifacturer, type, price]);

  const handleSave = () => {
    const editedMaterial: Material = {
      color: materialColor,
      manifacturer: materialManifacturer,
      type: materialType,
      price: materialPrice,
    };
    confirm(editedMaterial);
  };

  return (
    <div className="edit-modal-container">
      <div className="edit-modal-content">
        <div className="edit-modal-heading">Izmena materijala</div>
        <form className="edit-modal-form">
          <div className="edit-form-group">
            <label className="titles">Proizvođač:</label>
            <input
              type="text"
              value={materialManifacturer}
              onChange={(e) => setMaterialManifacturer(e.target.value)}
              placeholder={manifacturer}
            />
          </div>
          <div className="edit-form-group">
            <label className="titles">Tip:</label>
            <input
              type="text"
              value={materialType}
              onChange={(e) => setmaterialType(e.target.value)}
              placeholder={type}
            />
          </div>
          <div className="edit-form-group">
            <label className="titles">Boja:</label>
            <input
              type="text"
              value={materialColor}
              onChange={(e) => setMaterialColor(e.target.value)}
              placeholder={color}
            />
          </div>
          <div className="edit-form-group">
            <label className="titles">Nabavna cena(din):</label>
            <input
              type="tel"
              value={materialPrice}
              onChange={(e) => setMaterialPrice(e.target.value)}
              placeholder={`${price}`}
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