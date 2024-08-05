import "./CalendarModal.scss";

interface CalendarModalProps {
    setRelativeDay: React.Dispatch<React.SetStateAction<Date>>;
    setCalendarClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CalendarModal(props: CalendarModalProps) {
    const { setRelativeDay, setCalendarClicked } = props;

    // Format today's date to YYYY-MM-DD for compatibility with <input type="date">
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    function handleChange(date: string) {
        // Ensure the date string is in a supported format
        setRelativeDay(new Date(date));
        setCalendarClicked(false);
    }

    return (
        <div className="calendar-container">
            <div className="calendar-content">
                <div className="new-modal-heading">Izaberi datum</div>
                <div>
                    <input
                        type="date"
                        defaultValue={formatDate(new Date())} // Use formatted date string
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
