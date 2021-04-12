import React from 'react'
import './chat-message.styles.css'

/**
 * Displays a chat message
 *
 * @param {Array} { author, timestamp, message }
 * @returns a React.Component
 */
const ChatMessage = ({ author, timestamp, message }) => {
  return (
    <div className='chat-message' draggable='true'>
      <div>
        <span className='author'>{author}</span>
        <span className='timestamp'>{timestamp}</span>
      </div>
      <div className='message'> {message} </div>
    </div>
  )
}

export default ChatMessage
