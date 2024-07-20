import "./CustomerCard.scss";
import CreateIcon from "@mui/icons-material/Create";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";

interface CustomerCardProps{
  name:string
  phone:number
}

export default function CustomerCard(props: CustomerCardProps) {
  
  const {name} = props;
  const {phone} = props;

  return (
    <div className="customer-container">

      <div className="client-info-container">
          {name} {phone}
      </div>
      
      <div className="customer-icons-container">
        <div className="profile-icon-container">
          <AccountCircleIcon />
        </div>

        <div className="edit-icon-container">
          <CreateIcon />
        </div>

        <div className="delete-icon-container">
          <DeleteIcon />
        </div>
      </div>
    </div>
  );
}
