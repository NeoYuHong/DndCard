import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Modal from "./Modal";
import ModalId from "./ModalId";
import { Utils } from "@/helpers/utils";

export default function EditModal({ editCard, setItems, items, setModifying }) {

    const modalId = ModalId.editcard;

    const [editedFields, setEditedFields] = useState(null);

    const title = useRef(null)
    const description = useRef(null)
    const value = useRef(null)
    const manualValue = useRef(null)

    useEffect(() => {

        if (editCard == null) return;

        // reset
        document.getElementById(`${modalId}invalid`).classList.add("hidden");

        if (editCard.manualValue?.length > 0)
            document.getElementById(`hintmanualvalue`).classList.remove("invisible");
        else
            document.getElementById(`hintmanualvalue`).classList.add("invisible");

        // Update fields
        title.current.value = editCard.title;
        description.current.value = editCard.description;
        value.current.value = editCard.value;
        manualValue.current.value = editCard.manualValue;

        setEditedFields(editCard);

    }, [editCard]);

    // Save changes
    const save = (e) => {

        e.preventDefault();

        // Validation regex
        const validateValue = new RegExp(/^[0-9]+$/);
        const validateManualValue = new RegExp(/^[0-9]*$/);

        // Show invalid alert
        if (!validateValue.test(value.current.value)) {
            document.getElementById(`${modalId}invalid`).classList.remove("hidden");
            document.getElementById(`${modalId}invalidmessage`).innerHTML = "Warning: Please input valid number for Value!";
            return
        }

        if (!validateManualValue.test(manualValue.current.value) && manualValue.current.value.length > 0) {
            document.getElementById(`${modalId}invalid`).classList.remove("hidden");
            document.getElementById(`${modalId}invalidmessage`).innerHTML = "Warning: Please input valid number for Manual Value!";
            return
        }

        // Hide invalid alert
        document.getElementById(`${modalId}invalid`).classList.add("hidden");

        // Close modal
        setModifying(false);
        document.getElementById(modalId).checked = false;

        // Save changes
        setItems((items) => ({
            ...items,
            Data: items['Data'].map((data) => {
                if (data.id == editCard.id)
                    return editedFields
                return data
            }),
        }));

    }

    if (editCard == null) return null;

    function setTitleField() {
        const newEditedFields = { ...editedFields };
        newEditedFields.title = title.current.value;
        setEditedFields(newEditedFields);
    }

    function setDescriptionField() {
        const newEditedFields = { ...editedFields };
        newEditedFields.description = description.current.value;
        setEditedFields(newEditedFields);
    }

    function setValue() {
        const newEditedFields = { ...editedFields };
        newEditedFields.value = value.current.value;
        setEditedFields(newEditedFields);
    }

    function setManualValue() {
        const newEditedFields = { ...editedFields };
        newEditedFields.manualValue = manualValue.current.value;
        if (manualValue.current.value.length > 0)
            document.getElementById(`hintmanualvalue`).classList.remove("invisible");
        else
            document.getElementById(`hintmanualvalue`).classList.add("invisible");
        setEditedFields(newEditedFields);
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
        <Modal id={modalId} closeElement={<CustomCloseButton />} className={'w-10/12 sm:w-7/12 max-w-5xl h-5/12'}>

            <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-7 w-6 items-center justify-center rounded-full ">
                    <svg class="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full pb-4">
                    <h3 class="text-lg font-semibold leading-6" id="modal-title">Edit card</h3>
                </div>
            </div>

            {/* Editing form */}
            <div onSubmit={save}>

                {/* Title */}
                <div className="grid grid-cols-3 py-2 w-full">
                    <label className="col-span-3 pb-2 sm:col-span-1 sm:pb-0" htmlFor={modalId + "title"}>Title: </label>
                    <input type="text" className="col-span-3 sm:col-span-2 input input-bordered input-sm w-full" onBlur={setTitleField} name={modalId + "title"} id={modalId + "title"} ref={title} />
                </div>

                {/* Description */}
                <div className="grid grid-cols-3 py-2">
                    <label className="col-span-3 pb-2 sm:col-span-1 sm:pb-0" htmlFor={modalId + "description"}>Description: </label>
                    <textarea rows="5" className="col-span-3 sm:col-span-2 input input-bordered input-sm w-full h-full" onBlur={setDescriptionField} name={modalId + "description"} id={modalId + "description"} defaultValue={editCard.description} ref={description}></textarea>
                </div>

                {/* Value */}
                <div className="grid grid-cols-3 py-2">
                    <label className="col-span-3 pb-2 sm:col-span-1 sm:pb-0" htmlFor={modalId + "value"}>Value {editCard.preUnit && `(${editCard.preUnit})`}:</label>
                    <input type="number" className="col-span-3 sm:col-span-2 input input-bordered input-sm w-full" onBlur={setValue} name={modalId + "value"} id={modalId + "value"} defaultValue={editCard.value} ref={value} />
                </div>

                {/* Overwrite */}
                <div className="grid grid-cols-3 py-2">
                    <label className="col-span-3 pb-2 sm:col-span-1 sm:pb-0" htmlFor={modalId + "manualvalue"}>Manual Value {editCard.preUnit && `(${editCard.preUnit})`}:</label>
                    <input onKeyDown={Utils.preventExponentialInput} type="number" className="col-span-3 sm:col-span-2 input input-bordered input-sm w-full" onBlur={setManualValue} name={modalId + "manualvalue"} id={modalId + "manualvalue"} defaultValue={editCard.manualValue ?? ''} ref={manualValue} />
                </div>

                <div id="hintmanualvalue" className="invisble justify-end">
                    <p className="text-orange-500 text-right text-sm">Manual Value will overwrite Value! Leave it empty if you do not wish to overwrite.</p>
                </div>

            </div>

            {/* Save button */}
            <div class="pt-3 modal-action">
                <button type="button" className="hover:cursor-pointer  inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300 sm:mt-0 sm:w-auto"
                    onClick={() => {
                        setModifying(false);
                        document.getElementById(modalId).checked = false;
                    }}
                >
                    Cancel
                </button>

                <button type="button" className="w-full  justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                    onClick={save}
                >
                    Save
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