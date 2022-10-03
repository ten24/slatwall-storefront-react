import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getWishLists, receiveContent, requestContent } from '../../../actions'
import { getBlogRoute, getProductRoute } from '../../../selectors'
import { SlatwallCMSService } from '../../../services'

const SlatwallCMS = ({ children, additionalProcessing = response => response }) => {
  const { pathname } = useLocation('home')
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)
  const conData = useSelector(state => state.content)
  const blogRoute = useSelector(getBlogRoute)
  const productRoute = useSelector(getProductRoute)

  const dispatch = useDispatch()
  const requestUltraPageContent = payload => {
    if (payload.productUrlTitle && payload.urlTitle) {
    } else if (payload.productUrlTitle) {
      if (conData[`${payload.productRoute}/${payload.productUrlTitle}`]) {
        return
      }
    } else if (payload.urlTitle) {
      if (conData[payload.urlTitle]) {
        return
      }
    }
    dispatch(requestContent())
    SlatwallCMSService.getEntryBySlug(payload)
      .then(({ response, hydrated }) => {
        hydrated = additionalProcessing({ response, hydrated })
        return { response, hydrated }
      })
      .then(({ hydrated }) => {
        dispatch(receiveContent(hydrated))
      })
  }

  useEffect(() => {
    if (!isLoaded) {
      let basePath = pathname.split('/')[1].toLowerCase()
      basePath = basePath.length ? basePath : 'home'
      dispatch(getWishLists())
      if (basePath === blogRoute) {
        requestUltraPageContent({
          urlTitle: '404',
          'p:show': 500,
          includeImages: true,
          includeCategories: true,
          includeGlobalContent: true,
          includeAllBrand: true,
          includeAllCategory: true,
          includeAllProductType: true,
          includeHeader: true,
          includeFooter: true,
          restRequestFlag: 1,
          enforceAuthorization: true,
          useAuthorizedPropertiesAsDefaultColumns: true,
          setDisplayPropertiesSearchable: true,
        })
      } else if (basePath === productRoute) {
        const productUrlTitle = pathname.split('/').reverse()?.at(0).toLowerCase()

        requestUltraPageContent({
          urlTitle: '404',
          productUrlTitle,
          productRoute,
          'p:show': 500,
          includeImages: true,
          includeCategories: true,
          includeGlobalContent: true,
          includeAllBrand: true,
          includeAllCategory: true,
          includeAllProductType: true,
          includeHeader: true,
          includeFooter: true,
          restRequestFlag: 1,
          enforceAuthorization: true,
          useAuthorizedPropertiesAsDefaultColumns: true,
          setDisplayPropertiesSearchable: true,
        })
      } else {
        requestUltraPageContent({
          urlTitle: pathname !== '/' ? basePath : 'home',
          includeGlobalContent: true,
          includeAllBrand: true,
          includeAllCategory: true,
          includeAllProductType: true,
          includeHeader: true,
          'p:show': 500,
          includeFooter: true,
          includeImages: true,
          includeCategories: true,
        })
        requestUltraPageContent({
          urlTitle: '404',
          'p:show': 500,
          includeImages: true,
          includeCategories: true,
        })
      }

      setIsLoaded(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {

    if (pathname !== currentPath) {
      let newPath = pathname.split('/')[1].toLowerCase()
      newPath = newPath.length ? newPath : 'home'
      setCurrentPath(pathname)
      if (newPath === productRoute) {
        const productUrlTitle = pathname.split('/').reverse()?.at(0)?.toLowerCase()
        requestUltraPageContent({
          productUrlTitle,
          productRoute,
          'p:show': 500,
          includeImages: true,
          includeCategories: true,
        })
      } else {
        requestUltraPageContent({
          urlTitle: pathname !== '/' ? newPath : 'home',
          'p:show': 500,
          includeImages: true,
          includeCategories: true,
        })
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return children
}

export { SlatwallCMS }
