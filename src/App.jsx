import { useState, useEffect } from 'react'
import Note from './components/Note'
import axios from 'axios'
import noteServices from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    noteServices.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  const addNote = (e) => {
    e.preventDefault()

    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    }

    noteServices.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const handleNoteChange = (e) => {
    setNewNote(e.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true)

  const toggleImportanceOf = (id) => {
    const note = notes.find((note) => note.id === id)
    const changedNote = { ...note, important: !note.important }

    noteServices
      .update(id, changedNote)
      .then((returnedNote) =>
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      )
      .catch(() => {
        alert(`The note "${note.content}" was already deleted from server`)
        setNotes(notes.filter(note => note.id !== id))
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            note={note}
            key={note.id}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input
          type="text"
          placeholder="add note"
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default App
