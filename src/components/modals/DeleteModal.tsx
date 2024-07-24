import "./NewAppointment.scss";

interface DeleteModalProps {
    heading: string;
    close: () => void;
    confirm: () => void;
}

export default function DeleteModal(props: DeleteModalProps) {
    const { heading, close, confirm } = props;

    return (
        <div className="modal-container">
            <div className="modal-content">
                <div className="modal-heading">Obriši</div>
                <p>{`Da li ste sigurni da želite da obrišete ${heading} ?`} </p>
                <div className="modal-buttons-wrapper">
                    <button onClick={confirm}>da</button>
                    <button onClick={close}>ne</button>
                </div>
            </div>
        </div>
    );
}
