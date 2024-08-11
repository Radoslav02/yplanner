import "./CalendarModal.scss";

interface BackupModalProps {
    backupAppointments(): Promise<void>
    backupClients(): Promise<void>
    backupMaterials(): Promise<void>
    setBackupClicked: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BackupModal(props: BackupModalProps) {
    const { backupAppointments, setBackupClicked,  backupClients, backupMaterials } = props;

    function handleChange(input: string) {

        if (input !== 'stefanretard') return

        backupAppointments();
        backupClients();
        backupMaterials();
        setBackupClicked(false);
    }

    return (
        <div className="calendar-container">
            <div className="calendar-content">
                <div className="new-modal-heading">Unesite šifru za preuzimanje dokumenta</div>
                <div style={{ textAlign: 'center' }}>
                    <input
                        type="text"
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
