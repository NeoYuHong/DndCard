export default function Modal({ id, children, className, closeElement }) {

    return (
        <>
            <input type="checkbox" id={id} className="modal-toggle" />
            <div className="modal cursor-default">
                <div className={`modal-box relative ${className}`}>

                    {closeElement}

                    {!closeElement && <label htmlFor={id} className="hover:cursor-pointer absolute right-6 top-4">✕</label>}

                    {children}

                </div>
            </div>
        </>
    )
}