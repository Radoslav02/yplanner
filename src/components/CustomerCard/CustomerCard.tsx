import "./CustomerCard.scss";
import CreateIcon from "@mui/icons-material/Create";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";

interface CustomerCardProps {
  name: string;
  phone: number;
}

export default function CustomerCard(props: CustomerCardProps) {
  const { name, phone } = props;

  return (
    <div className="client-container">
      <div className="client-info-container">
        <span className="client-name">{name}</span>
        <span className="client-phone">{phone}</span>
      </div>

      <div className="client-icons-container">
        <div className="profile-icon-container">
          <AccountCircleIcon sx={{ fontSize: 30 }} />
        </div>
        <div className="edit-icon-container">
          <CreateIcon sx={{ fontSize: 30 }} />
        </div>
        <div className="delete-icon-container">
          <DeleteIcon sx={{ fontSize: 30 }} />
        </div>
      </div>
    </div>
  );
}
