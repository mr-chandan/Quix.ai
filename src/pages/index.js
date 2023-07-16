import { useEffect, useState } from 'react';
import styles from '@/styles/index.module.css';
import Loginbtn from '../../components/Loginbtn';
import { useRouter } from 'next/router';
import { app } from "../../lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import TextTransition, { presets } from 'react-text-transition';


const Index = () => {
    const router = useRouter();
    const auth = getAuth(app);
    const [isLoading, setIsLoading] = useState(true);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push("/admin/createquix");
            } else {
                setIsLoading(false);
            }
        });
        const intervalId = setInterval(
            () => setIndex((index) => index + 1),
            3000, // every 3 seconds
        );
        return () => {
            unsubscribe();
            clearTimeout(intervalId);
        };
    }, []);

    if (isLoading) {
        return <div className={styles.lod}>
            <div  className={styles.lods}>
                <img src='/Book.gif' />
                Loading...
            </div>
        </div>;
    }

    const TEXTS = ['MCQ', 'T/F', 'Short answers', 'Fill in the blanks'];

    return (
        <div className={styles.bg}>
            <div className={styles.container}>
                <div className={styles.nav}>
                    <div className={styles.logo}>
                        <img src='logo.png' alt="Logo" />
                        <div className={styles.nam}>
                            <div>Quix</div>
                            <div className={styles.smallname}>.ai</div>
                        </div>
                    </div>
                    <Loginbtn />
                </div>
                <div className={styles.grid}>
                    <div className={styles.grid1} >
                        <div className={styles.txtchng}>
                            <div>The Best tool for generating <br /> questions!
                                <TextTransition className={styles.big} springConfig={presets.wobbly}>{TEXTS[index % TEXTS.length]}</TextTransition></div>
                        </div>
                        <div className={styles.gridtxt}>Quix.ai is an innovative question generator tool designed to generate questions from various types of input sources such as PDFs, texts, external links, tpoic and more.</div>
                    </div>
                    <div className={styles.grid2}>
                        <img src='homeimg.png' alt="Logo" className={styles.im} />
                    </div>

                </div>
            </div></div>
    );
};

export default Index;
