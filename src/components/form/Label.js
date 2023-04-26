import { Utils } from "@/helpers/utils"
import { Tooltip } from "react-tooltip"
import ReactDOMServer from 'react-dom/server';

export const Label = ({ label, id, popupContent }) => {

    return (
        <label className="col-span-3 pb-2 sm:col-span-1 sm:pb-0" htmlFor={id}>

            {label}:

            {/* Pop up */}
            {popupContent && <span>

                <a
                    data-tooltip-id="tooltip"
                    data-content={ReactDOMServer.renderToString(popupContent)}
                >
                    <svg className="h-3 w-3 mx-1 inline-block align-middle" xmlns="http://www.w3.org/2000/svg" fill="#a6adbb" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="none" /><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                    </svg>
                </a>

            </span>}

        </label >
    )
}
