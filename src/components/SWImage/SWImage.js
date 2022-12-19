import { useSelector } from 'react-redux'
import defaultMissing from '../../assets/images/missing.png'
import defaultMissingBrand from '../../assets/images/missing-brand.png'
import defaultMissingProductType from '../../assets/images/missing-product-type.png'
import defaultMissingProduct from '../../assets/images/missing-product.png'
import { useState } from 'react'
import { useUtilities } from '../../hooks'

const SimpleImage = ({ className = '', src = '', alt = '', style = {}, type = 'product' }) => {
  const { host } = useSelector(state => state.configuration.theme)
  const [retryCount, setRetryCount] = useState(0)
  const [classList, setClassList] = useState([className])
  const applyHost = !(src?.includes('http://') || src?.includes('https://'))
  const onErrorCallback = e => {
    e.preventDefault()
    e.target.onerror = null
    const localRetryCount = retryCount + 1
    const showDefault = localRetryCount > 0 ? 'defaultImage' : ''
    setRetryCount(localRetryCount)
    setClassList([className, showDefault])
    if (type === 'product') {
      e.target.src = defaultMissingProduct
    } else if (type === 'productType') {
      e.target.src = defaultMissingProductType
    } else if (type === 'category') {
      e.target.src = defaultMissingProductType
    } else if (type === 'brand') {
      e.target.src = defaultMissingBrand
    } else if (type === 'none') {
      e.target.src = null
    } else {
      e.target.src = defaultMissing
    }
  }

  if (src) {
    return <img className={classList.join(' ')} src={applyHost ? `${host}${src}` : src} alt={alt} style={style} onError={onErrorCallback} />
  }
  return <DefaultImage className={`${className} defaultImage`} style={style} type={type} />
}

const DefaultImage = ({ alt = '', style, type, className = '' }) => {
  if (type === 'product') {
    return <img className={className} style={style} src={defaultMissingProduct} alt={alt} />
  } else if (type === 'productType') {
    return <img className={className} style={style} src={defaultMissingProductType} alt={alt} />
  } else if (type === 'brand') {
    return <img className={className} style={style} src={defaultMissingBrand} alt={alt} />
  }
  return <img className={className} style={style} src={defaultMissing} alt={alt} />
}
const AttributeImage = ({ alt = '', fileName = '', attributeName = 'imagePath', className = '' }) => {
  const { buildAttributeImageUrl } = useUtilities()
  const [imageIsMissing, setImageIsMissing] = useState(false)
  if (imageIsMissing) return null
  return (
    <img
      className={className}
      src={buildAttributeImageUrl({ fileName, attributeName })}
      alt={alt}
      onError={() => {
        setImageIsMissing(true)
      }}
    />
  )
  // <SimpleImage src={buildAttributeImageUrl({ fileName, attributeName })} className={className} alt={alt} type="" />
}
const SWImage = ({ className = '', customPath, src, alt = '', style = {}, type = 'product', fallbackPath = '' }) => {
  const { host, basePath } = useSelector(state => state.configuration.theme)
  const [retryCount, setRetryCount] = useState(0)
  const [classList, setClassList] = useState(['productImage', className])
  const path = customPath ? customPath : basePath

  const onErrorCallback = e => {
    e.preventDefault()
    e.target.onerror = null
    const localRetryCount = retryCount + 1
    const showFallback = fallbackPath.length && localRetryCount === 1 ? 'fallbackImage' : ''
    const showDefault = (fallbackPath.length && localRetryCount > 1) || (!fallbackPath.length && localRetryCount === 1) ? 'defaultImage' : ''
    setRetryCount(localRetryCount)
    setClassList(['productImage', className, showFallback, showDefault])
    if (type === 'product') {
      e.target.src = showFallback ? `${host}${fallbackPath}` : defaultMissingProduct
    } else if (type === 'productType') {
      e.target.src = defaultMissingProductType
    } else if (type === 'brand') {
      e.target.src = defaultMissingBrand
    } else {
      e.target.src = defaultMissing
    }
  }

  if (src) {
    return <img className={classList.join(' ')} src={path ? host + path + src : host + src} alt={alt} style={style} onError={onErrorCallback} />
  }
  return <DefaultImage className={className} style={style} type={type} />
}

export { SWImage, SimpleImage, AttributeImage }
