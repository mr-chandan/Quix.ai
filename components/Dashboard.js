import { React, useState, useEffect } from 'react'
import styles from '@/styles/admin.module.css'
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const Dashboard = ({ Comp, color }) => {
    const auth = getAuth();
    const router = useRouter();
    const [isDropped, setIsDropped] = useState(false);
    const [userName, setUserName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [userid, setUserid] = useState('');

    const handleBtnClick = () => {
        setIsDropped(!isDropped);
    };

    const handleProfilePicError = () => {
        setProfilePic('/user.png');
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserid(user.uid);
                setUserName(user.displayName);
                setProfilePic(user.photoURL);
            } else {
                router.push('/');
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.logo}>
                    <img src="/logo.png" />
                    <div className={styles.nam}>
                        <div>Quix</div>
                        <div className={styles.smallname}>.ai</div>
                    </div>
                </div>
                <div className={`${styles.btnbox} ${isDropped ? styles.drop : ''}`}>
                    <div className={`${styles.bb} ${color === 1 ? styles.back : ''}`} onClick={() => { router.push('/admin/createquix') }} > <img src="/dashboard.png" /> <div>Create Quiz</div></div>
                    <div className={`${styles.bb} ${color === 2 ? styles.back : ''}`} onClick={() => { router.push('/admin/managequix') }}> <img src="/managequize.png" /> <div>Manage Quiz</div></div>
                    <div className={`${styles.bb} ${color === 3 ? styles.back : ''}`} onClick={() => { router.push('/admin/subscription') }}> <img src="/subscription.png" /> <div>Subscription</div></div>
                    <div className={`${styles.bb} ${color === 4 ? styles.back : ''}`} onClick={() => { router.push('/admin/transcation') }} > <img src="/transcation.png" /> <div>Transcation</div></div>
                    <div className={`${styles.bb} ${color === 5 ? styles.back : ''}`} onClick={() => { router.push('/admin/settings') }}> <img src="/setting.png" /> <div>Settings</div></div>
                    <div className={styles.close} onClick={handleBtnClick}> <img src="/close.png"></img></div>
                </div>
                <div className={styles.btn} onClick={handleBtnClick}> <img src="/arrow.png"></img></div>
            </div>
            <div className={styles.header}>
                <div className={styles.txtname}>
                    <div className={styles.ftext}>Welcome back, </div>
                    <div className={styles.stext}>{userName}</div>
                </div>
                <div className={styles.left}>
                    <img src="/email.png" className={styles.img1} />
                    <img src="/bell.png" className={styles.img1} />
                    <img
                        src={profilePic ? profilePic : "/user.png"}
                        className={styles.img2}
                        onError={handleProfilePicError}
                    />
                </div>
            </div>
            <div className={styles.main}>
                {<Comp userid={userid} />}
            </div>
        </div>
    )
}

export default Dashboard;
