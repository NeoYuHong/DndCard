import Modal from "@/components/modal/Modal";
import { nanoid } from "nanoid";
import { useRef } from "react";
import ModalId from "./ModalId";

export default function AddModal({ setItems, editCard }) {

    const modalId = ModalId.addcard;

    const valueInput = useRef(null)

    function removeCard() {

        // Close modal
        document.getElementById(modalId).checked = false;

        // Add card
        // TODO: setItems affecting closing of modal, using timeout to "fix" it. Find better method 
        setTimeout(() => {

            // delete
            return setItems((items) => ({
                ...items,
                Data: items['Data'].filter((data) => {
                    if (data.new) {
                        return false
                    }
                    return true;
                }),
            }));

        }, 100);

    }

    function addCard() {

        // Validation regex
        const isNumber = new RegExp(/^[0-9]+$/);

        // Show invalid alert
        if (!isNumber.test(valueInput.current.value))
            return document.getElementById(`${modalId}invalid`).classList.remove("hidden");

        // Hide invalid alert
        document.getElementById(`${modalId}invalid`).classList.add("hidden");

        if (!editCard) return;

        editCard.data.current.id = nanoid(11);
        editCard.data.current.value = valueInput.current.value;

        // Close modal
        document.getElementById(modalId).checked = false;

        // Add card
        // TODO: setItems affecting closing of modal, using timeout to "fix" it. Find better method 
        setTimeout(() => {

            return setItems((items) => ({
                ...items,
                Data: items['Data'].filter((data) => !(items['Data'].length > 0 && data.id == 'tempfix')).map((data) => {
                    delete data.new;
                    return data;
                }),
            }));

        }, 100);

    };

    const Modalbody = () => {

        if (!editCard || !document.getElementById(modalId).checked) return;

        const card = editCard.data.current;

        return (
            <form>


                {/* Title */}
                <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex h-7 w-6 items-center justify-center rounded-full ">

                        <svg class="h-6 w-6 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" enable-background="new 0 0 24 24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" aria-hidden="true">
                            <g>
                                <rect fill="none" /></g><g>
                                <path d="M20,4H4C2.89,4,2.01,4.89,2.01,6L2,18c0,1.11,0.89,2,2,2h10v-2H4v-6h18V6C22,4.89,21.11,4,20,4z M20,8H4V6h16V8z M24,17v2 h-3v3h-2v-3h-3v-2h3v-3h2v3H24z" />
                            </g>
                        </svg>

                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full pb-4">
                        <h3 class="text-lg font-semibold leading-6" id="modal-title">Add card</h3>
                    </div>
                </div>

                {/* <h3 className="font-bold text-md pb-2">{card.prompt ?? `Enter value for ${card.title}`}</h3> */}

                {/* Form */}
                <div>
                    <div className="grid grid-cols-3 py-2">
                        <label className="col-span-3 pb-2 sm:col-span-2 sm:pb-0" htmlFor={"value"}>{card.prompt ?? `Enter value for ${card.title}`} {card.preUnit && `(${card.preUnit})`}:</label>
                        <input type="number" className="col-span-3 sm:col-span-1 input input-bordered input-sm w-full max-w-xs" defaultValue={card.value} ref={valueInput} />
                    </div>
                </div>

                {/* Add button */}
                <div class="modal-action">
                    <button type="button" htmlFor={modalId} className="hover:cursor-pointer  inline-flex w-full justify-center rounded-md bg-white  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300 sm:mt-0 sm:w-auto"
                        onClick={removeCard}
                    >
                        Cancel
                    </button>

                    <button type="button" htmlFor={modalId} className="w-full  justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                        onClick={addCard}
                    >
                        Add
                    </button>
                </div>

                {/* Invalid alert */}
                <div className="alert alert-warning shadow-lg mt-5 hidden" id={`${modalId}invalid`}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>Warning: Please input valid number!</span>
                    </div>
                </div>

            </form >
        )
    }

    const CustomCloseButton = () => {
        return (
            <button type="button" htmlFor={modalId} className="hover:cursor-pointer absolute right-6 top-4" onClick={removeCard}>✕</button>
        )
    }

    return (
        <Modal id={modalId} closeElement={<CustomCloseButton />}>
            <Modalbody />
        </Modal>
    )
}