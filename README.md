# ChatApp
 * App which was developed as part of my asp.net core course. Its goal was to learn how real
 time communication and data exchange between server and client works. It includes features
 such as authentication, friend management messaging and notifications all handled in real
time using siglalR library.

### Features
* **Authentication** &rarr; app provides a secure authentication with features such as registration, login and logout. Authentication state is stored in JWT tokens. Each time a user makes a request to the server, the server checks whether the user's token is valid. This ensures taht user data is secured.
* **managing friends** &rarr; Users can search for new friends by browsing the user list, send users friend invitations, accept or cancel received invitations and also remove other users from the friend list. When users make a new acquaintance among themselves, a new chat is automatically created between them. Similarly, when users end their friendship the chat is deleted.
* **Creating group chats with friends** &rarr;The application allows users to create group chats. The owner of a chat during its creation can add users to the chat from their friends list. In addition, the list of users and the chat name can be modified after the chat has been created.
Chat users can leave the chat at will. When this happens the chat is updated for the remaining users.
* **real time notifications** App provides real-time notifications for actions such as adding a friend, being added to a chat room, etc. Also, if an action fails the user will be informed, along with the information why the system could not perform the action.  
* **Theming** &rarr; App provides light and dark theme.


### Technologies & Patterns
* Docker & Docker Compose
* PostgreSQL
#### Frontend
* TS (TypeScript)
* React
* Axios
* SignalR
* Radix UI
* React Redux
* React Router
* Tailwind CSS
* TanStack Query
* JWT Authentication
#### Backend
* C#
* ASP.NET Core 8.0
* Entity Framework Core
* MediatR
* SignalR
* Hexagonal Architecture
* Mediator Pattern


## Prerequisites
* Before setting up the application, make sure you have **Docker** and **Docker Compose** installed on your machine.
 
## Setup Instructions
1. Clone GitHub Repository:
    ```
    git clone git@github.com:AndrzejMorawski00/ChatApp.git
    ```
2. Setup ``.env`` file:
    * Create your own ``.env`` file next to existing ``.env.template`` file, or copy the content of the template into the ``.env`` file.
3. Run app:
    ```
    docker-compose -f .\docker-compose.yml up -d
    ```

## Access apps:
* To access frontend app navigate to: http://localhost
* Backend app provides a swagger page http://localhost:8080/swagger/index.html as its interface. This was done intentionally to provide a clean site for API documentation.