import React from 'react'

import './desktop-window.styles.css'

const DesktopWindow = ({ windowId, children, zIndex, closeWindow, handleFocus, icon, startX = 100, startY = 100 }) => {
  const _handleDragStart = (e) => {
    // won't drag if the window does not have a bar
    const bar = e.target.querySelector('.window-bar')
    if (!bar) return

    const desktopWindow = e.target.closest('.desktop-window')
    const windowId = desktopWindow.getAttribute('id')

    const pos = desktopWindow.getBoundingClientRect()

    // passes position data to drop event
    e.dataTransfer.setData('x', Math.abs(e.clientX - pos.x))
    e.dataTransfer.setData('y', Math.abs(e.clientY - pos.y))
    e.dataTransfer.setData('id', windowId)
  }

  const _handleDragOver = (e) => {
    e.preventDefault()
  }

  const _handleCloseWindow = (e) => {
    closeWindow(windowId)
    e.preventDefault()
  }

  const _handleChildComponentDrag = (e) => {
    e.preventDefault()
  }

  return (
    <div className='desktop-window' id={windowId} draggable='true' onDragStart={_handleDragStart} droppable='true' onDragOver={_handleDragOver} style={{ position: 'absolute', opacity: ' 1', zIndex: zIndex, top: startY, left: startX }}>
      <div className='window-bar' onMouseDown={handleFocus}>
        <img className='window-icon' src={icon} />
        <span className='window-title'>{children.props.title}</span>
        <button className='window-close-btn' onClick={_handleCloseWindow}>x</button>
      </div>
      <div
        className='window-component' draggable='true'
        onDragStart={_handleChildComponentDrag}
      >
        {children}
      </div>
    </div>
  )
}

export default DesktopWindow
