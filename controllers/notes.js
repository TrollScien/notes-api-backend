const notesRouter = require('express').Router()
const Note = require('../models/Note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id
  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(err => next(err))
})

notesRouter.post('/', async (request, response) => {
  const { body } = request
  const { content, important } = body

  if (!body || !content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }
  const newNote = new Note({
    content: content,
    important: typeof important !== 'undefined' ? important : false,
    date: new Date().toISOString()
  })

  try {
    const savedNote = await newNote.save()
    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then(result => {
    response.json(result)
  }).catch(error => next(error))
})

notesRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    await Note.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter
