import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Modal from "./Modal";
import ModalId from "./ModalId";

export default function EditModal({ editCard, setItems, items }) {

    const modalId = ModalId.editcard;

    const [editedFields, setEditedFields] = useState(null);

    const title = useRef(null)
    const description = useRef(null)
    const value = useRef(null)

    useEffect(() => {

        if (editCard == null) return;

        document.getElementById(`${modalId}invalid`).classList.add("hidden");

        // Update fields
        title.current.value = editCard.title;
        description.current.value = editCard.description;
        value.current.value = editCard.value;

        setEditedFields(editCard);

    }, [editCard]);

    // Save changes
    const save = () => {

        // Validation regex
        const isNumber = new RegExp(/^[0-9]+$/);

        // Show invalid alert
        if (!isNumber.test(value.current.value))
            return document.getElementById(`${modalId}invalid`).classList.remove("hidden");

        // Hide invalid alert
        document.getElementById(`${modalId}invalid`).classList.add("hidden");

        // Close modal
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
        newEditedFields.title = document.getElementById(modalId + "title").value;
        setEditedFields(newEditedFields);
    }

    function setDescriptionField() {
        const newEditedFields = { ...editedFields };
        newEditedFields.description = document.getElementById(modalId + "description").value;
        setEditedFields(newEditedFields);
    }

    function setValue() {
        const newEditedFields = { ...editedFields };
        newEditedFields.value = document.getElementById(modalId + "value").value;
        setEditedFields(newEditedFields);
    }

    return (
        <Modal id={modalId}>

            {/* Title */}
            <h3 className="font-bold text-lg pb-2">Editing {editCard.name}</h3>

            {/* Editing form */}
            <form>

                {/* Title */}
                <div className="grid grid-cols-2 py-2">
                    <label className="col-span-1" htmlFor={modalId + "title"}>Title: </label>
                    <input type="text" className="input input-bordered input-sm w-full max-w-xs" onBlur={setTitleField} name={modalId + "title"} id={modalId + "title"} ref={title} />
                </div>

                {/* Description */}
                <div className="grid grid-cols-2 py-2">
                    <label className="col-span-1" htmlFor={modalId + "description"}>Description: </label>
                    <input type="text" className="input input-bordered input-sm w-full max-w-xs" onBlur={setDescriptionField} name={modalId + "description"} id={modalId + "description"} defaultValue={editCard.description} ref={description} />
                </div>

                {/* Value */}
                <div className="grid grid-cols-2 py-2">
                    <label className="col-span-1" htmlFor={modalId + "value"}>Value {editCard.preUnit && `(${editCard.preUnit})`}:</label>
                    <input type="text" className="input input-bordered input-sm w-full max-w-xs" onBlur={setValue} name={modalId + "value"} id={modalId + "value"} defaultValue={editCard.value} ref={value} />
                </div>

            </form>

            {/* Save button */}
            <div className="modal-action" onClick={save}>
                <label className="btn">Save</label>
            </div>

            {/* Invalid alert */}
            <div className="alert alert-warning shadow-lg mt-5 hidden" id={`${modalId}invalid`}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>Warning: Please input valid number!</span>
                </div>
            </div>

        </Modal>
    )
}