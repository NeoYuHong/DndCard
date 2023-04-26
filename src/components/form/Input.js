import { Label } from "./Label";

export const Input = ({ id, label, popupContent, ...props }) => {
    const ownProps = { id, label, popupContent };
    return (
        <div className="grid grid-cols-3 py-2">
            <Label {...ownProps} />
            <input type={'text'} className="col-span-3 sm:col-span-2 input input-bordered input-sm w-full" name={id} id={id} {...props} />
        </div>
    )
}