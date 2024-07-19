import './AppointmentCard.scss'
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface AppointmentCardProps {
    day: string
}

export default function AppointmentCard(props: AppointmentCardProps) {

    const { day } = props

    return (
        <div className="appointment-container">
            <div className='appointment-header'>{day}</div>
            <div className='apointment-content'>
                <div className='add-icon-wrapper'>
                    <AddCircleIcon sx={{ width: '80px', height: '80px', }} />
                </div>
            </div>
        </div>
    )
}
