import { React, useState } from 'react';
import { getAuth } from "firebase/auth";
import { useRouter } from 'next/router';
import { db } from "./../../lib/firebase"
import { addDoc, collection, } from "firebase/firestore";
import styles from '@/styles/pdf.module.css'
import { v4 as uuidv4 } from 'uuid';

const Topic = () => {
  const auth = getAuth();
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedValue, setSelectedValue] = useState('MCQ');
  const [DifficultyValue, setDifficultyValue] = useState('Easy');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = (event) => {
    const value = event.target.value.replace(/\D/, '');
    if (value <= 10) {
      setQuantity(value);
    } else {
      setQuantity(10);
    }
  };

  const generateBio = async () => {
    if (!topic || !selectedValue || !DifficultyValue || !quantity) {
      alert('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/topic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          DifficultyValue,
          type: selectedValue,
          noquestion: quantity,
        }),
      });

      if (!response.ok) {
        setIsLoading(false);
        console.log("Network response was not OK");
      }

      try {
        const reader = response.body.getReader();
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

          console.log(chunkValue);
        }

        let jsonmcq = JSON.parse(answer);

        const refs = collection(db, "McqForms");
        await addDoc(refs, {
          questionid: uuidv4(),
          createduser: auth.currentUser.uid,
          jsonmcq: jsonmcq,
          topic,
          quantity,
          type: selectedValue,
          DifficultyValue
        });
        router.push('/admin/managequix');
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }

    } catch (error) {
      setIsLoading(false);
      console.log("error in parsing data or saving in db");
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid1}>
        <div className={`${styles.gridbox} ${styles.martxt}`}>
          <div className={`${styles.mar} ${styles.marttext}`}>
            <div className={styles.point}>
              <div>
                1. Define topic clearly: Choose a specific and well-defined subject for the MCQs.
              </div>
              <div>
                2. Choose relatable subjects: Select topics that are familiar and easily understood by the audience.
              </div>
              <div>
                3. Consider question difficulty: Determine the desired level of difficulty for the questions, from basic to more challenging concepts.
              </div>
              <div>
                4. Review for accuracy: Carefully check each question and its options for correctness and clarity.
              </div>
              <div>
                5. Avoid negativity or harm: Steer clear of offensive or harmful topics to create a positive learning environment.
              </div>
            </div>

          </div>
        </div>

      </div>
      <div className={styles.grid2}>
        <div className={styles.gridboxx}>
          <div className={styles.gapinp}>
            <label htmlFor="Topicname">Enter Topic name:</label>
            <input type="text" autoComplete='off' id="Topicname" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder='Topic Name' />
          </div>

          <div className={styles.gapinp}>
            <label htmlFor="questchange">Enter no of question:</label>
            <input type="text" id="questchange" value={quantity} onChange={handleQuantityChange} />
          </div>

          <div className={styles.gapinp}>
            <label htmlFor="type">Select Question Type:</label>
            <select name="type" id='type' onChange={(e) => setSelectedValue(e.target.value)} className={styles.select}>
              <option value="MCQ">MCQ</option>
              <option value="torf">True - False( coming soon !! )</option>
              <option value="Short Answers">Short Answers( coming soon !! )</option>
              <option value="Blanks">Blanks( coming soon !! )</option>
              <option value="Mixed">Mixed( coming soon !! )</option>
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
          <button className={styles.btn} onClick={generateBio} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Topic;
