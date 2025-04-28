interface ModalProps {
    message: string;
    onClose: () => void;
}

export function Modal({ message, onClose }: ModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-lg font-bold mb-2">Notification</h3>
                <p className="mb-4">{message}</p>
                <button className="btn btn-primary" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}