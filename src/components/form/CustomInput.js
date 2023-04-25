import { Label } from "./Label";

export const CustomInput = ({ id, label, children }) => {
    const ownProps = { id, label };
    return (
        <div className="grid grid-cols-3 py-2">
            <Label {...ownProps} />
            <div className="col-span-3 sm:col-span-2 w-full">
                {children}
            </div>
        </div>
    )
}