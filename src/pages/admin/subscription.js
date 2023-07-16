import Head from 'next/head'
import { React, useState, useEffect } from 'react'
// import styles from '@/styles/Home.module.css'
import Dashboard from '../../../components/Dashboard'
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from 'next/router';
import { app } from "../../../lib/firebase";
import Subscription from '../../../components/Subscription'

export default function Home() {
  const auth = getAuth(app);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
            router.push("/");
        }
    });
    return () => { unsubscribe(); }
}, []);


  return (<>
    <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Dashboard Comp={Subscription} color={3}/>
  </>
  )
} 
