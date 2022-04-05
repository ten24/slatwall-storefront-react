import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useGetEntity } from '../../hooks/useAPI'
import { useSelector } from 'react-redux'
import queryString from 'query-string'
import { useUtilities } from '../useUtilities'

const useSearch = () => {
  const loc = useLocation()
  let params = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  const { augmentProductType } = useUtilities()

  const history = useHistory()

  const [productTypeListRequest, setProductTypeListRequest] = useGetEntity()
  const productTypeBase = useSelector(state => state.configuration.filtering.productTypeBase)
  const productTypeUrl = params['key'] || productTypeBase

  const crumbCalculator = () => {
    return productTypeListRequest.data
      ?.filter(productType => {
        return productTypeData?.productTypeIDPath?.includes(productType.productTypeID)
      })
      .map(crumb => {
        return { title: crumb.productTypeName, urlTitle: crumb.urlTitle }
      })
      .filter(crumb => crumb.urlTitle !== productTypeBase)
      .filter(crumb => crumb.urlTitle !== params['key'])
      .map(crumb => {
        return { ...crumb, urlTitle: `${loc.pathname}?${queryString.stringify({ ...params, key: crumb.urlTitle }, { arrayFormat: 'comma' })}` }
      })
  }
  useEffect(() => {
    if (!productTypeListRequest.isFetching && !productTypeListRequest.isLoaded) {
      setProductTypeListRequest({ ...productTypeListRequest, isFetching: true, isLoaded: false, entity: 'ProductType', params: { searchKeyword: params?.keyword, 'p:show': 250, includeSettingsInList: true }, makeRequest: true })
    }
  }, [productTypeUrl, params, productTypeListRequest, setProductTypeListRequest])

  useEffect(() => {
    const unload = history.listen(location => {
      let newParams = queryString.parse(location.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
      if (Object.keys(newParams).length === 1) {
        setProductTypeListRequest({ ...productTypeListRequest, isFetching: true, isLoaded: false, entity: 'ProductType', params: { searchKeyword: newParams?.keyword, 'p:show': 250, includeSettingsInList: true }, makeRequest: true })
      }
    })
    return () => {
      unload()
    }
  }, [productTypeListRequest, setProductTypeListRequest, history])

  let productTypeData = augmentProductType(productTypeUrl, productTypeListRequest.data)

  const forwardToSearch = productType => {
    if (productType?.childProductTypes?.length === 1) {
      return forwardToSearch(productType?.childProductTypes[0])
    } else if (productType?.childProductTypes?.length === 0) {
      return productType
    }
    return false
  }

  const leafProductType = forwardToSearch(productTypeData)

  if (leafProductType && leafProductType.urlTitle !== params['key']) {
    params['key'] = leafProductType.urlTitle
    history.replace(`${loc.pathname}?${queryString.stringify(params, { arrayFormat: 'comma' })}`)
  }

  return { keyword: params['keyword'], productTypeListRequest, productTypeData, params, pathname: loc.pathname, crumbCalculator, productTypeUrl }
}

export { useSearch }
