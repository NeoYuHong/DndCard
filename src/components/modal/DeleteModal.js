import Modal from "./Modal";
import ModalId from "./ModalId";

export default function DeleteModal({ editCard, setItems, items }) {

    const modalId = ModalId.deletecard;

    const deleteCard = () => {
        setItems((items) => ({
            ...items,
            Data: items['Data'].filter((data) => data.id !== editCard.id),
        }));
    }

    if (editCard == null) return null;

    return (
        <Modal id={modalId} className="bg-red-800">
            {/* Title */}
            < h3 className="font-bold text-lg pb-2" > Are you sure you want to delete {editCard.title} ?</h3 >

            {/* Save button */}
            < div className="modal-action" >
                <label htmlFor={modalId} className="btn">No</label>
                <label htmlFor={modalId} className="btn" onClick={deleteCard}>Yes</label>
            </div >
        </Modal >
    )
}