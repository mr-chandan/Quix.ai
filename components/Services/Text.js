import { useState } from 'react';
import styles from '@/styles/pdf.module.css'
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from "firebase/auth";
import { useRouter } from 'next/router';
import { db } from "../../lib/firebase"
import { addDoc, collection, } from "firebase/firestore";

const Text = () => {
  const [topicname, setTopic] = useState('');
  const [text, setText] = useState("");
  const [noquest, setnoquest] = useState(5);
  const [selectedValue, setSelectedValue] = useState('MCQ');
  const [DifficultyValue, setDifficultyValue] = useState('Easy');
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const router = useRouter();

  const handlenoqchange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value <= 10) {
      setnoquest(value);
    } else {
      setnoquest(10);
    }
  }
  const fetchOrders = async () => {
    setIsLoading(true);
    if (!topicname || !selectedValue || !DifficultyValue || !noquest || !text) {
      alert('Please fill in all fields.');
      setIsLoading(false);
      return;
    }
    const slicedtext = text.slice(0, 3000);
    try {
      setIsLoading(true);
      const createResponse = await fetch("/api/pdfcreate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noquest,
          text: slicedtext,
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
        topic: topicname,
        quantity: noquest,
        type: selectedValue,
        DifficultyValue,
      });
  
      setIsLoading(false);
      router.push('/admin/managequix');
  
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  
    setIsLoading(false);
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.grid1}>
        <div className={`${styles.gridbox} ${styles.martxt}`}>
          <div className={styles.formbx}>
            <div className={styles.txtimgh}> <img src='/text.png' />Enter your Text hear :</div>
            <textarea className={styles.textarea} onChange={(e) => setText(e.target.value)} />
          </div>
        </div>

      </div>
      <div className={styles.grid2}>
        <div className={styles.gridboxx}>

          <div className={styles.gapinp}>
            <label htmlFor="Topicname">Enter Topic name:</label>
            <input type="text" id="Topicname" value={topicname} onChange={(e) => setTopic(e.target.value)} placeholder='Topic Name' />
          </div>


          <div className={styles.gapinp}>
            <label htmlFor="questchange">Enter no of question:</label>
            <input type="text" id="questchange" value={noquest} onChange={handlenoqchange} />
          </div>

          <div className={styles.gapinp}>
            <label htmlFor="type">Select Question Type:</label>
            <select name="type" id='type' onChange={(e) => setSelectedValue(e.target.value)} className={styles.select}>
              <option value="MCQ">MCQ</option>
              <option value="torf">True - False ( coming soon !! )</option>
              <option value="Short Answers">Short Answers ( coming soon !! )</option>
              <option value="Blanks">Blanks ( coming soon !! )</option>
              <option value="Mixed">Mixed ( coming soon !! )</option>
              <option value="2marks">2 Marks ( coming soon !! )</option>
              <option value="5marks">5 Marks ( coming soon !! )</option>
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
          <button className={styles.btn} disabled={isLoading} onClick={fetchOrders}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Text