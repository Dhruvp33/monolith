import { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { getFullPageHTML, getAllSlugs } from '../lib/wordpress';

export default function WordPressPage({ pageData }) {
  
  // This useEffect hook runs on the browser after the page loads.
  // --- REPLACE YOUR EXISTING useEffect WITH THIS ---
   // This logic re-runs every time you navigate to a new page.
  // --- REPLACE YOUR EXISTING useEffect WITH THIS ---
  useEffect(() => {
  console.log('🔍 useEffect running, looking for form...');
  
  // Wait a bit for CF7 scripts to load
  setTimeout(() => {
    const contactForm = document.querySelector('form.wpcf7-form');
    
    console.log('📋 Form found:', contactForm ? 'YES ✅' : 'NO ❌');
    
    if (contactForm) {
      console.log('✅ Form found! Removing action and adding handler...');
      
      // CRITICAL: Remove the form action to prevent page reload
      contactForm.removeAttribute('action');
      
      const handleSubmit = async (event) => {
        console.log('🚀 Form submit triggered!');
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        const formData = new FormData(event.target);
        const responseElement = contactForm.querySelector('.wpcf7-response-output');

        if (responseElement) {
          responseElement.textContent = 'Sending...';
          responseElement.classList.remove('wpcf7-mail-sent-ok', 'wpcf7-mail-sent-ng');
          responseElement.style.display = 'block';
        }

        console.log('📤 Submitting to API...');

        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          console.log('📨 API Response:', result);

          if (response.ok && result.status === 'mail_sent') {
            if (responseElement) {
              responseElement.textContent = result.message;
              responseElement.classList.add('wpcf7-mail-sent-ok');
            }
            contactForm.reset();
            alert('✅ Message sent successfully!');
          } else {
            if (responseElement) {
              responseElement.textContent = result.message || 'An error occurred.';
              responseElement.classList.add('wpcf7-mail-sent-ng');
            }
            alert('❌ Error: ' + (result.message || 'Failed to send'));
          }
        } catch (error) {
          console.error('❌ Fetch error:', error);
          if (responseElement) {
            responseElement.textContent = 'An unexpected error occurred.';
            responseElement.classList.add('wpcf7-mail-sent-ng');
          }
          alert('❌ Network error occurred');
        }
      };

      // Add event listener with capture phase to catch it before CF7
      contactForm.addEventListener('submit', handleSubmit, true);

      return () => {
        console.log('🧹 Cleaning up event listener');
        contactForm.removeEventListener('submit', handleSubmit, true);
      };
    } else {
      console.log('⚠️ No contact form found on this page');
    }
  }, 500); // Wait 500ms for CF7 scripts to initialize

}, [pageData]); // This logic re-runs every time you navigate to a new page.

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