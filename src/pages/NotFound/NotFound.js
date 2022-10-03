import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const contentStore = useSelector(state => state.content['404']) || {}
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="container py-5 mb-lg-3"
      onClick={event => {
        if (event.target.getAttribute('href')) {
          event.preventDefault()
          if (event.target.getAttribute('href').includes('http')) {
            window.location.href = event.target.getAttribute('href')
          } else {
            navigate(event.target.getAttribute('href'))
          }
        }
      }}
    >
      {isLoaded && (
        <>
          <div className="row justify-content-center pt-lg-4 text-center">
            <div className="col-lg-5 col-md-7 col-sm-9">
              <h1 className="display-404">{contentStore.title}</h1>
            </div>
          </div>
          <div className="row text-center justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div
                dangerouslySetInnerHTML={{
                  __html: contentStore.contentBody,
                }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
