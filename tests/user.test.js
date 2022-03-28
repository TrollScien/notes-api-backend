const User = require('../models/User')
const bcrypt = require('bcrypt')
const { application } = require('express')
const {api, getUsers} = require('./helpers')
const mongoose = require('mongoose')
const {server} = require('../index')
describe('creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passworhHash = await bcrypt.hash('pswd',10)
        const user = new User({username: 'miduroot',passworhHash})
        await user.save()
    })

    test('works as expected creating a fresh username', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'midudev',
            name: 'Miguel',
            password: 'tw1tch'
        }
        await api.post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await getUsers()

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
})
afterAll(() => {
    mongoose.connection.close()
    server.close()
  })