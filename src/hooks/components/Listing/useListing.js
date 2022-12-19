import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { getErrorMessage, processQueryParameters } from '../../../utils'
import { useDeepCompareEffect } from 'react-use'
import { SlatwalApiService, axios } from '../../../services'
import { useState } from 'react'

const buildPath = params => {
  return queryString.stringify(params, { arrayFormat: 'comma' })
}

const useReconcile = ({ option, brand, attribute, category, priceRange, productType }) => {
  const loc = useLocation()
  let core = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  let queryStringParams = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  const evaluation = props => {
    const { qs, facetKey, facetIdentifier, filter } = props
    if (qs[facetKey] && qs[facetKey].length) {
      let params = Array.isArray(qs[facetKey]) ? qs[facetKey] : [qs[facetKey]]
      const missingFilter = params.filter(optionToValidate => (!filter.options.filter(opt => opt[facetIdentifier] === optionToValidate).map(data => data).length ? optionToValidate : false)).filter(data => data)
      if (missingFilter.length > 0) {
        qs[facetKey] = params.filter(param => !missingFilter.includes(param))
        return qs
      }
    }
    return qs
  }

  if (category && category !== {}) {
    ;[category].forEach(filter => {
      queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'slug', facetKey: `category_slug` })
    })
  } else {
    Object.keys(queryStringParams)
      .filter(paramKey => paramKey === 'category_slug')
      .forEach(keyToDelete => {
        delete queryStringParams[keyToDelete]
      })
  }
  if (productType && productType !== {}) {
    ;[productType].forEach(filter => {
      queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'slug', facetKey: `productType_slug` })
    })
  }
  if (brand && brand !== {})
    [brand].forEach(filter => {
      queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'slug', facetKey: `brand_slug` })
    })

  if (priceRange && priceRange !== {})
    [priceRange].forEach(filter => {
      queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'value', facetKey: `priceRange` })
    })

  if (attribute && attribute.sortedSubFacets) {
    attribute.sortedSubFacets.forEach(filter => {
      queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'name', facetKey: `attribute_${filter.subFacetKey}` })
    })
  } else {
    Object.keys(queryStringParams)
      .filter(paramKey => paramKey.includes('attribute_'))
      .forEach(keyToDelete => {
        delete queryStringParams[keyToDelete]
      })
  }

  if (option && option.sortedSubFacets) {
    option.sortedSubFacets.forEach(filter => {
      queryStringParams = evaluation({ filter, qs: queryStringParams, facetIdentifier: 'name', facetKey: `option_${filter.subFacetKey}` })
    })
  } else {
    Object.keys(queryStringParams)
      .filter(paramKey => paramKey.includes('option_'))
      .forEach(keyToDelete => {
        delete queryStringParams[keyToDelete]
      })
  }
  return { shouldUpdate: JSON.stringify(queryStringParams) !== JSON.stringify(core), queryStringParams }
}

const paramsIncludesForcedFilter = (searchConfig, params) => {
  if (searchConfig?.forcedFilterOptions?.length) {
    let resetFilters = false
    Object.keys(params).forEach(param => {
      const [paramType] = param.split('_')

      // test for exact match brand_slug
      if (searchConfig.forcedFilterOptions.includes(param) && params[param]?.length) resetFilters = true

      // test for for forced prefix like brand
      searchConfig.forcedFilterOptions.forEach(ffo => {
        if (ffo.startsWith(paramType) && params[param]?.length) resetFilters = true
      })
      return param
    })
    return resetFilters
  }
  return true
}

const useListing = (preFilter, searchConfig) => {
  let [isFetching, setFetching] = useState(true)
  let [records, setRecords] = useState([])
  let [total, setTotal] = useState(0)
  let [pageSize, setPageSize] = useState(12)
  let [totalPages, setTotalPages] = useState(1)
  let [potentialFilters, setPotentialFilters] = useState({})
  let [error, setError] = useState({ isError: false, message: '' })

  const loc = useLocation()
  // let listings = useSelector(state => state.configuration.listings)
  let productSearch = searchConfig.params
  let initialData = searchConfig.filters

  const navigate = useNavigate()
  let params = processQueryParameters(loc.search)
  params = { ...initialData, ...params, ...preFilter }
  const returnFacetList = paramsIncludesForcedFilter(searchConfig, params) ? searchConfig.returnFacetListWithFilter : [...new Set(searchConfig.forcedFilterOptions.map(filteropt => filteropt.split('_').at(0)))].join(',')
  const selectedLocale = { lang: localStorage.getItem('i18nextLng') ? localStorage.getItem('i18nextLng') : 'en_us' }
  const payload = { ...params, ...productSearch, ...selectedLocale, returnFacetList }

  useDeepCompareEffect(() => {
    let source = axios.CancelToken.source()
    setFetching(true)
    SlatwalApiService.products.search(payload, {}, source).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) setError({ isError: true, message: getErrorMessage(response.success().errors) })
      if (response.isSuccess()) {
        const data = response.success().data
        if (!!data.products && Array.isArray(data.products)) {
          const products = data.products.map(sku => {
            return { ...sku, salePrice: sku.skuPrice, productName: sku.product_productName, urlTitle: sku.product_urlTitle, productCode: sku.product_productCode, imageFile: sku.sku_imageFile, skuID: sku.sku_skuID, skuCode: sku.sku_skuCode }
          })

          setRecords(products)
        } else {
          setRecords([])
        }
        if (data.potentialFilters) {
          let cleanFilters = {}
          const complexFacets = ['option', 'attribute']
          const simpleFacets = ['brand', 'productType', 'category', 'sorting', 'priceRange']
          simpleFacets.forEach(key => {
            if (key in data.potentialFilters) {
              cleanFilters[key] = { ...data.potentialFilters[key] }
              cleanFilters[key].options.sort((a, b) => {
                return a.sortOrder - b.sortOrder
              })
            }
          })
          complexFacets.forEach(key => {
            if (key in data.potentialFilters) {
              cleanFilters[key] = { ...data.potentialFilters[key] }
              Object.keys(cleanFilters[key].subFacets).forEach(subfacetKey => {
                cleanFilters[key].subFacets[subfacetKey].options.sort((a, b) => {
                  return a.sortOrder - b.sortOrder
                })
              })
              cleanFilters[key].sortedSubFacets = Object.keys(cleanFilters[key].subFacets)
                .map(subFacet => {
                  return cleanFilters[key].subFacets[subFacet]
                })
                .sort((a, b) => {
                  return a.sortOrder - b.sortOrder
                })
              delete cleanFilters[key].subFacets
            }
          })
          setPotentialFilters(cleanFilters)
        } else {
          setPotentialFilters({})
        }

        setTotal(data.total)
        setTotalPages(Math.ceil(data.total / data.pageSize))
        setError({ isError: false, message: '' })
      } else {
        setRecords([])
        setPotentialFilters({})
        setTotal(0)
        setPageSize(12)
        setTotalPages(1)
        setError({ isError: true, message: 'Something was wrong' })
      }
      setFetching(false)
    })

    return () => {
      source.cancel()
    }
  }, [payload])

  const { shouldUpdate, queryStringParams } = useReconcile({ ...potentialFilters })
  const setPage = pageNumber => {
    params['currentPage'] = pageNumber
    navigate({
      pathname: loc.pathname,
      search: buildPath(params, { arrayFormat: 'comma' }),
    })
  }
  const setKeyword = keyword => {
    params = { ...initialData, ...preFilter, orderBy: params.orderBy, keyword: keyword }
    navigate({
      pathname: loc.pathname,
      search: buildPath(params, { arrayFormat: 'comma' }),
    })
  }
  const setSort = orderBy => {
    params['orderBy'] = orderBy
    params['currentPage'] = 1
    navigate({
      pathname: loc.pathname,
      search: buildPath(params, { arrayFormat: 'comma' }),
    })
  }
  const updateAttribute = attribute => {
    let attributeFilters = params[attribute.filterName]?.split(',').filter(data => data) || []
    if (attributeFilters.includes(attribute.name)) {
      attributeFilters = attributeFilters.filter(item => item !== attribute.name)
    } else {
      attributeFilters.push(attribute.name)
    }

    params[attribute.filterName] = attributeFilters
    params['currentPage'] = 1

    if (!paramsIncludesForcedFilter(searchConfig, params)) {
      params = { ...initialData, ...preFilter, orderBy: params.orderBy, keyword: params.keyword }
    }

    navigate({
      pathname: loc.pathname,
      search: buildPath(params, { arrayFormat: 'comma' }),
    })
  }

  if (shouldUpdate && !isFetching) {
    const path = queryString.stringify(queryStringParams, { arrayFormat: 'comma' })
    params = processQueryParameters(path)
    navigate({
      pathname: loc.pathname,
      search: path,
    })
  }

  return { records, pageSize, potentialFilters, isFetching, total, totalPages, error, setSort, updateAttribute, setPage, setKeyword, params }
}

export { useListing }
