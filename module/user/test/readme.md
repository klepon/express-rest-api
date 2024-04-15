# Test case

- test per route, not per service
- valid doc for available response for each route
- install mocha global if error mocha not found
- run with  
  `$ npm test user`

## Service

### register with email password

- success
- fail, missing on validate display_name
- fail, missing on validate email
- fail, missing on validate username
- fail, missing on validate password
- fail, invalid on validate display_name
- fail, invalid on validate email
- fail, invalid on validate username
- fail, invalid on validate password
- fail, email exist
- fail, username exist

### login

- success
- fail, mising on validate username
- fail, mising on validate password
- fail, invalid on validate username
- fail, invalid on validate password
- 401, Login get user
- 401, Login check password

<!-- todo: add validation testing, missing/invalid for rest of bellow -->

### get profile

- success
- invalid or missing token
- user not found
- user blocked
- user in deletion schedule
- user email not validate
- user email valid

### update profile

- success, exclude email update
- success update email, new email not validate
- invalid or missing token

### request email verification code

- success
- invalid or missing token
- fail, email already validate

### verify email address

- success
- invalid or missing token
- fail, invalid verification code
- fail, email already validate

### delete profile

- success
- invalid or missing token
- fail, user not found
