import Modal from "./Modal";
import ModalId from "./ModalId";

export default function DeleteModal({ editCard, setItems, items, setModifying }) {

    const modalId = ModalId.deletecard;

    function deleteCard() {
        setItems((items) => ({
            ...items,
            Data: items['Data'].filter((data) => data.id !== editCard.id),
        }));
        setModifying(false);
        document.getElementById(modalId).checked = false;
    }

    const ModalBody = () => {

        if (!editCard) return null;

        return (
            <>
                {/* Title */}
                <h3 className="font-bold text-lg pb-2" > Are you sure you want to delete {editCard.title}?  </h3>

                {/* Save button */}
                < div className="modal-action" >
                    <label htmlFor={modalId} className="btn">No</label>
                    <label htmlFor={modalId} className="btn" onClick={deleteCard}>Yes</label>
                </div >
            </>
        )
    }

    const CustomCloseButton = () => {
        return (
            <button type="button" htmlFor={modalId} className="hover:cursor-pointer absolute right-6 top-4" onClick={() => {
                setModifying(false)
                document.getElementById(modalId).checked = false;
            }}>✕</button>
        )
    }

    return (
        <Modal id={modalId} className="bg-red-800" closeElement={<CustomCloseButton />}>
            <ModalBody />
        </Modal>
    )
}