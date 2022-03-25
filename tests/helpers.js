const supertest = require('supertest')
const {app} = require('../index')
const api = supertest(app)

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
module.exports = { initialNotes, api, getAllContentsFromNotes }