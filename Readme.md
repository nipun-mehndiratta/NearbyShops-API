NearbyShops API
The NearbyShops API allows users to register shop owners, manage shops, and find nearby shops based on their location.

Table of Contents
Features
Prerequisites
Installation
Usage
API Endpoints
Postman Collection

Features

- Shop owners can register, log in, and manage their shops.
- Users can register, log in, and search for shops by category, Near by shops.
- JWT-based authentication.
- MongoDB for database storage.

Prerequisites
Before getting started, ensure you have the following installed:

Node.js
MongoDB (running instance or a MongoDB Atlas connection)
Postman (for testing API endpoints)


Installation
Clone or download this repository to your local machine.
Navigate to the project directory using your terminal.
Install the required dependencies by running:
npm install
Create a .env file in the project root and add your environment variables, such as SECRET_KEY and MONGODB_URI.

Usage
Start the server:
node server.js
The API will be available at http://localhost:3003.

API Endpoints
The following API endpoints are available:

Shop Owners:

POST /shopowners/register: Register a new shop owner.
POST /shopowners/login: Log in as a shop owner.

Shops:

POST /createShop: Create a new shop (requires authentication as a shop owner).
PUT /editShop/:id: Edit shop details (requires authentication as the shop owner).
DELETE /deleteShop/:id: Delete a shop (requires authentication as the shop owner).

Users:

POST /user/register: Register a new user.
POST /user/login: Log in as a user.

Search Shops:

GET /shops/search/:category: Search for shops by category.

Get Nearby Shops:

GET /shops: Get nearby shops based on user's location (requires authentication and query parameters lat and long).


Postman Collection

For easy testing of the API endpoints, you can use the included Postman collection. Import the collection into Postman and replace placeholders like <token> and <shop_id> with actual values.