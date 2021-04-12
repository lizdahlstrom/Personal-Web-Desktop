import React, { useState, useEffect } from 'react'
import './taskbar.styles.css'
import memoryIcon from '../../../image/games-icon.svg'
import chatIcon from '../../../image/chat-icon.svg'
import wikiIcon from '../../../image/wiki-icon.svg'

const apps =
  [
    { name: 'memory', icon: memoryIcon },
    { name: 'chat', icon: chatIcon },
    { name: 'wiki-finder', icon: wikiIcon }
  ]

const Taskbar = ({ addWindow }) => {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    setApplications(apps)
  }, [])

  /**
   * Adds a new app to the desktop
   *
   * @param {Object} app
   */
  const openApp = (app) => {
    addWindow({ name: app.name, icon: app.icon })
  }

  return (
    <div id='taskbar'>
      {applications ? applications.map((app, i) => {
        return <a className='app-button' key={`${i}-${app.name}`} onClick={() => openApp(app)}><img src={app.icon} alt={app.name} /></a>
      }) : ''}
    </div>
  )
}

export default Taskbar
