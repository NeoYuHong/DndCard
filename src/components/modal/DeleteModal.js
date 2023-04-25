import { Utils } from "@/helpers/utils";
import Modal from "./Modal";
import ModalId from "./ModalId";

export default function DeleteModal({ editCard, setItems, items, setModifying }) {

    const modalId = ModalId.deletecard;

    function deleteCard() {
        setItems((items) => {
            if (items.Data.length == 1)
                return ({
                    ...items,
                    Data: [Utils.tempfix],
                })
            return ({
                ...items,
                Data: items['Data'].filter((data) => data.id !== editCard.id),
            })
        })
        setModifying(false);
        document.getElementById(modalId).checked = false;
    }

    const ModalBody = () => {

        if (!editCard) return null;

        return (
            <>

                <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-7 w-6 items-center justify-center rounded-full ">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 className="text-base font-semibold leading-6" id="modal-title">Delete card</h3>
                        <div className="mt-2">
                            <p className="text-sm ">Are you sure you want to delete {editCard.title}? This action cannot be undone.</p>
                        </div>
                    </div>
                </div>


                <div className="modal-action">
                    <button type="button" className="hover:cursor-pointer inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => {
                            setModifying(false);
                            document.getElementById(modalId).checked = false;
                        }}
                    >
                        Cancel
                    </button>

                    <button type="button" className="w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={deleteCard}
                    >
                        Delete
                    </button>
                </div>

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
        <Modal id={modalId} closeElement={<CustomCloseButton />}>
            <ModalBody />
        </Modal>
    )
}