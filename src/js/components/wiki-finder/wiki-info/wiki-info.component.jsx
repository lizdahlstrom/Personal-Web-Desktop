import React from 'react'
import './wiki-info.styles.css'

const WikiInfo = ({ title, description, link }) => {
  return (
    <div className='wiki-info'>
      <h1>{title}</h1>
      <div className='wiki-description'>{description}</div>
      <div className='wiki-link'><a href={link} target='blank' rel='noopener noreferrer'>{link}</a></div>
    </div>
  )
}

export default WikiInfo
