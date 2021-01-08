import React from 'react'
import ReactDOM from 'react-dom'
import Desktop from './components/desktop/desktop.component.jsx'
import '../css/style.css'

const App = () => {
  return (
    <Desktop />
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
