import { Utils } from "@/helpers/utils";

import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header({ items, setItems }) {

    return (
        <Disclosure as="nav" className="bg-[#1d2129]">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-[1480px] px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <div className="flex-1 px-2 lg:flex-none">
                                        <a href="./" className="text-lg font-bold">DndCard</a>
                                    </div>
                                </div>
                                <div className="hidden sm:ml-6 sm:block">

                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto hidden sm:ml-6 sm:block">

                                <label htmlFor="previewcard" className="hover:cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">View Table</label>

                                <label className="inline-block hover:cursor-pointer">
                                    <input type="file" className="hidden" onChange={(e) => Utils.importJson(e, setItems)} />
                                    <span className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex">
                                        Import
                                    </span>
                                </label>

                                <a tabIndex={0} className="hover:cursor-pointer dropdown dropdown-end rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                                    Export
                                    <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-[#2e323c] rounded-box w-52 mt-4">
                                        <li>
                                            <button onClick={() => {
                                                Utils.exportExcel(Utils.parseData(items.Data))
                                            }}>EXCEL</button>
                                        </li>
                                        <li>
                                            <button onClick={() => {
                                                Utils.exportJson(Utils.parseItems(items))
                                            }}>JSON</button>
                                        </li>
                                        <li>
                                            <button onClick={() => {
                                                Utils.exportPDF(Utils.parseData(items.Data))
                                            }}>PDF</button>
                                        </li>
                                    </ul>
                                </a>


                            </div>
                        </div>
                    </div >

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">

                            <label htmlFor="previewcard" className="hover:cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">View Table</label>

                            <label className="hover:cursor-pointer">
                                <input type="file" className="hidden" onChange={(e) => Utils.importJson(e, setItems)} />
                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
                                    Import
                                </span>
                            </label>

                            <a tabIndex={0} className="dropdown dropdown-end hover:cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">
                                <label >Export</label>
                                <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-[#2e323c] rounded-box w-52 mt-4">
                                    <li>
                                        <button onClick={() => {
                                            Utils.exportExcel(Utils.parseData(items.Data))
                                        }}>EXCEL</button>
                                    </li>
                                    <li>
                                        <button onClick={() => {

                                            Utils.exportJson(Utils.parseItems(items))
                                        }}>JSON</button>
                                    </li>
                                    <li>
                                        <button onClick={() => {
                                            Utils.exportPDF(Utils.parseData(items.Data))
                                        }}>PDF</button>
                                    </li>
                                </ul>
                            </a>
                        </div>
                    </Disclosure.Panel>
                </>
            )
            }
        </Disclosure >
    );
}
