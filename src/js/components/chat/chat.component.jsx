import React, { useState, useEffect } from 'react'
import ChatMessage from './chat-message/chat-message.component.jsx'
import './chat.styles.css'
const API_KEY = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd' // could be put in .env file
const API_URL = ' ws://vhost3.lnu.se:20080/socket/'

/**
 * A chat that connects to a LNU chat server
 *
 * @returns a React.Component
 */
const Chat = () => {
  const [messages, setMessages] = useState([])
  const socket = new window.WebSocket(API_URL, 'charcords')
  const [chatUsername, setChatUsername] = useState(window.localStorage.getItem('chatUsername') || '')
  const editIcon = '../../../image/edit-icon.svg'

  /**
   * Sends a message to the server
   *
   * @param {String} text
   * @param {String} username
   * @param {String} key
   */
  const _sendMessage = (text, username, key) => {
    const message = {
      type: 'message',
      data: text,
      username: chatUsername,
      key: key
    }

    socket.send(JSON.stringify(message))
  }

  /**
   * Adds a message to the message list
   *
   * @param {Object} messageObj
   */
  const _addMessage = (messageObj) => {
    setMessages(messages => [...messages, messageObj])
  }

  /**
   * Eventlistener function
   * Adds a recieved message to the UI
   *
   * @param {Event} e event fired
   */
  const _onMessage = (e) => {
    const message = JSON.parse(e.data)
    if (message.type === 'heartbeat') return

    message.timestamp = new Date().toLocaleString()

    _addMessage(message)
  }

  /**
   * Eventlistener function
   * Adds a received error message to the UI
   *
   * @param {Event} e event fired
   */
  const _onConnectionError = (e) => {
    const err = JSON.parse(e.data)
    _addMessage(err)
  }

  /**
   * Eventlistener function
   * Sends a message to the server in case the key pressed was 'Enter'
   *
   * @param {Event} e event fired
   */
  const _handleChatInput = (e) => {
    if (e.key !== 'Enter' || e.target.value === '') return

    const message = e.target.value
    _sendMessage(message, chatUsername, API_KEY)

    e.target.value = ''
    e.preventDefault()
  }

  /**
   * Eventlistener function
   * Sets the username in case the key pressed was 'Enter'
   *
   * @param {Event} e event fired
   */
  const _handleNameInput = (e) => {
    if (e.key !== 'Enter' || e.target.value === '') return
    setChatUsername(e.target.value)
  }

  const _handleEdit = (e) => {
    setChatUsername('')

    e.preventDefault()
  }

  useEffect(() => {
    window.localStorage.setItem('chatUsername', chatUsername)
  }, [chatUsername])

  // called when mounted
  useEffect(() => {
    socket.addEventListener('error', _onConnectionError)
    socket.addEventListener('message', _onMessage)

    // cleanup function
    return () => {
      socket.removeEventListener('error', _onConnectionError)
      socket.removeEventListener('message', _onMessage)
      socket.close()
    }
  }, [])

  return (
    <div className='chat-root'>
      {chatUsername
        ? (
          <div className='top'>
            <div>Welcome <span className='username'>{chatUsername}</span></div>
            <a href='#' onClick={_handleEdit}> <img className='edit-icon' src={editIcon} />
            </a>
          </div>
        ) : ''}
      <div className='chat-component'>
        {chatUsername
          ? (
            <div className='chat'>
              <div className='message-box'>
                {messages.length > 0 ? messages.map((message, i) => <ChatMessage key={i} author={message.username} timestamp={message.timestamp} message={message.data} />) : ''}
              </div>
              <div className='chat-input'>
                <textarea onKeyDown={_handleChatInput} />
              </div>
            </div>
          )
          : (
            <div className='username-input chat'>
              <h2>Input your username</h2>
              <input type='text' placeholder='Name' onKeyDown={_handleNameInput} />
            </div>
          )}
      </div>
    </div>
  )
}

export default Chat
