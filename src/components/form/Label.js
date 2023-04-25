export const Label = ({ label, id }) => {
    return (
        <label className="col-span-3 pb-2 sm:col-span-1 sm:pb-0" htmlFor={id}>{label}: </label>
    )
}
