import "./NavBar.scss";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import { useNavigate } from "react-router-dom";

export default function NavBar() {

  const navigate = useNavigate();

  return (
    <div className="navBar-container">
      <button onClick={() => navigate("/statistics")} className="statisticsIcon-container">
        <TrendingUpIcon sx={{ fontSize: 40 }} />
      </button>

      <button onClick={() => navigate("/finished")} className="checkboxIcon-container">
        <CheckBoxIcon sx={{ fontSize: 40 }} />
      </button>

      <button onClick={() => navigate("/home")} className="homeIcon-container">
        <HomeOutlinedIcon sx={{ fontSize: 60 }} />
      </button>

      <button onClick={() => navigate("/customers")} className="clientsIcon-container">
        <GroupsOutlinedIcon sx={{ fontSize: 40 }} />
      </button>

      <button onClick={() => navigate("/materials")} className="materials-container">
        <ColorLensOutlinedIcon sx={{ fontSize: 40 }} />
      </button>
    </div>
  );
}
