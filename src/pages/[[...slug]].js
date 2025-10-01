import Head from 'next/head';
import Script from 'next/script';
import { getFullPageHTML, getAllSlugs } from '../lib/wordpress';

export default function WordPressPage({ pageData }) {
  if (!pageData) {
    return <div>Page not found or failed to load.</div>;
  }
  
  const configScript = pageData.scripts.find(s => s.type === 'inline' && s.content.includes('elementorFrontendConfig'));

  return (
    <>
      <Head>
        <title>{pageData.title}</title>
        {pageData.styleLinks.map((href, index) => (
          <link key={index} rel="stylesheet" href={href} />
        ))}
        {configScript && (
          <script dangerouslySetInnerHTML={{ __html: configScript.content }} />
        )}
      </Head>
      
      <div 
        className={pageData.bodyClasses}
        dangerouslySetInnerHTML={{ __html: pageData.bodyContent }}
      />
      
      {pageData.scripts
        .filter(s => s.type === 'src')
        .map((script, index) => (
          <Script key={index} src={script.content} strategy="lazyOnload" />
      ))}
    </>
  );
}

export async function getStaticPaths() {
  const slugs = await getAllSlugs();
  const paths = slugs.map(slug => ({
    params: { slug: slug === 'home' ? [] : slug.split('/') } 
  }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const slug = params?.slug ? params.slug.join('/') : 'home';
  const pageData = await getFullPageHTML(slug);

  if (!pageData) {
    return { notFound: true };
  }

  return {
    props: { pageData },
    revalidate: 60
  };
}