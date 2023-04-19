import Modal from "./Modal";

export default function DeleteModal({ editCard, setCards, cards }) {

    const modalId = "deletecard";

    const deleteCard = () => {
        const updatedCard = cards.filter((card) => card.id !== editCard.id);
        setCards(updatedCard);
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