import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'product'
  price?: string
  currency?: string
}

export default function SEO({ 
  title, 
  description, 
  image, 
  url,
  type = 'website',
  price,
  currency = 'XOF'
}: SEOProps) {
  const siteName = 'R-Market'
  const defaultImage = 'https://i.ibb.co/QnTr9zG/r-market-logo.png'
  const fullTitle = `${title} | ${siteName}`
  const fullUrl = url || 'https://r-market.shop'

  return (
    <Helmet>
      {/* Standard */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/logo.svg" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Product specific */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content="instock" />
          <meta property="product:condition" content="new" />
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@rmarket" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* WhatsApp / Telegram */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Mobile */}
      <meta name="theme-color" content="#16a34a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Robots */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  )
}
