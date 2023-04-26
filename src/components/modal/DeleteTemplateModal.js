import { Utils } from "@/helpers/utils";
import Modal from "./Modal";
import ModalId from "./ModalId";
import { Header } from "./Header";
import { DeleteCardLogo } from "../logo/DeleteCardLogo";

export default function DeleteTemplateModal({ editCard, setItems, items, setModifying }) {

    const modalId = ModalId.deletetemplate;

    function deleteCard() {
        setItems((items) => {
            return ({
                ...items,
                Template: items['Template'].filter((data) => data.id !== editCard.id),
            })
        })
        setModifying(false);
        document.getElementById(modalId).checked = false;
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
            {editCard && <>

                <Header className={`text-base font-semibold leading-6`} title={`Delete Template`} logo={<DeleteCardLogo />}>
                    <div className="mt-2">
                        <p className="text-sm ">Are you sure you want to delete {editCard.title}? This action cannot be undone.</p>
                    </div>
                </Header>
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

            </>}
        </Modal>
    )
}