import React from 'react'
import './memory-card.styles.css'

/**
 * Displays a memory card
 *
 * @param {Array} { pairId, imgUrl } props passed from parent
 * @returns a React.Component
 */
const MemoryCard = ({ pairId, imgUrl }) => {
  return (
    <a href='#' className='memory-card' onClick={(e) => e.preventDefault()}>
      <img src={imgUrl} alt='Memory card' pair-id={pairId} />
    </a>
  )
}

export default MemoryCard
