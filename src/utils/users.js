const users = []

// addUsers 

const addUser = ({id, username, room}) => {
    // Sanitize the data 
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Data validation
    if(!username || !room) {
        return {
            error: "User and room are required!"
        }
    }

    // Check existing user

    const existingUser = users.find( user => {
        return user.username === username && user.room == room
    })

    if(existingUser) {
        return {
            error: `Username: ${username} already exists in this room: ${room}!`
        }
    }

    // Storing the user
    const user = { id, username, room }
    users.push(user)
    return { user }

}

// removeUser
const removeUser = (id) => {
    const index = users.findIndex( user => user.id == id )
    
    if(index != -1) {
        return users.splice(index, 1)[0]
    }

    // return {
    //     error : `Unable to find the user with id: ${id}`
    // }
}

// getUser
const getUser = (id) => {
    // const user = users.find(user => user.id === id)
    // if(user) {
    //     return user
    // }
    return users.find(user => user.id === id)
}

// getUsersInRoom
const getUsersInRoom = (room) => {
    // const usersInRoom = []
    // users.forEach( user => {
    //     if(user.room == room ) {
    //         usersInRoom.push(user)
    //     }
    // })
    // return usersInRoom
    return users.filter(user => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}