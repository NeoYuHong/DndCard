export const Header = ({ title, logo, children, ...props }) => {
    return (
        <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-7 w-6 items-center justify-center rounded-full">
                {logo}
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full pb-4">
                <h3 className="text-lg font-semibold leading-6" {...props}>{title}</h3>
                {children}
            </div>
        </div >
    )
}