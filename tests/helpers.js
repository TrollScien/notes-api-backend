const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)
const User = require('../models/User')

const initialNotes = [
  {
    content: 'Aprendiendo fullstack',
    important: true,
    date: new Date()
  },
  {
    content: 'en el canal de midudev',
    important: true,
    date: new Date()
  },
  {
    content: 'en Youtube',
    important: true,
    date: new Date()
  }
]

const getAllContentsFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {

    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersAtStart = usersDB.map(user => user.toJSON())
}

module.exports = { initialNotes, api, getAllContentsFromNotes, getUsers }
