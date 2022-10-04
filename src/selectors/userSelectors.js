import { createSelector } from 'reselect'
import { toBoolean } from '../utils'

export const getAllAccountPaymentMethods = state => state.userReducer.accountPaymentMethods
export const getAllAccountAddresses = state => state.userReducer.accountAddresses
export const getPrimaryAddress = state => state.userReducer.primaryAddress
export const getWishlists = state => state.userReducer.wishList.lists
export const getWishlistsItems = state => state.userReducer.wishList.items
export const getVerifiedAccountFlag = state => toBoolean(state.userReducer.verifiedAccountFlag)

const creditCardTypePaypal = 'PayPal'

export const accountPaymentMethods = createSelector(getAllAccountPaymentMethods, (accountPaymentMethods = []) => {
  return accountPaymentMethods.map(({ accountPaymentMethodName, creditCardType, creditCardLastFour, accountPaymentMethodID }) => {
    return { name: `${accountPaymentMethodName} | ${creditCardType} - *${creditCardLastFour}`, value: accountPaymentMethodID }
  })
})
export const getSavedCreditCardMethods = createSelector(getAllAccountPaymentMethods, (accountPaymentMethods = []) => {
  return accountPaymentMethods
    .filter(accountPayment => ![creditCardTypePaypal].includes(accountPayment.creditCardType))
    .filter(accountPayment => accountPayment.creditCardLastFour !== '' || accountPayment.creditCardLastFour !== null || accountPayment.creditCardLastFour !== 'undefined')
    .map(({ accountPaymentMethodName, creditCardType, creditCardLastFour, accountPaymentMethodID }) => {
      return { name: `${accountPaymentMethodName} | ${creditCardType} - *${creditCardLastFour}`, value: accountPaymentMethodID }
    })
})
export const getSavedPaypalMethods = createSelector(getAllAccountPaymentMethods, (accountPaymentMethods = []) => {
  return accountPaymentMethods
    .filter(accountPayment => accountPayment.creditCardType === creditCardTypePaypal)
    .map(({ accountPaymentMethodName, creditCardType, accountPaymentMethodID }) => {
      return { name: `${accountPaymentMethodName} | ${creditCardType}`, value: accountPaymentMethodID }
    })
})

export const getDefaultWishlist = createSelector(getWishlists, (lists = []) => {
  return lists.length > 0 ? lists?.at(0) : {}
})

export const getItemsForDefaultWishList = createSelector(getDefaultWishlist, getWishlistsItems, (defaultWishlist = {}, items = []) => {
  return items
    .filter(item => {
      return item.orderTemplate_orderTemplateID === defaultWishlist?.value
    })
    .map(item => item.sku_skuID)
})
