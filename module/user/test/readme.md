# Test case

- test per route, not per service
- valid doc for available response for each route
- install mocha global if error mocha not found
- run with  
  `$ npm test user`

## Service

### register with email password

- fail, missing on validate display_name
- fail, missing on validate email
- fail, missing on validate username
- fail, missing on validate password
- fail, invalid on validate display_name
- fail, invalid on validate email
- fail, invalid on validate username
- fail, invalid on validate password
- success
- fail, email exist
- fail, username exist

### login

- Auth Token
- fail, mising on validate username
- fail, mising on validate password
- fail, invalid on validate username
- fail, invalid on validate password
- fail, User not found
- fail, Wrong password

### get profile

- missing token
- invalid token
- user not found
- success

### update profile

- missing on validate display_name
- missing on validate email
- missing on validate username
- missing on validate avatar_id
- missing on validate bio
- missing on validate address
- missing on validate latlng
- missing on validate timezone
- invalid on validate display_name
- invalid on validate email
- invalid on validate username
- invalid on validate avatar_id
- invalid on validate bio
- invalid on validate address
- invalid on validate latlng
- invalid on validate timezone
- missing token
- invalid token
- nothing to update
- profile updated exclude email update
- profile updated include email, email not validated

### request email verification code

- invalid or missing token
- fail, email already validate
- verification code sent

### verify email address

- missing on validate code
- invalid on validate code
- missing token
- invalid token
- email verification fail
- email already validate
- email validated

### delete profile

- missing token
- invalid token
- user not found
- user added to deletion schedule
