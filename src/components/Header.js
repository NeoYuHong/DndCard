import { Utils } from "@/helpers/utils";
import styles from "@/styles/Header.module.css";

export default function Header({ items }) {


    return (
        <div className={styles.Header}>

            <div>

                <div>
                    <label htmlFor="previewcard">View Table</label>
                </div>

                <div>
                    <button disabled={items.length < 1} onClick={() => {
                        Utils.exportToExcel(Utils.parseCardData(items.Data))
                    }}>Export</button>
                </div>

            </div>

        </div>

    );
}
