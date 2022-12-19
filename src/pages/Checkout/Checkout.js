import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes as RouterRoutes, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import * as Sentry from '@sentry/react'
import { getCurrentStep } from '../../components/Checkout/steps'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { ThreeDSRedirect } from '../../components/ThreeDSRedirect/ThreeDSRedirect'
import { RedirectWithReplace } from '../../components/RedirectWithReplace/RedirectWithReplace'
import { clearUser, receiveUser } from '../../actions/userActions'
import { requestLogOut } from '../../actions/authActions'
import { receiveCart, requestCart } from '../../actions/orderActions'
import { getErrorMessage, isAuthenticated } from '../../utils'
import { SlatwalApiService } from '../../services/SlatwalApiService'
import DynamicPage from '../DynamicPage/DynamicPage'
import './checkout.css'
import { useElementContext } from '../../contexts/ElementContextProvider'

const Routes = Sentry.withSentryReactRouterV6Routing(RouterRoutes)

const Checkout = () => {
  const { AccountLogin, CheckoutSideBar, StepsHeader, ShippingSlide, PaymentSlide, ReviewSlide, CreateGuestAccount } = useElementContext()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const path = pathname.split('/').reverse()?.at(0).toLowerCase()

  const currentStep = getCurrentStep(path)
  const { verifiedAccountFlag, isFetching, accountID, calculatedGuestAccountFlag = false } = useSelector(state => state.userReducer)
  const enforceVerifiedAccountFlag = useSelector(state => state.configuration.enforceVerifiedAccountFlag)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const cartState = useSelector(state => state.cart) // check if there is some change in state , just to run use effect
  const [threeDSRedirect, setThreeDSRedirect] = useState()

  const placeOrder = event => {
    event.preventDefault()
    dispatch(requestCart())
    // Store the hash for guest Checkout
    const payload = !!calculatedGuestAccountFlag ? 'cart,account' : 'cart'
    SlatwalApiService.cart.placeOrder({ returnJSONObjects: payload, transactionInitiator: 'ACCOUNT' }).then(response => {
      if (response.isSuccess()) {
        const placeOrderResp = response.success()
        const orderHasError = Object.keys(placeOrderResp?.errors || {})?.length > 0
        if (placeOrderResp?.redirectUrl) {
          const { redirectUrl, redirectPayload, redirectMethod } = placeOrderResp
          setThreeDSRedirect({ redirectUrl, redirectPayload, redirectMethod })
        } else {
          if (orderHasError) {
            toast.error(getErrorMessage(response.success().errors))
          } else {
            dispatch(receiveCart(placeOrderResp.cart))
            dispatch(receiveUser(placeOrderResp.account))
            // TODO: verify isGuest
            if (!!calculatedGuestAccountFlag) {
              navigate(`/my-account/order-detail?token=${cartState.orderID}:${accountID}`)
            } else {
              navigate('/order-confirmation')
            }
          }
        }
      } else {
        toast.error(t('frontend.core.error.network'))
        dispatch(receiveCart())
      }
    })
  }
  useEffect(() => {
    if (!isAuthenticated()) {
      dispatch(clearUser())
      dispatch(requestLogOut())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (enforceVerifiedAccountFlag && !verifiedAccountFlag && isAuthenticated() && !isFetching && accountID.length > 0) return <Navigate to="/account-verification" />

  return (
    <DynamicPage ignoreLayout={true}>
      <PageHeader />
      <div className="container pb-5 mb-2 mb-md-4">
        {!isAuthenticated() && (
          <div className="row">
            <section className="col">
              {/* <!-- Steps--> */}
              <Routes>
                <Route path={`createGuestAccount`} element={<CreateGuestAccount />} />
                <Route path={`cart`} element={<RedirectWithReplace pathname={`../../shopping-cart`} />} />
                <Route path={`*`} element={<AccountLogin isCheckout={true} />} />
              </Routes>
            </section>
            {/* <!-- Sidebar--> */}
          </div>
        )}
        {isAuthenticated() && (
          <div className="row">
            <section className="col-lg-8">
              {/* <!-- Steps--> */}
              <StepsHeader />
              <Routes>
                <Route path={`cart`} element={<RedirectWithReplace pathname={`../../shopping-cart`} />} />
                <Route path={`shipping`} element={<ShippingSlide currentStep={currentStep} />} />
                <Route path={`payment`} element={<PaymentSlide currentStep={currentStep} cartState={cartState} />} />
                <Route path={`review`} element={<ReviewSlide currentStep={currentStep} />} />
                <Route path={`*`} element={<RedirectWithReplace pathname={`shipping`} />} />
              </Routes>
            </section>
            {/* <!-- Sidebar--> */}
            <CheckoutSideBar placeOrder={placeOrder} />
            {threeDSRedirect && <ThreeDSRedirect url={threeDSRedirect.redirectUrl} payload={threeDSRedirect.redirectPayload} method={threeDSRedirect.redirectMethod} />}
          </div>
        )}
      </div>
    </DynamicPage>
  )
}

export default Checkout
