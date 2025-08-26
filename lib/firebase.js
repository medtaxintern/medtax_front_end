import { initializeApp }  from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, onSnapshot, getDoc, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

/** 
 * 
 * @param {function} callback - gets called every time docs change
 * @returns {function} unsubscribe -call this to stop listening
 * 
 * 
 */

const firebaseConfig = {
  apiKey: "AIzaSyCTm9yorkIuYGZ3c2BEKmyDtSPSH9hIh9c",
  authDomain: "medtax-ocr-prototype.firebaseapp.com",
  projectId: "medtax-ocr-prototype",
  storageBucket: "medtax-ocr-prototype.firebasestorage.app",
  messagingSenderId: "1086778133977",
  appId: "1:1086778133977:web:51dc0e6f11107978121dc8",
  measurementId: "G-JZD4WFKMWR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "extracted-data-db");
export const storage = getStorage(app, "document_img_bucket");

export function getUserDocuments(docType, callback) {
  const colRef = collection(db, docType);

  const unsub = onSnapshot(colRef, (snapshot) =>{
    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Got the Document");
    callback(docs);
  });
    return unsub
  }

export async function getDocumentData(docType, docId){
  const data = await getDoc(doc(db, docType, docId))
  console.log("Got the document's data");
  if (data.exists()){
    return data.data();
  }
  else{
    return null;
  }
}

export async function getDocumentPreview(path){
  const url = await getDownloadURL(ref(storage, path))
  .catch((error) => {
    switch (error.code) {
      case 'storage/object-not-found':
        console.log("The file doesnt Exist")
        console.log("The error:", error);
        break;
      case 'storage/unauthorized':
        console.log("The user doesn't have permission to read the file");
        console.log("The error: ", error);
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        console.log("The user cancelled the upload");
        console.log("The error: ", error);
        break;
    }
  })
  return  url ? url : null ;
}

export async function updateDocument(collection, docName, formData){
  try {
      const ref = doc(db, collection, docName);
      await updateDoc(ref, formData);
      alert("Changes saved!");
      
  } catch (err) {
      console.error("Error saving document:", err);
      alert("Failed to save changes.");
    }
}