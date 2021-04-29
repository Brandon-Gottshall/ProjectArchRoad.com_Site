import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

export default function Home () {
  const router = useRouter()
  const navigateTo = (route) => router.push(route)
  return (
    <div className={styles.container}>
      <Head>
        <title>Project Arch Road</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Project Arch Road
        </h1>
        <h1 className={styles.subTitle}>
          Summer 2021
        </h1>
        <div className={styles.buttonFlexContainer}>
          <button onClick={() => navigateTo('/md/privacy')}>Privacy Policy</button>
          <button onClick={() => navigateTo('/md/terms')}>Terms of Service</button>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <img src='/vercel.svg' alt='Vercel Logo' className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
