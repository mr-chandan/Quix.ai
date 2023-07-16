import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from "@/styles/forms.module.css";
import { db, app } from '../../../lib/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, getDocs, where, query } from 'firebase/firestore';
import axios from 'axios';

const Qid = () => {
  const router = useRouter();
  const qid = router.query.qid;
  const [auth, setAuth] = useState(null); // Store auth in a state

  const provider = new GoogleAuthProvider();

  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [formid, setformid] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [check, setcheck] = useState(false);


  useEffect(() => {
    async function fetchQuestions() {
      try {
        const formsRef = collection(db, 'McqForms');
        const q = query(formsRef, where('questionid', '==', qid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const questionsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setformid(questionsData[0].id);
          setQuestions(questionsData[0].jsonmcq.questions);
          setSelectedAnswers(Array(questionsData[0].jsonmcq.questions.length).fill(''));
        } else {
          setcheck(true)
          console.log('No such document!');
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (qid) {
      fetchQuestions();
    }
  }, [qid, router]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOptionChange = (questionIndex, selectedOption) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[questionIndex] = selectedOption;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!auth) {
      setError('Pls login first');
      setIsLoading(false);
      return;
    }

    const currentUser = auth.currentUser.uid;
    const score = calculateScore();
    const formData = {
      selectedAnswers,
      score
    };
    console.log(formData);

    if (!currentUser || !inputValue) {
      setError('Please enter the name');
      setIsLoading(false);
      return;
    }

    if (!formid) {
      setError('Technical error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/formsubmit", { formid: qid, formData, username: inputValue, userid: currentUser });
      router.push('/');
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
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

  function start() {
    const auth = getAuth(app); // Initialize auth
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        setAuth(auth); // Update the auth state
      }).catch((error) => {
        console.log(error);
      });
  }

  if (check && questions.length === 0) {
    return (
      <div className={styles.lod}>
        <div className={styles.lods}>
          <img src="/foundno.gif" alt="No Data found" />
          No Data found
        </div>
      </div>
    );
  }

  return (<>
    {questions.length > 0 ? (
      <div className={styles.forms}>
        <>
          <div className={styles.who}>
            <div className={styles.name}>
              <div>This is created Using ,</div>
              <div className={styles.relname}>Quix.ai</div>
            </div>
            <div className={styles.text}>
              Please log in with your Google Account below before answering or submitting the test.
            </div>
          </div>
          <div className={styles.google} onClick={start}>
            <div className={styles.g}>
              <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google Icon" />
              <div>Login With Google</div>
            </div>
          </div>
          <div className={styles.inpname}>
            <div>What is your name?</div>
            <input type="text" value={inputValue} onChange={handleInputChange} />
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
                      checked={selectedAnswers[index] === option}
                      onChange={() => handleOptionChange(index, option)}
                    />
                    <label htmlFor={`q${index}-option${optionIndex}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className={styles.btnname}>
            {error && <div className={styles.error}>{error}</div>}
            <button className={styles.submitBtn} onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </>
      </div>
    ) : (
      <div className={styles.lod}>
        <div className={styles.lods}>
          <img src="/Book.gif" alt="Loading" />
          Loading...
        </div>
      </div>
    )}

  </>);
};

export default Qid;
