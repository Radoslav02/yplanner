import './AppointmentCard.scss'


interface AppointmentCardProps {
    day: string
}

export default function AppointmentCard(props: AppointmentCardProps) {

    const { day } = props

    return (
        <div className="appointment-container">
            <div className='appointment-header'>{day}</div>
        </div>
    )
}
