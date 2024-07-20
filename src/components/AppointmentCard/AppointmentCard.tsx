import { Appointment } from '../../models/appointment';
import './AppointmentCard.scss'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

interface AppointmentCardProps {
    day: string
    data: Appointment[] | []
}

export default function AppointmentCard(props: AppointmentCardProps) {

    const { day, data } = props

    return (
        <div className="appointment-container">
            <div className='appointment-header'>{day.slice(0, -4)}</div>
            <div className='apointment-content'>
                {data.length ? (
                    data.map((appointment: Appointment) =>
                        <div key={appointment.id} className='appointment' id={appointment.done ? 'done' : ''}>
                            <p>{appointment.hour}h</p>
                            <p>{appointment.name}</p>
                            <p>{appointment.service}</p>
                            <div className='crud-icon-wrapper'>
                                <DeleteIcon className='icon'></DeleteIcon>
                            </div>
                        </div>
                    )
                ) : <div className='add-icon-wrapper'>
                    <AddCircleIcon sx={{ width: '80px', height: '80px', }} />
                </div>}
            </div>
        </div>
    )
}
