import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Modal from "./Modal";
import ModalId from "./ModalId";
import { Utils } from "@/helpers/utils";
import { Header } from "./Header";
import { Input } from "../form/Input";
import { TextArea } from "../form/TextBox";
import { CustomInput } from "../form/CustomInput";
import { InputValue } from "../form/InputValue";
import { EditCardLogo } from "../logo/EditCardLogo";
import { ExpressionHint, NameHint } from "../dndTemplate/FieldHint";

export default function EditTemplateModal({ editCard, setItems, items, setModifying }) {

    const modalId = ModalId.edittemplate;

    useEffect(() => {

        if (editCard == null) return;

        document.getElementById(`${modalId}name`).value = editCard.name;
        document.getElementById(`${modalId}title`).value = editCard.title;
        document.getElementById(`${modalId}description`).value = editCard.description;
        document.getElementById(`${modalId}preunit`).value = editCard.preUnit;
        document.getElementById(`${modalId}postunit`).value = editCard.postUnit;
        document.getElementById(`${modalId}value`).value = editCard.value;
        document.getElementById(`${modalId}color`).value = editCard.color;
        document.getElementById(`${modalId}prompt`).value = editCard.prompt;
        document.getElementById(`${modalId}expression`).value = editCard.expression;

    }, [editCard]);

    const closeModal = () => {
        setModifying(false);
        document.getElementById(modalId).checked = false;
    }

    // Save changes
    const save = (e) => {

        e.preventDefault();

        const editedFields = {
            ...editCard,
            name: document.getElementById(`${modalId}name`).value,
            title: document.getElementById(`${modalId}title`).value,
            description: document.getElementById(`${modalId}description`).value,
            preUnit: document.getElementById(`${modalId}preunit`).value,
            postUnit: document.getElementById(`${modalId}postunit`).value,
            value: document.getElementById(`${modalId}value`).value,
            color: document.getElementById(`${modalId}color`).value,
            prompt: document.getElementById(`${modalId}prompt`).value,
            expression: document.getElementById(`${modalId}expression`).value,
        }

        closeModal();

        // Save changes
        setItems((items) => ({
            ...items,
            Template: items['Template'].map((data) => {
                if (data.id == editCard.id)
                    return editedFields
                return data
            }),
        }));

    }

    const CustomCloseButton = () => {
        return (
            <button type="button" htmlFor={modalId} className="hover:cursor-pointer absolute right-6 top-4" onClick={closeModal}>✕</button>
        )
    }

    return (
        <Modal id={modalId} closeElement={<CustomCloseButton />} className={'w-10/12 sm:w-7/12 max-w-5xl h-5/12'}>

            {/* Header */}
            <Header title={'Edit template'} logo={<EditCardLogo />} />

            {/* Editing form */}
            {editCard != null &&
                <div onSubmit={save}>

                    <Input label={'Name'} id={`${modalId}name`} popupContent={<NameHint />} defaultValue={editCard.name} />
                    <Input label={'Title'} id={`${modalId}title`} />
                    <TextArea label={'Description'} id={`${modalId}description`} rows={4} />
                    <Input label={'Pre Unit'} id={`${modalId}preunit`} />
                    <Input label={'Post Unit'} id={`${modalId}postunit`} />
                    <InputValue label={'Value'} id={`${modalId}value`} />

                    <CustomInput label={'Color'} id={`${modalId}color`}>
                        <input type="color" id={`${modalId}color`} className="w-full" />
                    </CustomInput>

                    <Input label={'Prompt'} id={`${modalId}prompt`} />
                    <TextArea label={'Expression'} id={`${modalId}expression`} rows={1} popupContent={<ExpressionHint />} />

                </div>
            }

            {/* Save button */}
            <div className="pt-3 modal-action">
                <button type="button" className="hover:cursor-pointer  inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300 sm:mt-0 sm:w-auto" onClick={closeModal} >
                    Cancel
                </button>

                <button type="button" className="w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" onClick={save}>
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