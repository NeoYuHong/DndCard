import { Label } from "./Label";

export const TextArea = ({ id, label, popupContent, ...props }) => {
    const ownProps = { id, label, popupContent };
    return (
        <div className="grid grid-cols-3 py-2">
            <Label {...ownProps} />
            <textarea className="col-span-3 sm:col-span-2 input input-bordered input-sm w-full h-full" name={id} id={id}  {...props}></textarea>
        </div >
    )
}
