import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { app } from "../../lib/firebase"
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/pdf.module.css'
import { db } from "../../lib/firebase"
import { addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';

const Pdf = () => {
  const [file, setFile] = useState(null);
  const [topic, setTopic] = useState('');
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(3);
  const [noquest, setnoquest] = useState(5);
  const [selectedValue, setSelectedValue] = useState('MCQ');
  const [DifficultyValue, setDifficultyValue] = useState('Easy');
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const router = useRouter();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const allowedTypes = ['application/pdf'];

    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      alert('Please select a PDF file.');
      setFile(null);
    }
  };

  const handleStartPageChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setStartPage(value);
  };

  const handleEndPageChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setEndPage(value);
  };

  const handlenoqchange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value <= 10) {
      setnoquest(value);
    } else {
      setnoquest(10);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    if (!topic) {
      alert('Please fill all coloumns');
      return;
    }

    if (startPage === null || startPage === undefined || endPage === null || endPage === undefined) {
      setStartPage(1);
      setEndPage(3);
    }

    if (parseInt(startPage) > parseInt(endPage)) {
      console.log("Invalid page range");
      return;
    }

    setIsLoading(true);
    const storage = getStorage(app);
    const storageRef = ref(storage, `pdf/${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Uploaded a blob or file!');

      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('File available at', downloadURL);

      const response = await axios.post('/api/pdf', { downloadURL, startPage, endPage });
      const textdata = response.data.slice(0, 3000);

      await deleteObject(storageRef);
      console.log('File deleted successfully.');

      const createResponse = await fetch("/api/pdfcreate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noquest,
          text: textdata
        }),
      });

      if (!createResponse.ok) {
        setIsLoading(false);
        console.log("Network response was not OK");
        return;
      }

      const reader = createResponse.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let answer = "";
  
      // Skip initial string text before JSON payload
      let skipText = true;
  
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
  
        if (skipText) {
          // Look for '{' to determine the start of JSON payload
          const startIndex = chunkValue.indexOf('{');
          if (startIndex !== -1) {
            answer += chunkValue.slice(startIndex);
            skipText = false;
          }
        } else {
          answer += chunkValue;
        }
      }
      const jsonmcq = JSON.parse(answer);
      const refs = collection(db, "McqForms");
      await addDoc(refs, {
        questionid: uuidv4(),
        createduser: auth.currentUser.uid,
        jsonmcq: jsonmcq,
        topic: topic,
        noquestion: noquest,
        type: selectedValue,
        DifficultyValue: DifficultyValue,
      });
      router.push('/admin/managequix');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid1}>
        <div className={styles.gridbox}>
          <div className={styles.mar}>
            <span className={styles.hiddenFileInput}>
              <input type="file" onChange={handleFileChange} />
            </span>
            <div>Drop your Files here or browse</div>
            <div>File select: {file ? file.name : 'No file selected'}</div>
          </div>
        </div>
      </div>
      <div className={styles.grid2}>
        <div className={styles.gridboxx}>

          <div className={styles.gapinp}>
            <label htmlFor="Topicname">Enter Topic name:</label>
            <input type="text" id="Topicname" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder='Topic Name' />
          </div>

          <div className={styles.gapinp}>
            <label htmlFor="startPage">Enter Start Page no:</label>
            <input type="text" id="startPage" value={startPage} onChange={handleStartPageChange} />
          </div>

          <div className={styles.gapinp}>
            <label htmlFor="endPage">Enter End Page no:</label>
            <input type="text" id="endPage" value={endPage} onChange={handleEndPageChange} />
          </div>

          <div className={styles.gapinp}>
            <label htmlFor="questchange">Enter no of question:</label>
            <input type="text" id="questchange" value={noquest} onChange={handlenoqchange} />
          </div>

          <div className={styles.gapinp}>
            <label htmlFor="type">Select Question Type:</label>
            <select name="type" id='type' onChange={(e) => setSelectedValue(e.target.value)} className={styles.select}>
              <option value="MCQ">MCQ</option>
              <option value="torf">True - False (coming soon!!)</option>
              <option value="Short Answers">Short Answers (coming soon!!)</option>
              <option value="Blanks">Blanks (coming soon!!)</option>
              <option value="Mixed">Mixed (coming soon!!)</option>
              <option value="2marks">2 Marks (coming soon!!)</option>
              <option value="5marks">5 Marks (coming soon!!)</option>
            </select>
          </div>

          <div className={styles.gapinp}>
            <label htmlFor="difficult">Select Difficulty Level:</label>
            <select name="difficult" id='difficult' onChange={(e) => setDifficultyValue(e.target.value)} className={styles.select}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <button className={styles.btn} onClick={uploadFile} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pdf;
