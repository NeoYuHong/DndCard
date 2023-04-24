import { Utils } from "@/helpers/utils";

export default function Header({ items, setItems }) {

    return (
        <div className="navbar bg-base-300 rounded-box p-3">

            {/* Logo */}
            <div className="flex-1 px-2 lg:flex-none">
                <a className="text-lg font-bold">DndCard</a>
            </div>

            <div className="flex justify-end flex-1 px-2">
                <div className="flex items-stretch gap-2">

                    {/* View table */}
                    <label htmlFor="previewcard" className="btn btn-ghost rounded-btn">View Table</label>

                    {/* Import */}
                    <label className="inline-block hover:cursor-pointer">
                        <input type="file" className="hidden" onChange={(e) => Utils.importJson(e, setItems)} />
                        <span className="btn btn-ghost rounded-btn flex">
                            IMPORT
                        </span>
                    </label>


                    {/* Export */}
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost rounded-btn">Export</label>
                        <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                            <li>
                                <button onClick={() => {
                                    Utils.exportExcel(Utils.parseData(items.Data))
                                }}>EXCEL</button>
                            </li>
                            <li>
                                <button onClick={() => {
                                    Utils.exportJson(Utils.parseDataRaw(items.Data))
                                }}>JSON</button>
                            </li>
                            <li>
                                <button onClick={() => {
                                    Utils.exportPDF(Utils.parseData(items.Data))
                                }}>PDF</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    );
}
