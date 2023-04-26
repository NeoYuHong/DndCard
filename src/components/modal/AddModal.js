import Modal from "@/components/modal/Modal";
import { nanoid } from "nanoid";
import { useRef } from "react";
import ModalId from "./ModalId";
import { Utils } from "@/helpers/utils";

export default function AddModal({ setItems, editCard }) {

    const modalId = ModalId.addcard;

    const value = useRef(null)
    const title = useRef(null)
    const description = useRef(null)
    const manualValue = useRef(null)

    function removeCard() {

        // Close modal
        document.getElementById(modalId).checked = false;
        document.getElementById(`${modalId}invalid`).classList.add("hidden");

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

    function addCard(e) {

        e.preventDefault();

        // Validation regex
        const validateValue = new RegExp(/^[0-9.]+$/);
        const validateManualValue = new RegExp(/^[0-9.]*$/);

        // if there is manual value 
        if (manualValue.current.value.length > 0) {

            // check if manual value is valid
            if (!validateManualValue.test(manualValue.current.value)) {
                document.getElementById(`${modalId}invalid`).classList.remove("hidden");
                document.getElementById(`${modalId}invalidmessage`).innerHTML = "Warning: Please input valid number for Manual Value!";
                return
            }

        } else {

            // check if value is valid
            if (!validateValue.test(value.current.value)) {
                document.getElementById(`${modalId}invalid`).classList.remove("hidden");
                document.getElementById(`${modalId}invalidmessage`).innerHTML = "Warning: Please input valid number for Value!";
                return
            }

        }

        // Hide invalid alert
        document.getElementById(`${modalId}invalid`).classList.add("hidden");

        if (!editCard) return;

        editCard.data.current.id = nanoid(11);
        editCard.data.current.title = title.current.value;
        editCard.data.current.description = description.current.value;
        editCard.data.current.value = value.current.value;
        editCard.data.current.manualValue = manualValue.current.value;

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

    function onBlurManual(e) {
        if (e.currentTarget.value.length > 0) {
            document.getElementById(`${modalId}hintmanualvalue`).classList.remove("hidden");
            value.current.disabled = true;
            value.current.readonly = true;
        } else {
            document.getElementById(`${modalId}hintmanualvalue`).classList.add("hidden");
            value.current.disabled = false;
            value.current.readonly = false;
        }
    }

    function onBlurValue(e) {
        document.getElementById(`${modalId}calvalue`).value = Utils.computeValue(value.current.value, editCard.data.current.expression);
    }

    const ModalHeader = () => {
        return (
            <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-7 w-6 items-center justify-center rounded-full">

                    <svg className="h-6 w-6 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" aria-hidden="true">
                        <g>
                            <rect fill="none" /></g><g>
                            <path d="M20,4H4C2.89,4,2.01,4.89,2.01,6L2,18c0,1.11,0.89,2,2,2h10v-2H4v-6h18V6C22,4.89,21.11,4,20,4z M20,8H4V6h16V8z M24,17v2 h-3v3h-2v-3h-3v-2h3v-3h2v3H24z" />
                        </g>
                    </svg>

                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full pb-4">
                    <h3 className="text-lg font-semibold leading-6" id="modal-title">Add card</h3>
                </div>
            </div>
        )
    }


    const ModalForm = () => {

        if (!editCard || !document.getElementById(modalId).checked) return;

        const card = editCard.data.current;

        return (
            <div>

                {/* Title */}
                <div className="grid grid-cols-3 py-2 w-full">
                    <label className="col-span-3 pb-2 sm:col-span-1 sm:pb-0" htmlFor={modalId + "title"}>Title: </label>
                    <input autoFocus={true} type="text" className="col-span-3 sm:col-span-2 input input-bordered input-sm w-full" name={modalId + "title"} id={modalId + "title"} defaultValue={card.title} ref={title} />
                </div>

                {/* Description */}
                <div className="grid grid-cols-3 py-2">
                    <label className="col-span-3 pb-2 sm:col-span-1 sm:pb-0" htmlFor={modalId + "description"}>Description: </label>
                    <textarea rows="5" className="col-span-3 sm:col-span-2 input input-bordered input-sm w-full h-full" name={modalId + "description"} id={modalId + "description"} defaultValue={card.description} ref={description}></textarea>
                </div>

                {/* Value */}
                <div className="grid grid-cols-3 py-2">
                    <label className="col-span-3 pb-2 sm:col-span-1 sm:pb-0" htmlFor={modalId + "value"}>{editCard.data.current.prompt ?? 'Value'}{editCard.data.current.preUnit && ` (${editCard.data.current.preUnit})`}:</label>
                    <div className="col-span-3 sm:col-span-2 w-full grid grid-cols-2 gap-3">
                        <input type="text" className="input input-bordered input-sm w-full" name={modalId + "value"} id={modalId + "value"} defaultValue={card.value} ref={value} onBlur={onBlurValue} />
                        <input type="number" className="input input-bordered input-sm w-full col-span-1 bg-base-200" readOnly disabled id={`${modalId}calvalue`} />
                    </div>
                </div>

                {/* Manual */}
                <div className="grid grid-cols-3 py-2">
                    <label className="col-span-3 pb-2 sm:col-span-1 sm:pb-0" htmlFor={modalId + "manualvalue"}>Manual Value {card.preUnit && `(${card.preUnit})`}:</label>
                    <input onKeyDown={Utils.preventExponentialInput} type="number" className="col-span-3 sm:col-span-2 input input-bordered input-sm w-full" onBlur={onBlurManual} name={modalId + "manualvalue"} id={modalId + "manualvalue"} defaultValue={card.manualValue ?? ''} ref={manualValue} />
                </div>

                <p id={`${modalId}hintmanualvalue`} className="text-orange-500 text-right text-sm hidden justify-end">Manual Value will overwrite Value! Leave it empty if you do not wish to overwrite.</p>

            </div>
        )
    }

    const CustomCloseButton = () => {
        return (
            <button type="button" htmlFor={modalId} className="hover:cursor-pointer absolute right-6 top-4" onClick={removeCard}>✕</button>
        )
    }

    return (
        <Modal id={modalId} className={'w-10/12 sm:w-7/12 max-w-5xl h-5/12'} closeElement={<CustomCloseButton />}>

            <ModalHeader />
            <ModalForm />

            {/* Add button */}
            <div className="modal-action">
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
                    <span id={`${modalId}invalidmessage`}>Warning: Please input valid number!</span>
                </div>
            </div>

        </Modal>
    )
}