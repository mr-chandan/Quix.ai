import styles from '@/styles/index.module.css'
import { app } from "../lib/firebase"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";



const Loginbtn = () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider()
    function start() {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result)
            }).catch((error) => {

            });
    }

    return (
        <div className={styles.profile} onClick={start}>
            <div className={styles.login}>Sign up now</div>
        </div>
    )
}

export default Loginbtn