"use client";
import {useState, useEffect} from "react";
export default function UploadModal({ isOpen, onClose, docType, }){
  const [fileType, setFileType] = useState(null);
  const [filename, setFilename] = useState(null);
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

  const handle_upload = async (e) =>{
    const file = e.target.files[0];

    if (file) {
      setFileType(file.type);
      let pre_file = file.name;

      setFilename(pre_file.replace(/\.[^/.]+$/, ""));
      try{
        // Request for signedURL
        const signedURL = await fetch('/api/get_upload_url', {
          method: "POST",
          headers: {
            "Content-Type" : "application/json" 
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            docType: docType,
          }),
        });

        if(!signedURL.ok) throw new Error("Failed to fetch signedURL");

        const { url } = await signedURL.json();

        if (!url) throw new Error("Failed to get upload URL");
        
        const upload = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "x-goog-meta-docType" : docType,
          },
          body : file,
        });

        if(!upload.ok) throw new Error("Failed to upload");
        if(upload.ok) {
          console.log("File Uploaded");
          alert(`A ${docType} file has been uploaded!`);
          onClose()
        }

      }catch (error) {
        setError(error.message);
      } 
    }
  }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold mb-6 p-2 justify-center text-center">Uploading 2307 Document</h2>
        
         <input className="hidden" type="file" accept="application/pdf, image/*" onChange={handle_upload}id="file-upload"/>
          <div className="w-full flex justify-center mt-0">
             <label className="bg-[#181818] text-white text-[18px] font-normal border-0 rounded-md text-center cursor-pointer mt-0 p-2 " htmlFor="file-upload">Upload Document/Picture</label>
          </div>

      </div>
    </div>
    )
}
