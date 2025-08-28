import styles from "../styles/service-invoice.module.css";
import tableStyles from "../styles/table.module.css";
import Layout from "../components/layout";
import Modal from "../components/doc-modal";
import UploadModal from "../components/upload-modal";

import { IoDocumentTextOutline } from "react-icons/io5";

import { getUserDocuments, getDocumentData, getDocumentPreview, updateDocument } from "../lib/firebase"; 

import { useState, useEffect } from "react";

export default function service_invoice() {
    const collection = "service_invoice"

    const [isOpenUpload, setOpenUpload] = useState(false);

    const [isOpenDoc, setOpenDoc] = useState(false);
    const [docName, setDocName] = useState("");
    const [docs, setDocs] = useState([]);
    const [data, setData] = useState(null);
    const [path, setPath] = useState(null);

    const [formData, setFormData] = useState({});
    
    // Opening the modal for a specific document
    const openDoc = async (e) => {
        console.log(e.target.id)
        const id = e.target.id;
        const data = await getDocumentData(collection, id);
        const path = `${collection}/${data.pdf_name}`; //local path
        const url = await getDocumentPreview(path);
        console.log("The path is: ", url);
        setData(data);
        setFormData(data);
        if(data && url !== ""){
            setDocName(e.target.id);
            setPath(url);
            setOpenDoc(true);
        }else{
            alert("Data is empty");
        }   
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTableChange = (rowIndex, field, value) => {
        setFormData(prev => {
            const updatedRows = [...(prev.table_rows || [])];
            updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: value };
            return { ...prev, table_rows: updatedRows };
        });
    };

    const saveChanges = async () => {
        if (!docName) return;
        await updateDocument(collection, docName, formData);
        setOpenDoc(false)
    };

    // Listing all documents
    useEffect(()=>{
        const unsubscribe = getUserDocuments(collection, (newDoc) => {
            setDocs(newDoc);
        });
        return () => unsubscribe();
    },[]);
    
    const docType = "service_invoice"

    return(
        <Layout>
        <h1 className="top-h1"> Uploaded Service Invoice </h1>

        {/* Display Documents here */}
         <div className={tableStyles["container"]}>
            <table className={tableStyles["table-style"]}>
                <tbody className={tableStyles["tbody-style"]}>
                    {(!docs || docs.length === 0) ? (
                        <tr  className="">
                            <td><p className={styles["doc-name"]}> NO FILE UPLOADED</p></td>
                        </tr>
                    ) : docs.map((doc) => (
                        
                        <tr key={doc.id} className={tableStyles["tr-style"]}>
                            <td className={tableStyles["td-style"]}>
                                <p className={tableStyles["doc-name"]} onClick={openDoc} id={doc.id}><IoDocumentTextOutline className="text-2xl"/>{doc.id}</p>
                            
                            </td>
                        </tr>
                    ))
                    }
                </tbody>

            </table>
        </div>

        {/* Upload Button below and its modal */}
        <button
            onClick={() => setOpenUpload(true)}
            className = "upload-button"
        >
            + Upload Service Invoice
        </button>

        <UploadModal
            isOpen={isOpenUpload}
            onClose={() => setOpenUpload(false)}
            docType={docType}
        >

        </UploadModal>

        {/* IF THE DOCUNET-IS-CLICKED MODAL */}
        <Modal
            isOpen={isOpenDoc}
            onClose={() => setOpenDoc(false)}
            title={docName}
            url={path}
        >
            {/* RIGHT COLUMN */}
                
            <div className={styles["two-field-input"]}>

                <div className="w-full">
                    <label className={styles["field-label"]}>OR No.</label>
                    <input className={styles["field-input-half"]} type="text" value={formData?.Invoice_No || ""} onChange={e => handleChange("invoice_no",e.target.value)} placeholder="" />
                </div>

                <div className="w-full">
                    <label className={styles["field-label"]}>Client Type</label>
                    <input className={styles["field-input-half"]} type="dropdown" value={formData?.client_type || ""} onChange={e => handleChange("client_type", e.target.value)} placeholder="" />
                </div>
            </div>

            <label className={styles["field-label"]} > Client Name </label>
            <input className={styles["field-input"]} type="text" value={formData?.Registered_Name || ""} onChange={e => handleChange("registered_name", e.target.value)} placeholder=""/>
            
            <label className={styles["field-label"]}> Branch <span className={styles["optional-style"]} >(Optional)</span></label>
            <input className={styles["field-input"]} type="text" value={formData?.branch || ""} onChange={e => handleChange("branch", e.target.value)}placeholder=""/>


            <div className={styles["two-field-input"]}>

                <div className="w-full">
                    <label className={styles["field-label"]}>Date Issued</label>
                    <input className={styles["field-input-half"]} type="text" value={formData?.Date || ""} onChange={e => handleChange("date_issued", e.target.value)} placeholder="" />
                </div>

                <div className="w-full">
                    <label className={styles["field-label"]}>Quarter</label>
                    <input className={styles["field-input-half"]} type="text" value={formData?.quarter || ""} onChange={e => handleChange("quarter", e.target.value)} placeholder="" />
                </div>
            </div>

            <div className={styles["section-title"]}>
                For Tax Calculations
                <p className={styles["optional-style"]}>The fields below will serve as an indicator for tax calculations</p>
            </div>

            <div className={styles["two-field-input"]}>

                <div className="w-full">
                    <label className={styles["field-label"]}>Year Included</label>
                    <input className={styles["field-input-half"]} type="text" value={formData?.year_included || ""} onChange={e => handleChange("year_included",e.target.value)} placeholder="" />
                </div>

                <div className="w-full">
                    <label className={styles["field-label"]}>Quarter Included</label>
                    <input className={styles["field-input-half"]} type="text" value={formData?.quarter_included || ""} onChange={e => handleChange("quarter_included", e.target.value)} placeholder="" />
                </div>

            </div>

            <div className={styles["field-checkbox"]}>
                
                <label className={styles["field-checkbox-label"]}>
                    <input className={styles["field-checkbox-input"]} type="checkbox"  /> Is Temporary?
                </label>

                <label className={styles["field-checkbox-label"]}>
                    <input className={styles["field-checkbox-input"]} type="checkbox"  /> Without 2307?
                </label>
            
            </div>

            <div className={styles["currency-field"]}>

                <div className={styles["section"]}>
                    <label className={styles["field-label"]}>Gross Amount</label>
                    <input className={styles["field-input"]} type="text" value={formData?.gross_amount || "0"} onChange={e => handleChange("gross_amount", e.target.value)} placeholder="" />
                </div>

                <div className={styles["section"]}> 
                    <label className={styles["field-label"]}>Discount</label>
                    <input className={styles["field-input"]} type="text" value={formData?.discount || "0"} onChange={e => handleChange("discount", e.target.value)} placeholder=""  />
                </div>

                <div className={styles["section"]}>
                    <label className={styles["field-label"]}>Withheld Amount</label>
                    <input className={styles["field-input"]} type="text" value={formData?.withheld_amount || "0"} onChange={e => handleChange("withheld_amount", e.target.value)} placeholder="" />
                </div>

                <div className={styles["section"]}>
                    <label className={styles["field-label"]}>Tax Rate
                        <span className={styles["info-style"]} >(Withheld Amount / Net Receipt) x 100</span>
                    </label>
                    <input className={styles["field-input"]} type="text" value={formData?.tax_rate || "0"} onChange={e => handleChange("tax_rate", e.target.value)} placeholder="" />
                </div>

                <div className={styles["section"]}>
                    <label className={styles["field-label"]}>Net Receipt
                         <span className={styles["info-style"]} >Gross Amount - Discount</span>
                    </label>
                    <input className={styles["field-input"]} type="text" value={formData?.net_receipt || "0"} onChange={e => handleChange("net_receipt", e.target.value)} placeholder=""/>
                </div>

                <div className={styles["section"]}>
                    <label className={styles["field-label"]}>Net Amount
                        <span className={styles["info-style"]} >Net Receipt - Withheld Amount</span>
                    </label>
                    <input className={styles["field-input"]} type="text" value={formData?.net_amount || "0"} onChange={e => handleChange("net_amount", e.target.value)} placeholder="" />
                </div>
            </div>
           
            <button className="save-button" onClick={saveChanges}>Save</button>
        </Modal>
      

        </Layout>

    );
}