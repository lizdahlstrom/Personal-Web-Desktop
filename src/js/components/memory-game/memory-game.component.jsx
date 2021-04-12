import React, { useState, useEffect } from 'react'
import MemoryCard from './memory-card/memory-card.component.jsx'
import './memory-game.styles.css'

const MAX_CARDS = 8

/**
   * Imports all images
   */
const importAllImages = (context) => {
  return context.keys().map(context)
}

const lnuImages = importAllImages(
  require.context('../../../image/memory', false, /\.(png|jpe?g|svg)$/)
)

const catImages = importAllImages(
  require.context(
    '../../../image/memory/robohash/cat',
    false,
    /\.(png|jpe?g|svg)$/
  )
)

const monsterImages = importAllImages(
  require.context(
    '../../../image/memory/robohash/monster',
    false,
    /\.(png|jpe?g|svg)$/
  )
)

const robotImages = importAllImages(
  require.context(
    '../../../image/memory/robohash/monster',
    false,
    /\.(png|jpe?g|svg)$/
  )
)

/**
 * Memory game component, play a game of max 16 cards (8 pairs)
 *
 * @param {Array} { rows = 4, columns = 4 } props passed from parent
 * @returns a React.Component
 */
const MemoryGame = ({ rows = 4, columns = 4 }) => {
  const [cards, setCards] = useState([])
  const [firstCard, setFirstCard] = useState(null)
  const [pairs, setPairs] = useState(0)
  const [triesCount, setTriesCount] = useState(0)
  const [won, setWon] = useState(true)
  const [cardType, setCardType] = useState('')
  const [secondCard, setSecondCard] = useState(null)

  // called when component mounts
  useEffect(() => {
    startGame(rows, columns)
  }, [])

  /**
   * Get the image path of corresponding id
   *
   * @param {Number} id
   * @throws {TypeError} if the passed argument is not a number
   * @throws {Error} if the id is not within range
   * @returns
   */
  const getImagePath = (id) => {
    if (id > MAX_CARDS || id < 0) throw new Error('no card with such id')

    let path

    if (cardType === 'lnu' || id === 0) {
      path = lnuImages[id]
    } else if (cardType === 'cat') {
      path = catImages[id - 1]
    } else if (cardType === 'monster') {
      path = monsterImages[id - 1]
    } else if (cardType === 'robot') {
      path = robotImages[id - 1]
    } else {
      throw new Error('Cannot get image path, invalid card type')
    }

    return path.default
  }

  /**
   * Starts a new game of Memory
   *
   * @param {Number} rows
   * @param {Number} columns
   */
  const startGame = (rows, columns) => {
    const cardCount = rows * columns
    if (cardCount > MAX_CARDS * 2) { throw new Error('There are not enough cards for that size of game') }
    if (cardCount % 2 !== 0) { throw new Error('Cannot create a game with an uneven number of cards') }

    let newCards = _generateCards(cardCount)
    newCards = _shuffle(newCards)

    setCards(newCards)
  }

  const _win = () => {
    setWon(true)
    setCardType('')
  }

  /**
   * Flip card if viable
   *
   * @param {*} img Image of the card
   * @param {String} pairId pair-id attribute of card
   */
  const _flipCard = (img, pairId) => {
    if (!firstCard) {
      setFirstCard(img)
    } else {
      if (img === firstCard || secondCard) return

      setSecondCard(img)

      const tries = triesCount + 1
      setTriesCount(tries)

      if (firstCard.getAttribute('pair-id') === pairId) {
        setPairs(pairs + 1)

        if (pairs + 1 === cards.length / 2) {
          _win()
        }

        window.setTimeout(() => {
          firstCard.parentNode.classList.add('removed')
          img.parentNode.classList.add('removed')
          setFirstCard(null)
          setSecondCard(null)
        }, 300)
      } else {
        // flip cards back
        window.setTimeout(() => {
          firstCard.src = getImagePath(0)
          img.src = getImagePath(0)
          setFirstCard(null)
          setSecondCard(null)
        }, 300)
      }
    }

    // flip card
    img.src = getImagePath(pairId)
  }

  /**
   * Generates an array of card objects
   *
   * @param {Number} cardCount
   * @returns {Array}
   */
  const _generateCards = (cardCount) => {
    const newCards = []

    for (let i = 1; i <= cardCount / 2; i++) {
      const card = { id: i, imgUrl: getImagePath(0) }
      newCards.push(card)
      newCards.push(card)
    }

    return newCards
  }

  /**
   * Shuffles the elements in the passed array
   *
   * @param {Array}
   * @returns {Array} copy of the shuffled array
   */
  const _shuffle = (cards) => {
    const copy = [...cards]
    if (copy.length < 2) return

    // Shuffling with Durstenfield shuffle algorithm
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]]
    }

    return copy
  }

  /**
   * Eventhandler function
   * "Flips" the card component
   *
   * @param {Event} e
   */
  const _handleCardClick = (e) => {
    const img =
      e.target.nodeName === 'IMG' ? e.target : e.target.firstElementChild
    const pairId = img.getAttribute('pair-id')

    if (!pairId) return

    _flipCard(img, pairId)

    e.preventDefault()
  }

  /**
   * Resets states and starts a new game
   *
   * @param {Event} e
   */
  const _handlePlayAgain = (e) => {
    setFirstCard(null)
    setPairs(0)
    setTriesCount(0)
    setWon(false)

    startGame(rows, columns)
    e.preventDefault()
  }

  const _handleCardSelect = (e) => {
    setCardType(e.target.value)
  }

  return (
    <div className='memory-game'>
      <div className='game-info'>
        <span>Tries: {triesCount}</span>
      </div>
      {won ? (
        <div className='winning-message'>
          <h2>
            {triesCount > 0
              ? `You won with ${triesCount} tries!`
              : 'Start a new game!'}
          </h2>
          <p>Select card type below</p>
          <div className='card-type-selector' onChange={_handleCardSelect}>
            <span>
              <input type='radio' id='lnu' name='cardType' value='lnu' />
              <label htmlFor='lnu'>LNU</label>
            </span>
            <span>
              <input type='radio' id='cat' name='cardType' value='cat' />
              <label htmlFor='cat'>Cats (by robohash)</label>
            </span>
            <span>
              <input
                type='radio'
                id='monster'
                name='cardType'
                value='monster'
              />
              <label htmlFor='monster'>Monsters (by robohash)</label>
            </span>
            <span>
              <input type='radio' id='robot' name='cardType' value='robot' />
              <label htmlFor='robot'>Robots (by robohash)</label>
            </span>
          </div>
          <button
            className='play-again-btn'
            disabled={!cardType}
            onClick={_handlePlayAgain}
          >
            {triesCount > 0 ? 'Play again' : 'Play'}
          </button>
        </div>
      ) : (
        <div
          className='cards'
          style={{ gridTemplateColumns: `repeat(${columns}, auto [col-start]` }}
          onClick={_handleCardClick}
        >
          {cards.length > 0
            ? cards.map((card, i) => (
              <MemoryCard
                key={`card-${i}-${card.id}`}
                pairId={card.id}
                imgUrl={card.imgUrl}
              />
            ))
            : ''}
        </div>
      )}
    </div>
  )
}

export default MemoryGame
