import { useState } from 'react';
import styles from "@/styles/pdf.module.css";
import axios from 'axios';

const Link = () => {
  const [topic, setTopic] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedValue, setSelectedValue] = useState('MCQ');
  const [DifficultyValue, setDifficultyValue] = useState('Easy');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apires, setApires] = useState('');

  const handleQuantityChange = (event) => {
    const value = event.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    if (value <= 10) {
      setQuantity(value);
    } else {
      setQuantity(10);
    }
  };

  async function submitlnk () {
    const response = await axios.post("/api/trylinks");
    console.log(response);
  }

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
            <input type="text" id="Topicname" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder='Topic Name' />
          </div>

          <div className={styles.gapinp}>
            <label htmlFor="questchange">Enter no of question:</label>
            <input type="text" id="questchange" value={quantity} onChange={handleQuantityChange} />
          </div>

          <div className={styles.gapinp}>
            <label htmlFor="type">Select Question Type:</label>
            <select name="type" id='type' onChange={(e) => setSelectedValue(e.target.value)} className={styles.select}>
              <option value="MCQ">MCQ ( coming soon !! )</option>
              <option value="torf">True - False ( coming soon !! )</option>
              <option value="Short Answers">Short Answers ( coming soon !! ) </option>
              <option value="Blanks">Blanks ( coming soon !! ) </option>
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
          <button className={styles.btn} onClick={submitlnk} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Link;
