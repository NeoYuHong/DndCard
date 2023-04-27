import Modal from "@/components/modal/Modal";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import ModalId from "./ModalId";
import { Utils } from "@/helpers/utils";
import { Header } from "./Header";
import { AddCardLogo } from "../logo/AddCardLogo";
import { Input } from "../form/Input";
import { TextArea } from "../form/TextBox";
import { InputValue } from "../form/InputValue";

export default function AddModal({ setItems, editCard }) {

    const modalId = ModalId.addcard;

    useEffect(() => {

        if (editCard == null || !document.getElementById(modalId).checked) return;
        const card = editCard.data.current;

        document.getElementById(`${modalId}title`).value = card.title;
        document.getElementById(`${modalId}description`).value = card.description;
        document.getElementById(`${modalId}value`).value = card.value;
        document.getElementById(`${modalId}calvalue`).value = Utils.computeValue(card.value, card.expression);
        document.getElementById(`${modalId}manualvalue`).value = card.manualValue;

        document.getElementById(`${modalId}value`).disabled = card.manualValue != null;
        document.getElementById(`${modalId}value`).readonly = card.manualValue != null;

    }, [editCard])


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

        const editedFields = {
            ...editCard.data.current,
            title: document.getElementById(`${modalId}title`).value,
            description: document.getElementById(`${modalId}description`).value,
            value: document.getElementById(`${modalId}value`).value,
            manualValue: document.getElementById(`${modalId}manualvalue`).value,
        }

        e.preventDefault();

        // Validation regex
        const validateValue = new RegExp(/^[0-9.]+$/);
        const validateManualValue = new RegExp(/^[0-9.]*$/);

        // if there is manual value 
        if (editedFields.manualValue.length > 0) {

            // check if manual value is valid
            if (!validateManualValue.test(editedFields.manualValue)) {
                document.getElementById(`${modalId}invalid`).classList.remove("hidden");
                document.getElementById(`${modalId}invalidmessage`).innerHTML = "Warning: Please input valid number for Manual Value!";
                return
            }

        } else {

            // check if value is valid
            if (!validateValue.test(editedFields.value)) {
                document.getElementById(`${modalId}invalid`).classList.remove("hidden");
                document.getElementById(`${modalId}invalidmessage`).innerHTML = "Warning: Please input valid number for Value!";
                return
            }

        }

        // Hide invalid alert
        document.getElementById(`${modalId}invalid`).classList.add("hidden");

        if (!editCard) return;

        // Close modal
        document.getElementById(modalId).checked = false;

        // Add card
        // TODO: setItems affecting closing of modal, using timeout to "fix" it. Find better method 
        setTimeout(() => {

            return setItems((items) => ({
                ...items,
                Data: items['Data'].filter((data) => !(items['Data'].length > 0 && data.id == 'tempfix')).map((data) => {
                    if (data.id == editCard.id) {
                        delete editedFields.new;
                        return editedFields;
                    }
                    delete data.new;
                    return data;
                }),
            }));

        }, 100);

    };

    function onBlurManual(e) {

        const value = document.getElementById(`${modalId}value`);
        const warnManual = document.getElementById(`${modalId}warnmanual`);

        if (e.currentTarget.value.length > 0) {
            warnManual.classList.remove("hidden");
            value.disabled = true;
            value.readonly = true;
        } else {
            warnManual.classList.add("hidden");
            value.disabled = false;
            value.readonly = false;
        }
    }

    function onBlurValue(e) {
        const card = editCard.data.current;
        document.getElementById(`${modalId}calvalue`).value = Utils.computeValue(document.getElementById(`${modalId}value`).value, card.expression);
    }

    const CustomCloseButton = () => {
        return (
            <button type="button" htmlFor={modalId} className="hover:cursor-pointer absolute right-6 top-4" onClick={removeCard}>✕</button>
        )
    }

    return (
        <Modal id={modalId} className={'w-10/12 sm:w-7/12 max-w-5xl h-5/12'} closeElement={<CustomCloseButton />}>

            {/* Header */}
            <Header title={'Add Card'} logo={<AddCardLogo />} />

            {/* Form */}
            {editCard && <>

                <Input autoFocus={true} label={'Title'} id={`${modalId}title`} />
                <TextArea label={'Description'} id={`${modalId}description`} rows={4} />

                {/* Value */}
                <div className="grid grid-cols-3 py-2">
                    <label className="col-span-3 pb-2 sm:col-span-1 sm:pb-0" htmlFor={modalId + "value"}>{editCard.data?.current.prompt ?? 'Value'}{editCard.data?.current.preUnit && ` (${editCard.data?.current.preUnit})`}:</label>
                    <div className="col-span-3 sm:col-span-2 w-full grid grid-cols-2 gap-3">
                        <input type="text" className="input input-bordered input-sm w-full" name={modalId + "value"} id={modalId + "value"} onBlur={onBlurValue} />
                        <input type="number" className="input input-bordered input-sm w-full col-span-1 bg-base-200" readOnly disabled id={`${modalId}calvalue`} />
                    </div>
                </div>

                <InputValue label={'Manual value'} id={`${modalId}manualvalue`} onBlur={onBlurManual} />

                <p id={`${modalId}warnmanual`} className="text-orange-500 text-right text-sm hidden justify-end">Manual Value will overwrite Value! Leave it empty if you do not wish to overwrite.</p>

            </>}

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