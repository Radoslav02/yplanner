import { Appointment } from "../../models/appointment";
import "./AppointmentCard.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";

interface AppointmentCardProps {
    day: string;
    data: Appointment[] | [];
    setDeleteClicked: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedAppointment: React.Dispatch<React.SetStateAction<Appointment>>;
    setAppointmentClicked: React.Dispatch<React.SetStateAction<boolean>>;
    setDefaultDate: React.Dispatch<React.SetStateAction<string>>;
    setEditAppointmentClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AppointmentCard(props: AppointmentCardProps) {
    const {
        day,
        data,
        setDeleteClicked,
        setSelectedAppointment,
        setAppointmentClicked,
        setDefaultDate,
        setEditAppointmentClicked,
    } = props;

    // Helper function to convert hour string to a comparable number
    const parseHour = (hour: string) => {
        const [hours, minutes] = hour.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Sort the data array by hour
    const sortedData = data.slice().sort((a, b) => parseHour(a.hour) - parseHour(b.hour));

    return (
        <div className="appointment-container">
            <div className="appointment-header">
                {day.slice(0, -4)}
                <AddCircleIcon
                    sx={{ width: "30px", height: "30px" }}
                    className="icon"
                    onClick={() => {
                        setAppointmentClicked(true);
                        setDefaultDate(day.slice(day.indexOf("-") + 2));
                    }}
                />
            </div>
            <div className="apointment-content">
                {sortedData.length ? (
                    sortedData.map((appointment: Appointment) => (
                        <div
                            key={appointment.id}
                            className="appointment"
                            id={appointment.done ? "done" : ""}
                        >
                            <span
                                onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setEditAppointmentClicked(true);
                                }}
                            >
                                <p>{appointment.hour}h</p>
                                <p>{appointment.name}</p>
                                <p>{appointment.service}</p>
                            </span>
                            <div
                                className="crud-icon-wrapper"
                                onClick={() => {
                                    setDeleteClicked(true);
                                    setSelectedAppointment(appointment);
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