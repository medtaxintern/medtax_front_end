import styles from "./style/table.module.css";
import Modal from "./doc-modal";
import { IoDocumentTextOutline } from "react-icons/io5";

import {useState, useEffect} from "react";

export default function Table({ docs, title}){
    const [ isOpen, setOpen ] = useState(false);
    if (docs.length === 0){
        console.log("ITS EMPTY")
    }
    const openDoc = (e) => {
        const documentId = e.target.id;
        console.log(documentId);
        setOpen(true);
    
        return(
        <Modal
            docId={documentId}
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            title={title}
        >

        </Modal>
        )
    }

    return (
        <div className={styles["container"]}>
            <table className={styles["table-style"]}>
                <tbody className={styles["tbody-style"]}>
                    {(!docs || docs.length === 0) ? (
                        <tr  className={styles["tr-style"]}>
                            <td>
                                <p className={styles["doc-name"]}> NO FILE UPLOADED</p>
                            </td>
                        </tr>
                    ) : ( docs.map((doc) => (
                        
                        <tr key={doc.id} className={styles["tr-style"]}>
                            <td className={styles["td-style"]}>
                                <p className={styles["doc-name"]} onClick={openDoc} id={doc.id}><IoDocumentTextOutline className="text-2xl"/>{ doc.id}</p>
                            
                            </td>
                        </tr>
                    )) 
                )} 
                </tbody>
            </table>
        </div>
    );
}