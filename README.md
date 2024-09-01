# 🍽️ Restaurant Web Application Backend - MERN Project "Nyam Nyam"

This is the backend component of the Restaurant Web Application project, named "Nyam Nyam." It is built using Express.js and provides the API and business logic required for managing restaurants, users, and reviews.

## 🌟 Project Overview

The backend of this project allows users and restaurant owners to interact with the application. Users can register, leave comments, and rate restaurants. Restaurant owners can manage their establishments and view feedback. 

### 🛠️ Technologies Used

- **Express.js**: Web framework for Node.js.
- **bcrypt**: Library for hashing passwords.
- **Payload**: Content management system for managing data.
- **jsonwebtoken (JWT)**: For authentication and authorization.
- **axios**: For making HTTP requests.
- **MongoDB**: Database for storing data.
- **Cloudinary**: Used for image storage and management.
- **Vercel**: Deployed and hosted the backend on Vercel.
- **Postman**: Used for testing and documenting API routes.

### 🚀 Getting Started

#### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary account](https://cloudinary.com/) (for image management)

#### Installation

1. **Clone the repository**:
   ```bash
   git clone [URL_DEL_REPOSITORIO_BACKEND]


2. **Navigate to the project directory:**

    ```bash
    cd [NOMBRE_DEL_DIRECTORIO]

3. **Install dependencies:**

    ```bash
    npm install

4. **Set up environment variables:**
   Create a **.env** file in the root directory and add your configuration. Example .env file:

    ```dotenv

    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_URL=your_cloudinary_url
    PORT=3000

 5. **Run the server:**

    ```bash
    
     npm start


**API Endpoints**

Use Postman to test the following routes:


| Route                       | Descriptión                                            | Model       |
|-----------------------------|--------------------------------------------------------|-------------|
| /api/users/signup           | Register a new user                                    | User        |  
| /api/users/login            | Log in an existing user                                | User        |
| /api/users/profile          | Get the profile of the authenticated user              | User        |
| /api/users/profile/update   | Update user profile information                        | User        | 
| /api/users/profile/delete   | Delete user profile and all associated data            | User        |
| /api/restaurants/read       | Get the list of all restaurants                        | Restaurant  |
| /api/restaurants/:id        | Get details of a specific restaurant                   | Restaurant  |
| /api/restaurants/create     | Create a new restaurant                                | Restaurant  |
| /api/restaurants/edit/:id   | Edit a restaurant's information                        | Restaurant  | 
| /api/restaurants/delete/:id | Delete a restaurant                                    | Restaurant  |
| /api/ratings/:restaurantId  | Get ratings for a specific restaurant                  | Rating      |
| /api/ratings/rate           | Add a rating to a specific restaurant                  | Rating      |
| /api/comments/:restaurantId | Get comments for a specific restaurant                 | Comment     |
| /api/comments/create        | Add a comment to a specific restaurant                 | Comment     |


📦 **Deployment**

    Vercel: The backend is deployed and accessible via Vercel. Check the deployment status and logs on the Vercel dashboard.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.


👤 Author
Maksim Georgiev Marinov - [mks1313](https://github.com/mks1313)

📧 Contact

<div style="display: flex; align-items: center; justify-content: center;">

  <a href="mailto:mg.marinov@gmx.es" style="margin: 0 30px;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Mail_%28iOS%29.svg" width="40" alt="Email">
  </a>

  <a href="https://www.linkedin.com/in/mgmarinov/" style="margin: 0 30px;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" width="40" alt="LinkedIn">
  </a>

  <a href="https://www.mgmarinov.com/portfolio" style="margin: 0 30px;">
    <img src="https://res.cloudinary.com/dnwyfbj7m/image/upload/v1724882231/portfolio.png" width="40" alt="Portfolio">
  </a>

</div>


Feel free to reach out if you have any questions or feedback.

## 🌐 Visit the Application

You can access the application at: [Nyam Nyam](https://project-3-client.vercel.app/)
