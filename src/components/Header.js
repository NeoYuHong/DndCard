import { Utils } from "@/helpers/utils";

export default function Header({ items }) {

    return (
        <div className="navbar bg-base-300 rounded-box p-3">
            <div className="flex-1 px-2 lg:flex-none">
                <a className="text-lg font-bold">DndCard</a>
            </div>
            <div className="flex justify-end flex-1 px-2">
                <div className="flex items-stretch">
                    <label htmlFor="previewcard" className="btn btn-ghost rounded-btn">View Table</label>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost rounded-btn">Export</label>
                        <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                            <li>
                                <button disabled={items.length < 1} onClick={() => {
                                    Utils.exportExcel(Utils.parseDataExcel(items.Data))
                                }}>EXCEL</button>
                            </li>
                            <li>
                                <button disabled={items.length < 1} onClick={() => {
                                    Utils.exportJson(Utils.parseDataJson(items.Data))
                                }}>JSON</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    );
}
