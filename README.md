# QR Ticket Generator App

### Project Description
This app serves as a QR code generator for tickets. Additionally, it displays information stored in a database for each ticket.
The application is publicly accessible here: [QR-app](https://qr-app-frontend.onrender.com/)

The solution includes the following functionalities:

- **Public Home Page**

  - Displays the total number of tickets generated so far.

- **Ticket Generation Endpoint**

  - Accessible via an API endpoint that receives a JSON payload with properties:
    - **vatin**: Unique identification number 
    - **firstName**: First name of the ticket holder.
    - **lastName**: Last name of the ticket holder.
  - A successful request returns an image with a QR code.
 - The ticket generation endpoint uses the OAuth2 Client Credentials mechanism, which authorizes the application itself (not individual users). Detailed information on this can be found on Auth0's blog: https://auth0.com/blog/using-m2m-authorization

- **Ticket Details Page**

  - This page is uniquely identified by the ticket's identifier and displays ticket details.
  - Only authenticated users can access this page.
    
**Technologies Used**:

- React & TypeScript for frontend development.
- Tailwind CSS for styling.
- Auth0 for authentication and authorization.
- React Router for navigation and route handling.
- PostgreSQL on Render for data storage.
- OAuth2 and OpenID Connect (OIDC) protocols for secure user management and application authorization.
  
  
