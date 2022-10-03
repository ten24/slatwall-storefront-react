import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { SimpleImage } from '..'

import { useFormatDate, useUtilities } from '../../hooks'
import { getBlogRoute } from '../../selectors/configurationSelectors'

function BlogListBody({ blog }) {
  const route = useNavigate()
  const [formateDate] = useFormatDate()
  const { t } = useTranslation() // Translate
  let { eventHandlerForWSIWYG } = useUtilities()
  const blogPath = useSelector(getBlogRoute)

  return (
    <article className="shadow mb-5">
      <div className="max-height-img">{blog.postImage && <SimpleImage src={blog.postImage.url} alt={blog.postTitle} />}</div>
      <h2 className="entry-title px-4 py-3 m-0 text-underline">
        <Link className="link" to={`/${blogPath}/${blog.slug}`}>
          {blog.postTitle}
        </Link>
      </h2>

      <div className="entry-meta px-4">
        <ul className="list-unstyled d-flex m-0">
          {!!blog.authorName && (
            <li className="d-flex align-items-center me-3">
              <i className="bi bi-person me-2 small line-height-0"></i>
              {blog.authorName}
            </li>
          )}
          {!!blog.publicationDate && (
            <li className="d-flex align-items-center me-3">
              <i className="bi bi-clock me-2 small line-height-0"></i>
              {formateDate(blog.publicationDate)}
            </li>
          )}
        </ul>
      </div>
      <div className="entry-content pt-2 px-4 pb-4">
        {!!blog.postSummary && <p onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: blog.postSummary }} />}
        <button
          className="btn btn-primary btn-block"
          onClick={() => {
            route.push({ pathname: `/${blogPath}/${blog.slug}` })
          }}
        >
          {t('frontend.blog.readMore')}
        </button>
      </div>
    </article>
  )
}

export { BlogListBody }
