import React, { useState, useEffect } from 'react';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { db } from './../lib/firebase';
import styles from '@/styles/stats.module.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const Stats = () => {
    const [responsedata, setresponsedata] = useState([]);
    const [question, setquestion] = useState([]);
    const [onclickdata, setonclickdata] = useState(0);
    const router = useRouter();
    const qid = router.query.qid;

    useEffect(() => {
        if (qid !== undefined) {
            fetchanaswers(qid);
            fetchQuestions(qid);
        }
    }, [qid, router]);

    const fetchanaswers = async (qid) => {
        try {
            const formsRef = collection(db, 'McqFormsAnswers');
            const q = query(formsRef, where('formsRef', '==', qid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const questionsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setresponsedata(questionsData);
                console.log(questionsData);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const data = [
        { name: 'Group A', value: responsedata[onclickdata]?.formData?.score },
        { name: 'Group B', value: question.length },
    ];

    const COLORS = ['#C4B0FF', '#4942E4'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const fetchQuestions = async (qid) => {
        try {
            const formsRef = collection(db, 'McqForms');
            const q = query(formsRef, where('questionid', '==', qid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const questionsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setquestion(questionsData[0].jsonmcq.questions);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error(error);
        }
    };


    if (responsedata.length == 0) {
        return <div className={styles.lod}>
            <div className={styles.lods}>
                <img src='/foundno.gif' />
                No response found for the quiz
            </div>
        </div>;
    }

    console.log(responsedata);
    console.log(question);

    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <div>No of participants: {responsedata.length}</div>
                <div>Form Id: {responsedata[0]?.formsRef}</div>
            </div>
            <div className={styles.grid}>
                <div className={styles.grid1}>
                    <div className={styles.singnametop}>
                        <div>Name</div>
                        <div>Score</div>
                    </div>
                    {responsedata.map((data, index) => (
                        <div
                            key={index}
                            className={styles.singname}
                            onClick={() => setonclickdata(index)}
                        >
                            <div>{data.username}</div>
                            <div>{data.formData.score}</div>
                        </div>
                    ))}
                </div>
                <div className={styles.grid2}>
                    <div className={styles.donut}>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div>Marks by percentage</div>
                    </div>
                    <div className={styles.formdata}>
                        <div className={styles.qna2}>
                            <div className={styles.question}><div>Questions</div></div>
                            <div className={styles.answers}>
                                <div>Correct Answers</div>
                                <div>
                                    <div>Selected Answers</div>
                                </div>
                            </div>
                        </div>
                        {responsedata[onclickdata]?.formData?.selectedAnswers.map(
                            (data, index) => (
                                <div key={index} className={styles.qna}>
                                    <div className={styles.question}>{question[index]?.question}</div>
                                    <div className={styles.answers}>
                                        <div>{question[index]?.answer}</div>
                                        <div>
                                            <div>{data ? data : "Not answered"}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
