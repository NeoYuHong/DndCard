import Modal from "@/components/modal/Modal";
import { Input } from "@/components/form/Input";
import { TextArea } from "@/components/form/TextBox";
import ModalId from "@/components/modal/ModalId";
import { InputValue } from "../form/InputValue";
import { CustomInput } from "../form/CustomInput";
import { Header } from "../form/Header";
import { useState } from "react";
import { Utils } from "@/helpers/utils";


export default function AddTemplateModal({ setItems }) {

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

        setItems((items) => ({
            Template: [...items.Template, parsedTemplate],
            Data: items.Data,
        }))

        document.getElementById(modalId).checked = false;

    };

    return (
        <Modal id={modalId} className={'w-10/12 sm:w-9/12 max-w-5xl h-5/12'}>

            {/* Header */}
            <Header title={'Add Template'} logo={
                <svg className="h-6 w-6 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" aria-hidden="true">
                    <g>
                        <rect fill="none" /></g><g>
                        <path d="M20,4H4C2.89,4,2.01,4.89,2.01,6L2,18c0,1.11,0.89,2,2,2h10v-2H4v-6h18V6C22,4.89,21.11,4,20,4z M20,8H4V6h16V8z M24,17v2 h-3v3h-2v-3h-3v-2h3v-3h2v3H24z" />
                    </g>
                </svg>
            } />

            {/* Form */}
            <Input label={'Name \n(Duplicate name will be remove when importing)'} id={`${modalId}name`} onBlur={onBlur} />
            <Input label={'Title'} id={`${modalId}title`} onBlur={onBlur} />
            <TextArea label={'Description'} id={`${modalId}description`} rows={4} onBlur={onBlur} />
            <Input label={'Pre Unit'} id={`${modalId}preunit`} onBlur={onBlur} />
            <Input label={'Post Unit'} id={`${modalId}postunit`} onBlur={onBlur} />
            <InputValue label={'Value'} id={`${modalId}value`} onBlur={onBlur} />
            <CustomInput label={'Color'} id={`${modalId}color`}>
                <input type="color" id={`${modalId}color`} className="w-full " onBlur={onBlur} />
            </CustomInput>
            <Input label={'Prompt'} id={`${modalId}prompt`} onBlur={onBlur} />
            <Input label={'Expression'} id={`${modalId}expression`} onBlur={onBlur} />

            {/* Cancel and Add button */}
            <div className="modal-action">
                <label type="button" htmlFor={modalId} className="hover:cursor-pointer inline-flex w-full justify-center rounded-md bg-white  px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300 sm:mt-0 sm:w-auto">
                    Cancel
                </label>

                <button type="button" htmlFor={modalId} className="w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" onClick={addCard} >
                    Add
                </button>
            </div>

        </Modal>
    )
}