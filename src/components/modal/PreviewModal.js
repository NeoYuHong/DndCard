import { Utils } from "@/helpers/utils";
import Modal from "./Modal";
import ModalId from "./ModalId";

export default function PreviewModal({ items }) {

    const modalId = ModalId.previewcard;

    items = Utils.parseData(items.Data);

    return (
        <Modal id={modalId} className="w-11/12 max-w-5xl h-5/6">
            {/* Title */}
            <h3 className="font-bold text-lg pb-7">Excel Preview</h3>

            {/* Editing form */}
            <div>
                <table className="table table-striped table-bordered table-zebra" cellSpacing="0" width="100%">
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(({ title, description, value }, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{title}</td>
                                    <td>{description}</td>
                                    <td>{value}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>

        </Modal>
    )
}