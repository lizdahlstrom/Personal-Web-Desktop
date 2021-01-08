import React, { useState } from 'react'
import './desktop.styles.css'
import MemoryGame from '../memory-game/memory-game.component.jsx'
import DesktopWindow from '../desktop-window/desktop-window.component.jsx'
import Chat from '../chat/chat.component.jsx'
import Taskbar from '../taskbar/taskbar.component.jsx'
import WikiFinder from '../wiki-finder/wiki-finder.component.jsx'

const Desktop = () => {
  const [windows, setWindows] = useState([])
  const [topZIndex, setTopZIndex] = useState(0)

  const _incrementZIndex = () => {
    setTopZIndex(topZIndex + 1)
    return topZIndex
  }

  const _handleDragOver = (e) => e.preventDefault()

  /**
   * Handles window drop event
   *
   * @param {Event} e
   */
  const _handleDrop = (e) => {
    // data from the original position
    const x = e.dataTransfer.getData('x')
    const y = e.dataTransfer.getData('y')
    // reference to the window
    const windowId = e.dataTransfer.getData('id')
    const windowElement = document.querySelector(`#${windowId}`)

    const newX = (e.clientX - x)
    const newY = (e.clientY - y)

    windowElement.style.top = `${newY}px`
    windowElement.style.left = `${newX}px`

    e.preventDefault()
  }

  /**
   *Gets a random 'unique' id
   * Found at: https://gist.github.com/gordonbrander/2230317#file-id-js-L19
   *
   * @returns {String} a random string
   */
  const randomId = () => {
    return '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Add a window to the desktop
   *
   * @param {Object} configObj has to have a valid type property
   */
  const addWindow = (configObj) => {
    if (typeof configObj !== 'object' || !configObj.name) {
      throw new Error('window config object invalid')
    }

    configObj.zIndex = _incrementZIndex()
    configObj.id = randomId()

    setWindows(windows => [...windows, configObj])
  }

  /**
   * Closes window with passed id, if existing
   * @param {String} id
   */
  const closeWindow = (id) => {
    let removedWindow = [...windows]
    removedWindow = removedWindow.filter(w => w.id !== id)
    setWindows(removedWindow)
  }

  /**
   * Get tag of the generated window
   *
   * @param {String} tagType a string representing the window type
   * @returns
   */
  const getTag = (tagType) => {
    switch (tagType) {
      case 'memory' :
        return <MemoryGame title='Memory' />
      case 'chat':
        return <Chat title='Chat' />
      case 'wiki-finder':
        return <WikiFinder title='WikiFinder' />
      default:
        return null
    }
  }

  /**
   * Puts the target focused window on "top"
   *
   * @param {Event} e
   */
  const handleFocus = (e) => {
    const windowId = e.target.closest('.desktop-window').getAttribute('id')
    // set zIndex
    const windowObj = windows.filter(w => w.id === windowId)[0]

    if (windowObj.zIndex < topZIndex) windowObj.zIndex = _incrementZIndex()
  }

  return (
    <div id='desktop' droppable='true' onDragOver={_handleDragOver} onDrop={_handleDrop}>

      {!!windows && windows.length !== 0 ? windows.map((w, i) => getTag(w.name) ? <DesktopWindow key={w.id} windowId={w.id} closeWindow={closeWindow} handleFocus={handleFocus} icon={w.icon} zIndex={w.zIndex}>{getTag(w.name)}</DesktopWindow> : ''
      ) : ''}

      <Taskbar addWindow={addWindow} />

    </div>
  )
}

export default Desktop
