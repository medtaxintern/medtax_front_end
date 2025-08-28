import styles from "../styles/form2307.module.css";
import tableStyles from "../styles/table.module.css";
import Layout from "../components/layout";
import Modal from "../components/doc-modal";
import UploadModal from "../components/upload-modal";

import { IoDocumentTextOutline } from "react-icons/io5";

import { getUserDocuments, getDocumentData, getDocumentPreview, updateDocument } from "../lib/firebase"; 

import { useState, useEffect } from "react";

export default function form2307() {
    const collection = "form2307"

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
        const path = `${collection}/${data.pdf_name}`; 
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
    
    const docType = "form2307"

    return(
        <Layout>
        <h1 className="top-h1"> Uploaded 2307 </h1>

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
            + Upload 2307
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
            <label className={styles["field-label"]} > Client Name </label>
            <input className={styles["field-input"]} type="text" value={formData?.payor_name || ""} onChange={e => handleChange("payor_name", e.target.value)} placeholder=""/>
            
            <label className={styles["field-label"]}> Branch <span className={styles["optional-style"]} >(Optional)</span></label>
            <input className={styles["field-input"]} type="text" value={formData?.branch || ""} onChange={e => handleChange("branch", e.target.value)}placeholder=""/>
            
            <div className={styles["two-field-input"]}>

                <div className="w-full">
                    <label className={styles["field-label"]}>TIN</label>
                    <input className={styles["field-input-half"]} type="text" value={formData?.payor_tin_no || ""} onChange={e => handleChange("payor_tin_no", e.target.value)} placeholder=""/>
                </div>

                <div className="w-full">
                    <label className={styles["field-label"]}>ATC</label>
                    <input className={styles["field-input-half"]} type="text" value={formData?.table_rows?.[0]?.atc || ""} onChange={e => handleTableChange(0, "atc", e.target.value)} placeholder="" />
                </div>
            </div>

            <div className={styles["two-field-input"]}>

                <div className="w-full">
                    <label className={styles["field-label"]}>Applicable Period</label>
                    <input className={styles["field-input-half"]} type="text" value={formData?.to_date || ""} onChange={e => handleChange("to_date", e.target.value)} placeholder="" />
                </div>

                <div className="w-full">
                    <label className={styles["field-label"]}>Quarter</label>
                    <input className={styles["field-input-half"]} type="text" value={formData?.quarter || ""} onChange={e => handleChange("quarter", e.target.value)} placeholder="" />
                </div>
            </div>
            
            <label className={styles["field-label"]}>Address</label>
            <textarea className={styles["field-textarea" ]}placeholder="" value={formData?.payor_registered_address || ""} onChange={e => handleChange("payor_registered_address", e.target.value)} ></textarea>

            <div className={styles["section-title"]}>
                For Tax Calculations
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
                    <input className={styles["field-checkbox-input"]} type="checkbox"  /> Without SIP?
                </label>
            
            </div>

            <label className={styles["field-label"]}>Gross Amount</label>
            <input className={styles["field-input"]} type="text" value={formData?.gross_amount || ""} onChange={e => handleChange("gross_amount", e.target.value)} placeholder="" />

            <label className={styles["field-label"]}>Tax Rate</label>
            <input className={styles["field-input"]} type="text" value={formData?.tax_rate || ""} onChange={e => handleChange("tax_rate", e.target.value)} placeholder="" />

            <label className={styles["field-label"]}>PT Rate</label>
            <input className={styles["field-input"]} type="text" value={formData?.pt_rate || ""} onChange={e => handleChange("pt_rate", e.target.value)} placeholder=""  />

            <label className={styles["field-label"]}>Creditable PT</label>
            <input className={styles["field-input"]} type="text" value={formData?.creditable_pt || ""} onChange={e => handleChange("creditable_pt", e.target.value)} placeholder=""/>

            <label className={styles["field-label"]}>Withheld Amount</label>
            <input className={styles["field-input"]} type="text" value={formData?.withheld_amount || ""} onChange={e => handleChange("withheld_amount", e.target.value)} placeholder="" />

            <label className={styles["field-label"]}>Net Amount</label>
            <input className={styles["field-input"]} type="text" value={formData?.net_amount || ""} onChange={e => handleChange("net_amount", e.target.value)} placeholder="" />
            <button className="save-button" onClick={saveChanges}>Save</button>
        </Modal>
      

        </Layout>

    );
}