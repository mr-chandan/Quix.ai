import { db } from "../../../lib/firebase"
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";


export default async function handle(req, res) {
    if (req.method === "POST") {
        const { formid, formData, username, userid } = req.body;

        //testing
        // const formsDocRef = doc(db, 'McqForms', formid);

        const formAnswerData = {
            formData,
            username,
            formsRef: formid,
        };

        // const formsDocSnapshot = await getDoc(formsDocRef);

        // if (formsDocSnapshot.exists()) {
        try {
            const docRef = await addDoc(collection(db, "McqFormsAnswers"), formAnswerData);
            res.status(200).json({ "sucess": "sucess" })
        } catch (error) {
            res.status(500).json({ "Fail": "Fail" })
            console.log("formsDocRef does not exist");
        }


    }
}
