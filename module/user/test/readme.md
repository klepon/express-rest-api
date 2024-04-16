# Test case

- test per route, not per middleware
- valid doc for available response for each route
- install mocha global if error mocha not found
- run with  
  `$ npm test {service name}`  
  or individual test file
  `$ npm test {service name} {filename without extension}`

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
- token expired
- invalid token
- user not found
- success

### update profile

- invalid on validate display_name
- invalid on validate email
- invalid on validate username
- invalid on validate avatar_id
- invalid on validate bio
- invalid on validate address
- invalid on validate latlng
- invalid on validate timezone
- missing token
- token expired
- invalid token
- nothing to update
- profile updated exclude email update
- profile updated include email, email not validated
- fail, email exist
- fail, username exist

### request email verification code

- missing token
- token expired
- invalid token
- verification code sent
- email already validate

### verify email address

- missing on validate code
- invalid on validate code
- missing token
- token expired
- invalid token
- email verification fail
- email validated
- email already validate

### delete profile

- missing token
- token expired
- invalid token
- fail deleting user
- user added to deletion schedule
