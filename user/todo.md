# basic login route dan data
* ~~/register~~
* ~~/login~~
* ~~/my-profile - get - private~~
* ~~/my-profile/- post - private~~
* ~~/profile/:puid - public~~
* ~~/delete/ - post - private; password~~
* ~~/verify-email - email verifikasi; email_validation~~
* ~~/admin/profile/:puid - get, refactor to use get profile to get user data for all route~~

# expand login, tambahkan field dan fitur
* /admin/profile/:puid - post; is_blocked, role, email_validation
* /register - data input validation
* /login - data input validation
* /update - data input validation
* /validate-email - data input validation
* /delete - data input validation
* /login - tambahakan expired dan auto refresh jika refresh token disertakan
