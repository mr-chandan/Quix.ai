import React from 'react'
import styles from "@/styles/Make.module.css"
import { useRouter } from 'next/router';

const Make = () => {
  const router = useRouter();
  return (
    <div className={styles.grid}>
      <div className={styles.gridcon} onClick={() => { router.push('/admin/createquix/topic') }}><div className={styles.servicelg}><img src='/topic.png' /> <div>Topic</div></div> <div className={styles.txt}>Enter a topic name from any fields and generate questions</div></div>
      <div className={styles.gridcon} onClick={() => { router.push('/admin/createquix/text') }}><div className={styles.servicelg}><img src='/text.png' /> <div>Text</div></div><div className={styles.txt}>Enter a text/paragraph and generate questions from the given Paragraph</div></div>
      <div className={styles.gridcon} onClick={() => { router.push('/admin/createquix/pdf') }}><div className={styles.servicelg}><img src='/pdf.png' /> <div>Pdf</div></div><div className={styles.txt}>Attach a pdf and get questions generated from the content of the pdf</div></div>
      <div  className={styles.gridcon} onClick={() => { router.push('/admin/createquix/link') }}><div className={styles.servicelg}><img src='/link.png' /> <div>Link</div></div><div className={styles.txt}>Enter a link to a external webpage which contains content and questions will be generated based on the content   (  coming soon !! )</div></div>
      <div  className={styles.gridcon} ><div className={styles.servicelg}><img src='/yt.png' /> <div></div></div><div className={styles.txt}>Enter a YouTube link which contains the required content and generate questions from the video   (  coming soon !! )</div></div>
    </div>
  )
}

export default Make