// User Factory
class UserFactory {

    get singleUser() {
        return this.allUsers[0];
    }

    get allUsers() {
        return [
            {
                firstName: "John",
                lastName: "Doe",
                username: "john_doe",
                email: "john.doe@example.com",
                googleId: null,
                blogOwner: true,
                password: "password123"
            },
            {
                firstName: "Jane",
                lastName: "Smith",
                username: "jane_smith",
                email: "jane.smith@example.com",
                googleId: null,
                blogOwner: true,
                password: "securePassword"
            },
            {
                firstName: "Google",
                lastName: "User",
                username: "google",
                email: "google.user@example.com",
                googleId: null,
                blogOwner: false,
                password: "anotherPassword"
            },
        ];
    }

    get newUser() {
        return {
            firstName: "test",
            lastName: "user",
            username: "test90",
            email: "test90@gmail.com",
            googleId: null,
            blogOwner: false,
            password: "test90",
            confirmPassword: "test90",
        }
    }
}

/* 
*   CAUTION!!!
*   This class can only be initalized after users has been put into the mememory db
*   PostFactory relies on realtion and the Users Id need to be entered first
*
*/

// Post Factory
class PostFactory {
    constructor (mockUsers) {
        this.mockUsers = mockUsers.map(user => user.id);
    }

    get allPosts () {
        return [
            {
                title: "Sample Post Title",
                timestamp: new Date(),
                body: "<p>this is a test</p>",
                author: this.mockUsers[0], 
                likes: {
                    number: 2,
                    users: [this.mockUsers[1]] 
                }
            },
            {
                title: "Sample Post Title 2",
                timestamp: new Date(),
                body: "<p>Another test post here.</p>",
                author: this.mockUsers[1], 
                likes: {
                    number: 3,
                    users: [this.mockUsers[2], this.mockUsers[0]]
                }
            },
            {
                title: "Sample Post Title 3",
                timestamp: new Date(),
                body: "<p>Yet another test post.</p>",
                author: this.mockUsers[2], 
                likes: {
                    number: 1,
                    users: [] 
                }
            },
        ]
    } 
}


module.exports = {UserFactory, PostFactory};




// const getPostData = (mockUsers) => {
//     mockUsers = mockUsers.map(user => user._id);

//     return [
//         {
//             title: "Sample Post Title",
//             timestamp: new Date(),
//             body: "<p>this is a test</p>",
//             author: mockUsers[0], 
//             likes: {
//                 number: 2,
//                 users: [mockUsers[1]] 
//             }
//         },
//         {
//             title: "Sample Post Title 2",
//             timestamp: new Date(),
//             body: "<p>Another test post here.</p>",
//             author: mockUsers[1]._id, 
//             likes: {
//                 number: 3,
//                 users: [mockUsers[2]._id, mockUsers[0]]
//             }
//         },
//         {
//             title: "Sample Post Title 3",
//             timestamp: new Date(),
//             body: "<p>Yet another test post.</p>",
//             author: mockUsers[2], 
//             likes: {
//                 number: 1,
//                 users: [] 
//             }
//         },
//     ]
// }

// const getUserData = () => {
//     return [
//         {
//             firstName: "John",
//             lastName: "Doe",
//             username: "john_doe",
//             email: "john.doe@example.com",
//             googleId: null,
//             blogOwner: true,
//             password: "password123"
//         },
//         {
//             firstName: "Jane",
//             lastName: "Smith",
//             username: "jane_smith",
//             email: "jane.smith@example.com",
//             googleId: null,
//             blogOwner: true,
//             password: "securePassword"
//         },
//         {
//             firstName: "Google",
//             lastName: "User",
//             username: "google",
//             email: "google.user@example.com",
//             googleId: null,
//             blogOwner: false,
//             password: "anotherPassword"
//         },
//     ];
// };


// module.exports = {getPostData, getUserData, UserFactory, PostFactory};
