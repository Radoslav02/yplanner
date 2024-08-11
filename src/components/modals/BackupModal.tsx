import "./CalendarModal.scss";

interface BackupModalProps {
    backupAppointments(): Promise<void>
    setBackupClicked: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BackupModal(props: BackupModalProps) {
    const { backupAppointments, setBackupClicked } = props;

    function handleChange(input: string) {

        if (input !== 'rasagay') return

        backupAppointments();
        setBackupClicked(false);
    }

    return (
        <div className="calendar-container">
            <div className="calendar-content">
                <div className="new-modal-heading">Unesite šifru za preuzimanje dokumenta</div>
                <div style={{ textAlign: 'center' }}>
                    <input
                        type="text"// Use formatted date string
                        onChange={(e) => handleChange(e.target.value)}
                    />
                </div>
                <div className="new-modal-buttons-wrapper">
                    <button onClick={() => setBackupClicked(false)}>zanemari</button>
                </div>
            </div>
        </div>
    );
}
