// adding new chat documents
// setting up a real-life listener to get new chat documents
// updating the username
// updating the room



class Chatroom {
    constructor(room, username) {
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }

    async addChat(message) {
        //format a chat object
        const now = new Date();
        const chat = {
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };

        const response = await this.chats.add(chat);
        return response;
    }

    getChats(callback) {
        this.unsub = this.chats
            .where('room', '==', this.room)
            .orderBy('created_at')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        //update the ui
                        console.log('I am added');
                        callback(change.doc.data());
                    }
                })
            })
    }

    updateName(username) {
        this.username = username;
        localStorage.setItem('username', username);
    }

    updateRoom(room) {
        this.room = room;
        console.log('room updated');
        if (this.unsub) {
            this.unsub();
        }
    }
}



// setTimeout(() => {
//     chatroom.updateRoom('ninjas');
//     chatroom.updateName('Makedonka');
//     chatroom.getChats(data => console.log(data));
//     chatroom.addChat('I love You');
// }, 3000);