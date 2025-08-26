import styles from "./style/doc-modal.module.css";

import {useState, useEffect} from "react";


export default function Modal({ isOpen, onClose, title, url, children }){
  const [previewLink, setPreviewLink] = useState(null);

  useEffect(() =>{
    if (url) setPreviewLink(url);

  }, [url])

  useEffect(() => {
        const handleKeyDown = (event) => {
          if (event.key === "Escape") {
            onClose();
          }
        };
  
        if (isOpen) {
          window.addEventListener("keydown", handleKeyDown);
        }
  
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
      }, [isOpen, onClose]);
  
    if (!isOpen) return null;

    return (
      <div className={styles["modal-bg"]}>
        <div className={styles["modal"]}>
            <div className={styles["header"]}>
              <h2 className="text-xl font-semibold mb-0">{title}</h2>
              <button 
                onClick={onClose} 
                className=" text-gray-500 hover:text-gray-900 text-xl font-semibold"
              >
                ✖
              </button>
              
            </div>
            {/* Contents */}
            <div className={styles["container"]}>

                  {/* LEFT COLUMN */}

                  <div className={styles["left-column"]}>
                    <div className={styles["preview-box"]}>
                      {url ? (
                        <iframe
                          src={url}
                          style={{width:"100%", height:"100%", border:"none",}}
                          title="PDF Preview"
                        />
                      ) : (
                          <p className="text-white text-center text-[16px] font-normal leading-[1.3] ">No Doocument Available for Preview</p>
                        )}
                    </div>
                        
                  </div>

                  {/* RIGHT COLUMN */}

                  <div className={styles["right-column"]}>
                    {children}
                  </div>
            </div>

        </div>
      </div>
  )
}

