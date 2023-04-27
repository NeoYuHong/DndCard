import Modal from "@/components/modal/Modal";
import { Input } from "@/components/form/Input";
import { TextArea } from "@/components/form/TextBox";
import ModalId from "@/components/modal/ModalId";
import { InputValue } from "../form/InputValue";
import { CustomInput } from "../form/CustomInput";
import { Header } from "./Header";
import { useState } from "react";
import { Utils } from "@/helpers/utils";
import { AddCardLogo } from "../logo/AddCardLogo";
import { ExpressionHint, NameHint } from "../dndTemplate/FieldHint";


export default function AddTemplateModal({ items, setItems }) {

    const modalId = ModalId.addtemplate;
    const [template, setTemplate] = useState({
        "name": "",
        "title": "",
        "description": "",
        "preUnit": "",
        "postUnit": "",
        "value": "",
        "color": "",
        "prompt": "",
        "expression": ""
    })

    function onBlur(e) {
        let { id, value } = e.target;
        switch (id) {
            case `${modalId}name`:
                id = "name";
                break;
            case `${modalId}title`:
                id = "title";
                break;
            case `${modalId}description`:
                id = "description";
                break;
            case `${modalId}preunit`:
                id = "preUnit";
                break;
            case `${modalId}postunit`:
                id = "postUnit";
                break;
            case `${modalId}value`:
                id = "value";
                break;
            case `${modalId}color`:
                id = "color";
                break;
            case `${modalId}prompt`:
                id = "prompt";
                break;
            case `${modalId}expression`:
                id = "expression";
                break;
        }
        setTemplate((template) => ({
            ...template,
            [id]: value
        }))
    }

    function addCard(e) {

        e.preventDefault();

        const parsedTemplate = { ...template, id: Utils.generateId() }

        const findDuplication = items.Template.find((item) => item.name === template.name) == -1

        console.log(findDuplication)

        setItems((items) => ({
            Template: [...items.Template, parsedTemplate],
            Data: items.Data,
        }))

        document.getElementById(modalId).checked = false;

    };

    return (
        <Modal id={modalId} className={'w-10/12 sm:w-9/12 max-w-5xl h-5/12'}>

            {/* Header */}
            <Header title={'Add Template'} logo={<AddCardLogo />} />

            {/* Form */}
            <Input label={'Name'} id={`${modalId}name`} onBlur={onBlur} popupContent={<NameHint />} />

            <Input label={'Title'} id={`${modalId}title`} onBlur={onBlur} />
            <TextArea label={'Description'} id={`${modalId}description`} rows={4} onBlur={onBlur} />
            <Input label={'Pre Unit'} id={`${modalId}preunit`} onBlur={onBlur} />
            <Input label={'Post Unit'} id={`${modalId}postunit`} onBlur={onBlur} />
            <InputValue label={'Value'} id={`${modalId}value`} onBlur={onBlur} />

            <CustomInput label={'Color'} id={`${modalId}color`}>
                <input type="color" id={`${modalId}color`} className="w-full " onBlur={onBlur} />
            </CustomInput>

            <Input label={'Prompt'} id={`${modalId}prompt`} onBlur={onBlur} />
            <Input label={'Expression'} id={`${modalId}expression`} onBlur={onBlur} popupContent={<ExpressionHint />} />

            {/* Cancel and Add button */}
            <div className="modal-action">
                <label type="button" htmlFor={modalId} className="hover:cursor-pointer inline-flex w-full justify-center rounded-md bg-white  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300 sm:mt-0 sm:w-auto">
                    Cancel
                </label>

                <button type="button" htmlFor={modalId} className="w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" onClick={addCard} >
                    Add
                </button>
            </div>

        </Modal >
    )
}