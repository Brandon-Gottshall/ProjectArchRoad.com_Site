import fs from 'fs'
import path from 'path'
import hydrate from 'next-mdx-remote/hydrate'
import renderToString from 'next-mdx-remote/render-to-string'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import matter from 'gray-matter'
import Layout from '../../components/Layout'
import { postFilePaths, POSTS_PATH } from '../../utils/mdxUtils'
import style from '../../styles/MD.module.css'

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const childLinks = {
  thirdParty: [
    {link: "https://firebase.google.com/support/privacy/", text: 'Firebase Crashlytics'},
    {link: "https://www.google.com/policies/privacy/", text: 'Google Play Services'},
    {link: "https://firebase.google.com/policies/analytics", text: 'Google Analytics for Firebase'},
  ],
  reason: ['To facilitate our Service', 'To provide the Service on our behalf', 'To perform Service-related services', 'To assist us in analyzing how our Service is used']
}
const components = {
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  Title: ({children}) => (<h1 className={style.title}>{children}</h1>),
  ThirdPartyLinks: () => (
    <ul className={style.listStyle}>
      {
        childLinks.thirdParty.map(({link, text}) => <li key={text}><a href={link}>{text}</a></li>)
      }
      
    </ul>
  ),
  ReasonsList: () => (
    <ul className={style.listStyle}>
      {
        childLinks.reason.map(text => <li key={text}>{text}</li>)
      }
    </ul>
  ),
  Divider: () => (<div className={style.spacer}></div>)
}

export default function mdRender({ source, frontMatter }) {
  const content = hydrate(source, { components })
  return (
    <Layout>
      <header>
        <nav>
          <Link href="/">
            <a>👈 Go back home</a>
          </Link>
        </nav>
      </header>
      <div className="post-header">
        <h1>{frontMatter.title}</h1>
        {frontMatter.description && (
          <p className="description">{frontMatter.description}</p>
        )}
      </div>
      <main>{content}</main>

      <style jsx>{`
        .post-header h1 {
          margin-bottom: 0;
        }
        .post-header {
          margin-bottom: 2rem;
        }
        .description {
          opacity: 0.6;
        }
      `}</style>
    </Layout>
  )
}

export const getStaticProps = async ({ params }) => {
  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`)
  const source = fs.readFileSync(postFilePath)

  const { content, data } = matter(source)

  const mdxSource = await renderToString(content, {
    components,
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: data,
  })

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  }
}

export const getStaticPaths = async () => {
  const paths = postFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}