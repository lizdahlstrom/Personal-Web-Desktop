import React, { useState, useEffect } from 'react'
import './wiki-finder.styles.css'
import WikiInfo from './wiki-info/wiki-info.component.jsx'

/**
 * Wiki finder component, find Wiki articles
 *
 * @returns a React component
 */
const WikiFinder = () => {
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [searchStr, setSearchStr] = useState('')
  const [options, setOptions] = useState([])
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(true)

  const [dataListId] = useState(Math.random().toString(36).substr(2, 9))

  /**
   * Fetch any hits on the search string from Wikipedia API
   *
   * @returns
   */
  const fetchHits = async () => {
    if (!searchStr) return

    let res = await window.fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchStr}&limit=10&namespace=0&format=json&origin=*`, {
      method: 'GET'
    })

    res = await res.json()

    let entries = []

    if (res[1] && res[3]) {
      entries = res[1].map((entry, index) => {
        return {
          title: entry,
          url: res[3][index]
        }
      })
    }

    return entries
  }

  /**
   * Fetch and set entries of passed title from Wikipedia api
   *
   * @param {Object} hit has title and url
   */
  const fetchWikiEntry = async (wikiTitle) => {
    // should fetch here
    const query = wikiTitle.replace(' ', '%20')
    const url = `https://en.wikipedia.org/w/api.php?format=json&action=query&titles=${query}&prop=extracts&exintro&explaintext&redirects=1&origin=*`

    let res = await window.fetch(url)
    res = await res.json()
    const description = Object.values(res.query.pages)[0].extract
    const title = Object.values(res.query.pages)[0].title

    return {
      title,
      description
    }
  }

  useEffect(() => {
    if (!options) return

    const hit = options.filter(option => option.title === searchStr).shift()

    if (hit) {
      const updateState = async () => {
        const entry = await fetchWikiEntry(hit.title)

        setLink(hit.url)
        setDescription(entry.description)
        setTitle(entry.title)
      }
      updateState()
    }
  }, [options])

  useEffect(() => {
    if (!searchStr) {
      setLink('')
      setDescription('')
      setTitle('')
      return
    }

    setLoading(true)
    // set options
    const updateOptions = async () => {
      const fetchedOptions = await fetchHits()
      setOptions(fetchedOptions)
    }

    updateOptions()
    setLoading(false)
  }, [searchStr])

  const handleTextInput = async (e) => {
    const value = e.target.value
    setSearchStr(value)
    e.target.focus()
  }

  return (
    <div className='wiki-finder'>
      <input className='wiki-input' placeholder='Search' onChange={handleTextInput} list={`${dataListId}`} />
      <datalist id={`${dataListId}`}>
        {!loading && options.length > 0
          ? options.map((option) => <option key={option.title} value={option.title} />) : ''}
      </datalist>

      {description && title
        ? (
          <WikiInfo title={title} link={link} description={description} />
        ) : ''}

    </div>
  )
}

export default WikiFinder
