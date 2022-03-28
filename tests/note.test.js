const mongoose = require('mongoose')

const { server } = require('../index')
const Note = require('../models/Note')
const { initialNotes, api, getAllContentsFromNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  for (const note of initialNotes) {
    const notesObject = new Note(note)
    await notesObject.save()
  }
})

describe('GET all notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('there are two notes', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })
  test('the first note is about the curse', async () => {
    const { contents } = await getAllContentsFromNotes()

    expect(contents).toContain('Aprendiendo fullstack')
  })
})

describe('create a note', () => {
  test('is a possible with a valid note', async () => {
    const newNote = {
      content: 'Proximamente async await',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentsFromNotes()
    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('is not a possible with an invalid note', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('delete a note', () => {
  test('a note with valid ID can be deleted', async () => {
    const { response: firstResponse } = await getAllContentsFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const { contents, response: secondResponse } = await getAllContentsFromNotes()
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)

    expect(contents).not.toContain(noteToDelete.content)
  })

  test('a note that do no exist can not be deleted', async () => {
    await api
      .delete('/api/notes/1234')
      .expect(400)

    const { response } = await getAllContentsFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

test('update a note', async () => {
  const newNote = {
    content: 'Nota actualizada',
    important: true
  }
  const { response: firstResponse } = await getAllContentsFromNotes()
  const { body: notes } = firstResponse
  const noteToUpdate = notes[0]
  await api
    .put(`/api/notes/${noteToUpdate.id}`)
    .send(newNote)
    .expect(200)

  const { contents, response: secondResponse } = await getAllContentsFromNotes()
  const { body: newNotes } = secondResponse
  const noteUpdated = newNotes[0]
  console.log(noteUpdated)
  expect(contents).toContain(noteUpdated.content)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
