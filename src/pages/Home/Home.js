import React from 'react'
import { useSelector } from 'react-redux'
import { ContentSlider, ProductSliderWithConfig, BrandSlider, ContentColumns, Layout, LatestNews, ContentBlock, ActionBanner } from '../../components'
import { useTranslation } from 'react-i18next'
function Home() {
  const { home = {} } = useSelector(state => state.content)
  const { callToAction, popularProducts, contentColumns, slider } = home

  const { t } = useTranslation()
  return (
    <Layout>
      <ContentSlider slider={slider} />

      <section className="content-spacer product-slider-sec">
        <ProductSliderWithConfig
          title={popularProducts?.title || t('frontend.home.popular_products')}
          params={{
            'f:publishedFlag': 1,
            'f:productFeaturedFlag': 1,
          }}
        />
      </section>
      {contentColumns?.columns?.length > 0 && (
        <ContentColumns title={contentColumns.title}>
          <div className="row justify-content-center">
            {contentColumns.columns.map((column, idx) => {
              return (
                <div key={idx} className={`col-lg-${12 / contentColumns.columns.length} pr-4-lg`}>
                  <ContentBlock {...column} />
                </div>
              )
            })}
          </div>
        </ContentColumns>
      )}

      <BrandSlider params={{ 'f:brandFeatured': 1 }} />
      <LatestNews />
      <ActionBanner data={callToAction} />
    </Layout>
  )
}

export default Home
