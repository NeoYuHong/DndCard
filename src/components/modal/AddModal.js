import Modal from "@/components/modal/Modal";
import { nanoid } from "nanoid";
import { useRef } from "react";
import ModalId from "./ModalId";

export default function AddModal({ setItems, items, editCard }) {

    const modalId = ModalId.addcard;

    const valueInput = useRef(null)

    const removeCard = (e) => {

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

    const addCard = (e) => {

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


            // return setItems((items) => ({
            //     ...items,
            //     Data: items['Data'].map((data) => {
            //         if (data.new) {
            //             const newData = { ...editCard.data.current }
            //             delete newData.new;
            //             console.log(newData)
            //             return newData
            //         }
            //         return data;
            //     }),
            // }));

            return setItems((items) => ({
                ...items,
                Data: items['Data'].map((data) => {
                    delete data.new;
                    return data;
                }),
            }));

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

    };

    const Modalbody = () => {

        if (!editCard || !document.getElementById(modalId).checked) return;

        const card = editCard.data.current;

        return (
            <form>

                {/* Title */}
                <h3 className="font-bold text-lg pb-2">Enter value for {card.title}</h3>

                {/* Form */}
                <div>
                    <div className="grid grid-cols-2 py-2">
                        <label className="col-span-1" htmlFor={"value"}>Value: </label>
                        <input type="number" className="input input-bordered input-sm w-full max-w-xs" defaultValue={card.value} ref={valueInput} />
                    </div>
                </div>

                {/* Add button */}
                <div className="modal-action">
                    {/* <label htmlFor={modalId} className="btn">No</label> */}
                    <button type="button" htmlFor={modalId} className="btn" onClick={removeCard}>No</button>
                    <button type="button" htmlFor={modalId} className="btn" onClick={addCard}>Yes</button>
                </div>

                {/* Invalid alert */}
                <div className="alert alert-warning shadow-lg mt-5 hidden" id={`${modalId}invalid`}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>Warning: Please input valid number!</span>
                    </div>
                </div>

            </form>
        )
    }

    return (
        <Modal id={modalId} closeElement={
            <button type="button" htmlFor={modalId} className="hover:cursor-pointer absolute right-6 top-4" onClick={removeCard}>✕</button>
        }>
            <Modalbody />
        </Modal>
    )
}