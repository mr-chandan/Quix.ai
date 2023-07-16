import { React, useState, useEffect } from 'react';
import styles from "@/styles/forms.module.css";
import { db } from '../lib/firebase';
import { collection, getDoc, doc } from 'firebase/firestore';

const Form = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const docRef = doc(db, 'Forms', 'vpHebXhPQGXvkJnCiQru');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const questionsData = docSnap.data().jsonmcq.questions;
          console.log(questionsData);
          setQuestions(questionsData);
          setSelectedAnswers(new Array(questionsData.length).fill(''));
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionChange = (questionIndex, selectedOption) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[questionIndex] = selectedOption;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const handleSubmit = () => {
    const score = calculateScore();
    const formData = {
      selectedAnswers,
      score
    };
    console.log(formData);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className={styles.forms}>
      <div className={styles.who}>
        <div className={styles.name}>
          <div>This is created by,</div>
          <div className={styles.relname}> Mr Chandan</div>
        </div>
        <div className={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis sem odio. Sed commodo vestibulum leo, sit amet tempus odio consectetur in.
        </div>
      </div>
      <div className={styles.inpname}>
        <div>What is your name?</div>
        <input type="text" />
      </div>
      {questions.map((question, index) => (
        <div key={index} className={styles.mcq}>
          <div>{question.question}</div>
          <div className={styles.mcqinp}>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className={styles.i}>
                <input
                  type="radio"
                  id={`q${index}-option${optionIndex}`}
                  name={`q${index}`}
                  value={option}
                //   checked={selectedAnswers[index] === option}
                  onChange={() => handleOptionChange(index, option)}
                />
                <label htmlFor={`q${index}-option${optionIndex}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className={styles.submitBtn} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default Form;
