import { Appointment } from "../../models/appointment";
import "./AppointmentCard.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";

interface AppointmentCardProps {
    day: string;
    data: Appointment[] | [];
    setDeleteClicked: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedAppointment: React.Dispatch<React.SetStateAction<string>>;
    setAppointmentClicked: React.Dispatch<React.SetStateAction<boolean>>;
    setDefaultDate: React.Dispatch<React.SetStateAction<string>>;
}

export default function AppointmentCard(props: AppointmentCardProps) {
    const {
        day,
        data,
        setDeleteClicked,
        setSelectedAppointment,
        setAppointmentClicked,
        setDefaultDate,
    } = props;

    return (
        <div className="appointment-container">
            <div className="appointment-header">{day.slice(0, -4)}</div>
            <div className="apointment-content">
                {data.length ? (
                    data.map((appointment: Appointment) => (
                        <div
                            key={appointment.id}
                            className="appointment"
                            id={appointment.done ? "done" : ""}
                        >
                            <span>
                                <p>{appointment.hour}h</p>
                                <p>{appointment.name}</p>
                                <p>{appointment.service}</p>
                            </span>
                            <div
                                className="crud-icon-wrapper"
                                onClick={() => {
                                    setDeleteClicked(true);
                                    setSelectedAppointment(appointment.id!);
                                }}
                            >
                                <DeleteIcon className="icon"></DeleteIcon>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="add-icon-wrapper">
                        <AddCircleIcon
                            sx={{ width: "80px", height: "80px" }}
                            onClick={() => {
                                setAppointmentClicked(true);
                                setDefaultDate(day.slice(day.indexOf("-") + 2));
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
