import { useEffect, useRef, useState } from 'react'

import { useGetProductImageGallery } from '../..'

/*

Probably should move to this eventually 
https://react-slick.neostack.com/docs/example/custom-paging
*/
const useProductDetailGallery = ({ productUrlTitle, skuID = '', imageFile }) => {
  let { isFetching, imageGallery } = useGetProductImageGallery(productUrlTitle)

  const [sliders, setSliders] = useState({
    nav1: null,
    nav2: null,
  })
  const slider1 = useRef()
  const slider2 = useRef()

  useEffect(() => {
    setSliders({
      nav1: slider1.current,
      nav2: slider2.current,
    })
  }, [productUrlTitle, isFetching])

  let filterImages = []
  if (imageGallery && !isFetching) {
    filterImages = imageGallery
      ?.filter(({ ASSIGNEDSKUIDLIST = false, TYPE }) => {
        return TYPE === 'skuDefaultImage' || TYPE === 'productAlternateImage' || (ASSIGNEDSKUIDLIST && ASSIGNEDSKUIDLIST.includes(skuID))
      })
      .filter(({ RESIZEDIMAGEPATHS = [] }) => {
        return RESIZEDIMAGEPATHS?.at(0) && !RESIZEDIMAGEPATHS?.at(0).includes('missingimage')
      })
  }
  if (filterImages?.length === 0) {
    filterImages = [{ ORIGINALPATH: '', NAME: '', RESIZEDIMAGEPATHS: ['', '', ''] }]
  }
  filterImages?.unshift(
    filterImages
      .splice(
        filterImages.findIndex(item => item.ORIGINALFILENAME === imageFile),
        1
      )
      ?.at(0)
  )
  filterImages = filterImages?.reverse()
  return { imageGallery, sliders, slider1, slider2, filterImages, isFetching }
}
export { useProductDetailGallery }
