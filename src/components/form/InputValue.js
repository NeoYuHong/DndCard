import { Utils } from "@/helpers/utils";
import { Label } from "./Label";

export const InputValue = ({ id, label, ...props }) => {
    const ownProps = { id, label };
    return (
        <div className="grid grid-cols-3 py-2">
            <Label {...ownProps} />
            <input onKeyDown={(event) => {
                const key = event.key;
                if (key === 'E' || key === 'e' || key === '+' || key === '-') {
                    event.preventDefault();
                }
            }} type="number" className="col-span-3 sm:col-span-2 input input-bordered input-sm w-full" name={id} id={id} {...props} />
        </div>
    )
}