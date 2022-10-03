const data = {
  global: {
    globalVATCountries: 'GB,IE,AD',
    globalTimeFormat: 'hh:mm tt',
    globalDateFormat: 'mmm dd, yyyy',
    globalURLKeyBrand: 'sb',
    globalURLKeyProductType: 'spt',
    globalURLKeyAccount: 'ac',
    globalURLKeyAttribute: 'att',
    globalURLKeyAddress: 'ad',
    globalURLKeyCategory: 'caty',
    globalURLKeyProduct: 'sp',
  },
  currencies: {
    USD: {
      currencySymbol: '$',
      formatMask: ' ',
    },
  },
  sites: [],
  site: {
    currencyCode: 'USD',
    settings: {
      siteDefaultCountry: 'us',
    },
  },
  router: [
    { URLKeyType: 'Product', URLKey: 'product' },
    { URLKeyType: 'ProductType', URLKey: 'products' },
    { URLKeyType: 'Category', URLKey: 'cat' },
    { URLKeyType: 'Brand', URLKey: 'brand' },
    { URLKeyType: 'Account', URLKey: 'ac' },
    { URLKeyType: 'Address', URLKey: 'ad' },
    { URLKeyType: 'Attribute', URLKey: 'att' },
  ],
  blog: {
    url: 'blog',
  },
  cmsProvider: 'slatwallCMS',
  enforceVerifiedAccountFlag: false,
  allowGuestCheckout: true,
  products: {
    fallbackImageCall: false,
    loginRequiredForPrice: false,
    dropdownLimit: 20,
    quantityInput: 'text', // [ text|dropdown]
  },
  productPrice: {
    checkInvetory: false,
    showPriceForUnverifiedAccounts: true,
  },
  listings: {
    productListing: {
      isSales: true,
      showInput: true,
      viewMode: 'GRID',
      viewModeOptions: ['GRID', 'LISTING'],
      forcedFilterOptions: ['productType_slug', 'brand_slug', 'category_slug'],
      headings: [
        { heading: 'Product Name', value: 'product_productName' },
        { heading: 'Sku Code', value: 'sku_skuCode' },
      ],
      buttonLabel: 'frontend.product.add_to_cart',
      params: {
        propertyIdentifierList: '',
        includeSKUCount: true,
        includeResizedImages: false,
        applyStockFilter: false,
        productsListingFlag: true,
        includeOptions: true,
        includeSettings: true,
        includePagination: true,
        includePotentialFilters: true,
      },
      filters: {
        brand_slug: '',
        orderBy: '',
        pageSize: '12',
        currentPage: '1',
        keyword: '',
        productType_slug: '',
        category_slug: '',
      },
      returnFacetList: 'brand,sorting,productType',
      returnFacetListWithFilter: 'brand,option,category,attribute,sorting,priceRange,productType',
    },
    skuListing: {
      isSales: true,
      showInput: true,
      viewMode: 'GRID',
      viewModeOptions: ['GRID', 'LISTING'],
      forcedFilterOptions: ['productType_slug', 'brand_slug', 'category_slug'],
      headings: [
        { heading: 'Product Name', value: 'product_productName' },
        { heading: 'Sku Code', value: 'sku_skuCode' },
      ],
      buttonLabel: 'frontend.product.add_to_cart',
      params: {
        propertyIdentifierList: '',
        includeSKUCount: true,
        includeResizedImages: false,
        applyStockFilter: false,
        productsListingFlag: false,
        includeSettings: true,
        includePagination: true,
        includePotentialFilters: true,
      },
      filters: {
        brand_slug: '',
        orderBy: '',
        pageSize: '12',
        currentPage: '1',
        keyword: '',
        productType_slug: '',
        category_slug: '',
      },
    },
    bulkOrder: {
      isSales: true,
      showInput: true,
      viewMode: 'LISTING',
      viewModeOptions: ['GRID', 'LISTING', 'LISTINGLINEBYLINE'],
      forcedFilterOptions: [],
      headings: [
        { type: 'property', heading: '', value: 'product_productName' },
        { type: 'data', heading: 'Product Name', value: 'product_productName' },
        { type: 'data', heading: 'Sku Code', value: 'sku_skuCode' },
        { type: 'button', buttonType: 'viewProduct', linkLabel: 'View' },
      ],
      buttonLabel: 'frontend.bulkorder.add_to_list',
      params: {
        propertyIdentifierList: '',
        includeSKUCount: false,
        includeResizedImages: true,
        applyStockFilter: false,
        productsListingFlag: false,
        includeSkus: true,
        includeOptions: true,
        includePagination: true,
        includePotentialFilters: true,
        includeSettings: true,
      },
      filters: {
        brand_slug: '',
        orderBy: '',
        pageSize: '12',
        currentPage: '1',
        keyword: '',
        productType_slug: '',
        category_slug: '',
      },
    },
  },
  myAccount: {
    mostRecentCount: 3,
  },
  shopByManufacturer: {
    slug: '/brands',
    showInMenu: true,
    gridSize: 3,
    maxCount: 12,
  },
  seo: {
    title: 'Slatwall',
    titleMeta: '',
  },
  filtering: {
    productTypeBase: 'merchandise',
    requireKeyword: true,
    filterDataShowCounts: 5,
  },

  footer: {
    formLink: '',
  },
  theme: {
    themeKey: 'default',
    host: process.env.REACT_APP_HOST_URL,
    basePath: 'custom/client/assets/images/',
    primaryColor: '#2478CC',
  },
  formatting: {
    dateFormat: 'MMM DD, YYYY',
    timeFormat: 'hh:mm a',
  },
  analytics: {
    showCookieBanner: true,
    tagManager: {
      gtmId: '',
    },
    googleAnalytics: {
      id: '',
    },
    reportWebVitals: false,
  },
  forms: {
    contact: '',
  },
  integrations: [
    // {
    //   key: 'googlelogin',
    //   name: 'Google Login',
    //   types: 'authentication',
    //   settings: {},
    // },
    // {
    //   key: 'facebooklogin',
    //   name: 'Facebook Login',
    //   types: 'authentication',
    //   settings: {},
    // },
    // {
    //   key: 'paypalCommerce',
    //   name: 'Paypal Commerce',
    //   types: 'payment',
    //   settings: {
    //     clientID: '',
    //   },
    // },
  ],
  enableMultiSite: true,
}
export default data
