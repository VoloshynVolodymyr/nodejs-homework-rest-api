# Contacts database

## Used libraries

The following libraries were used when working on the project  
[cors](https://www.npmjs.com/package/cors)  
[cross-env](https://www.npmjs.com/package/cross-env)  
[dotenv](https://www.npmjs.com/package/dotenv)  
[express](https://www.npmjs.com/package/express)  
[joi](https://www.npmjs.com/package/joi)  
[moment](https://www.npmjs.com/package/moment)  
[mongoose](https://www.npmjs.com/package/mongoose)  
[morgan](https://www.npmjs.com/package/morgan)  
[nanoid](https://www.npmjs.com/package/nanoid)  

## Usage

```python
import foobar

# Return all contacts
get .../api/contacts

# Return contact by "id"
get .../api/contacts/:id

# Add a contact to the contact list
post .../api/contacts

# Delete contact by "id"
delete .../api/contacts/:id

# Update contact details by "id"
put .../api/contacts/:id

# Change the "favorite" field for a contact by "id"
patch .../api/contacts/:id/favorite

# New user registration
post .../api/auth/register

# Sends a link for authorization to the user's email
get .../api/auth//verify/:verificationToken

# Re-sends the verification link to the user's email
post .../api/auth//resend-verify-email

# User login
post .../api/auth/login

# Getting information about the current user
get .../api/auth/current

# User logout
post .../api/auth/logout

# Sets a new avatar for the current user
patch .../api/auth/avatars
```