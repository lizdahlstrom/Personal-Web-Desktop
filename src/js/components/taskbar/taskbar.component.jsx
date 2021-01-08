import React, { useState, useEffect } from 'react'
import './taskbar.styles.css'

const apps =
  [
    { name: 'memory', icon: '../../../image/games-icon.svg' },
    { name: 'chat', icon: '../../../image/chat-icon.svg' },
    { name: 'wiki-finder', icon: '../../../image/wiki-icon.svg' }
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
