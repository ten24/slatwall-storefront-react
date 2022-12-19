import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { evictAllPages, getConfiguration, getUser, getWishLists } from './actions'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import App from './App'
import { DevTools, Theme } from './components'
import { ContentContextProvider, ComponentContextProvider, ElementContextProvider } from './contexts'

const AppSwitcher = () => {
  const { t } = useTranslation()
  const { pathname, search } = useLocation()
  const [safeToLoad, setSafeToLoad] = useState(false)
  const [configurationLoaded, setConfigurationLoaded] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (pathname.startsWith('/ssoLogin')) {
      const authCode = new URLSearchParams(search).get('token')
      const redirect = new URLSearchParams(search).get('redirect') || '/my-account/overview'
      localStorage.setItem('token', authCode)
      dispatch(evictAllPages())
      dispatch(getUser()).then(() => {
        dispatch(getWishLists())
        navigate(redirect)
        toast.success(t('frontend.account.auth.success'))
        setSafeToLoad(true)
      })
    } else {
      setSafeToLoad(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    dispatch(getConfiguration()).then(response => {
      setConfigurationLoaded(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (safeToLoad && configurationLoaded)
    return (
      <ElementContextProvider>
        <ComponentContextProvider>
          <ContentContextProvider>
            <Theme>
              <DevTools />
              <App />
            </Theme>
          </ContentContextProvider>
        </ComponentContextProvider>
      </ElementContextProvider>
    )
  return null
}

export { AppSwitcher }
