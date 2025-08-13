import { useState, useEffect } from 'react';

export default function Form2307() {
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("processing"); // For polling, unused for now
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const [inputValue, setInputValue] = useState("");
  const [tableValue, setTableValue] = useState("");
  useEffect(() => {
    const eventSource = new EventSource("/api/check_result");
    console.log("ANYTHING HAPPENING?");

    eventSource.onmessage = (event) => {
      console.log("Front-end received data");
      const data = JSON.parse(event.data);
      console.log(data);
      setResult(data);
    };
    
    eventSource.onerror = (err) => {
      console.log("AM I IN ERROR");
      console.error("SSE Error: ", err);
      eventSource.close();
    };
  
    return () => {
      console.log("Why am i here");
      eventSource.close();
    };

  }, []);

  // STORE THE VALUES 
  useEffect(() => {
    if(result) {
      setInputValue(result.payload);
      setTableValue(result.payload.table_rows);
    };

  }, [result]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

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
          }),
        });

        if(!signedURL.ok) throw new Error("Failed to fetch signedURL");
        console.log("signedURL", signedURL);
        const { url } = await signedURL.json();

        if (!url) throw new Error("Failed to get upload URL");
        
        const upload = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body : file,
        });

        if(!upload.ok) throw new Error("Failed to upload");
      }catch (error) {
        setError(error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* LEFT - Upload Preview */}
        <div style={leftColumnStyle}>
          <h3 style={titleStyle}>Edit 2307</h3>
          <div style={previewBoxStyle}>
            {preview ? (
              fileType === "application/pdf" ? (
                
                <iframe
                  src={`${preview}#toolbar=0&navpanes=0&scrollbar=1`}
                  style={{ width: "100%", height: "100%", }}
                  title="PDF Preview"
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              )
            ) : (
              <p style={previewTextStyle}>
                Document/Image Preview of uploaded Document
              </p>
            )}
          </div>
          <input type="file" accept="application/pdf, image/*" onChange={handleFileChange} style={fileInputStyle} id="file-upload" disabled={isUploading} />
          <div style={fileButtonWrapperStyle}>
            <label htmlFor="file-upload" style={fileButtonStyle}>Upload Document/Picture</label>
          </div>
        </div>

        {/* RIGHT - Form Fields */}
        <div style={rightColumnStyle}>
          <label style={fieldLabelStyle}>Client Name</label>
          <input type="text" value={inputValue?.payee_name || ""} onChange={e => setInputValue(e.target.value)} placeholder="" style={inputStyle} />
          <label style={fieldLabelStyle}>Branch <span style={optionalLabelStyle}>optional</span></label>
          <input type="text" placeholder="" style={inputStyle} />
          <div style={twoInputStyle}>
            <div style={{width: '100%'}}>
              <label style={fieldLabelStyle}>TIN</label>
              <input type="text" value={inputValue?.payee_tin_no || ""} onChange={e => setInputValue(e.target.value)} placeholder="" style={inputHalfStyle} />
            </div>
            <div style={{width: '100%'}}>
              <label style={fieldLabelStyle}>ATC</label>
              <input type="text" value={tableValue[0]?.atc || ""} onChange={e => setInputValue(e.target.value)} placeholder="" style={inputHalfStyle} />
            </div>
          </div>
          <div style={twoInputStyle}>
            <div style={{width: '100%'}}>
              <label style={fieldLabelStyle}>Applicable Period</label>
              <input type="text" value={inputValue?.from_date || ""} onChange={e => setInputValue(e.target.value)} placeholder="" style={inputHalfStyle} />
            </div>
            <div style={{width: '100%'}}>
              <label style={fieldLabelStyle}>Quarter</label>
              <input type="text" value={inputValue?.name || ""} onChange={e => setInputValue(e.target.value)} placeholder="" style={inputHalfStyle} />
            </div>
          </div>
          <label style={fieldLabelStyle}>Address</label>
          <textarea placeholder="" value={inputValue?.payee_registered_address || ""} onChange={e => setInputValue(e.target.value)} style={textareaStyle} />

          <div style={sectionTitleStyle}>For Tax Calculations</div>
          <div style={twoInputStyle}>
            <div style={{width: '100%'}}>
              <label style={fieldLabelStyle}>Year Included</label>
              <input type="text" placeholder="" style={inputHalfStyle} />
            </div>
            <div style={{width: '100%'}}>
              <label style={fieldLabelStyle}>Quarter Included</label>
              <input type="text" placeholder="" style={inputHalfStyle} />
            </div>
          </div>
          <div style={checkboxGroupStyle}>
            <label style={checkboxLabelStyle}><input type="checkbox" style={checkboxStyle} /> Is Temporary?</label>
            <label style={checkboxLabelStyle}><input type="checkbox" style={checkboxStyle} /> Without SIP?</label>
          </div>
          <label style={fieldLabelStyle}>Gross Amount</label>
          <input type="text" placeholder="" style={inputStyle} />
          <label style={fieldLabelStyle}>Tax Rate</label>
          <input type="text" placeholder="" style={inputStyle} />
          <label style={fieldLabelStyle}>PT Rate</label>
          <input type="text" placeholder="" style={inputStyle} />
          <label style={fieldLabelStyle}>Creditable PT</label>
          <input type="text" placeholder="" style={inputStyle} />
          <label style={fieldLabelStyle}>Withheld Amount</label>
          <input type="text" placeholder="" style={inputStyle} />
          <label style={fieldLabelStyle}>Net Amount</label>
          <input type="text" placeholder="" style={inputStyle} />
          <button style={saveButtonStyle}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ==================== STYLES ====================
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f8f8f8',
  padding: '0',
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '6px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
  display: 'flex',
  maxWidth: '1200px',
  width: '98vw',
  minHeight: '97vh',
  margin: '10px',
  overflow: 'hidden',
  border: '1px solid #bbb',
};

const leftColumnStyle = {
  flex: 1.2,
  padding: '30px 18px 18px 18px',
  borderRight: '1px solid #ccc',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '420px',
};

const rightColumnStyle = {
  flex: 1,
  padding: '30px 30px 18px 30px',
  display: 'flex',
  flexDirection: 'column',
  minWidth: '370px',
};

const previewBoxStyle = {
  height: '850px',
  backgroundColor: '#1E90FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '18px',
  width: '100%',
  maxWidth: '600px',
  overflow: 'hidden',
  borderRadius: '6px',
  border: '2px solid #1E90FF',
};

const previewTextStyle = {
  color: 'white',
  textAlign: 'center',
  fontSize: '18px',
  fontWeight: '400',
  lineHeight: '1.3',
};

const titleStyle = {
  fontSize: '17px',
  fontWeight: '600',
  color: '#222',
  marginBottom: '18px',
  alignSelf: 'flex-start',
};

const fileButtonWrapperStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: '0',
};

const fileInputStyle = {
  display: 'none',
};

const fileButtonStyle = {
  display: 'inline-block',
  width: '100%',
  background: '#181818',
  color: 'white',
  fontSize: '20px',
  fontWeight: '400',
  border: 'none',
  borderRadius: '3px',
  padding: '8px 0',
  cursor: 'pointer',
  textAlign: 'center',
  marginTop: '0',
};

const inputStyle = {
  display: 'block',
  marginBottom: '13px',
  padding: '8px 10px',
  width: '100%',
  borderRadius: '3px',
  border: '1px solid #bbb',
  fontSize: '15px',
  background: '#fafafa',
  color: '#222',
};

const inputHalfStyle = {
  ...inputStyle,
  width: '100%',
  marginBottom: '0',
};

const twoInputStyle = {
  display: 'flex',
  gap: '10px',
  marginBottom: '13px',
};

const textareaStyle = {
  display: 'block',
  marginBottom: '13px',
  padding: '8px 10px',
  width: '100%',
  borderRadius: '3px',
  border: '1px solid #bbb',
  fontSize: '15px',
  background: '#fafafa',
  color: '#222',
  height: '60px',
  resize: 'none',
};

const sectionTitleStyle = {
  margin: '10px 0 7px 0',
  fontSize: '13px',
  fontWeight: '700', // BOLD
  color: '#444',
};

const fieldLabelStyle = {
  fontSize: '13px',
  color: '#222',
  fontWeight: '700', // BOLD
  marginBottom: '2px',
  marginTop: '2px',
  marginLeft: '2px',
};

const optionalLabelStyle = {
  color: '#aaa',
  fontSize: '12px',
  fontWeight: '700', // BOLD
  marginLeft: '2px',
};

const checkboxGroupStyle = {
  display: 'flex',
  gap: '18px',
  marginBottom: '13px',
  marginTop: '-2px',
};

const checkboxLabelStyle = {
  fontSize: '14px',
  color: '#222',
  fontWeight: '700', // BOLD
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const checkboxStyle = {
  marginRight: '5px',
  accentColor: '#222',
};

const saveButtonStyle = {
  marginTop: '18px',
  padding: '10px 0',
  backgroundColor: '#181818',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: '400',
  width: '100%',
  letterSpacing: '0.5px',
};
