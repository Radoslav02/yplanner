import "./CalendarModal.scss";

interface CalendarModalProps {
    setRelativeDay: React.Dispatch<React.SetStateAction<Date>>;
    setCalendarClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CalendarModal(props: CalendarModalProps) {
    const { setRelativeDay, setCalendarClicked } = props;

    function handleChange(date: string) {
        setRelativeDay(new Date(date))
        setCalendarClicked(false)
    }

    return (
        <div className="calendar-container">
            <div className="calendar-content">
                <div className="new-modal-heading">Izaberi datum</div>
                <div>
                    <input
                        type="date"
                        onChange={(e) => handleChange(e.target.value)}
                    />
                </div>
                <div className="new-modal-buttons-wrapper">
                    <button onClick={() => setCalendarClicked(false)}>zanemari</button>
                </div>
            </div>
        </div>
    );
}
