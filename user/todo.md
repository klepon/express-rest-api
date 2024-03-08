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
* /admin/update/:puid - post; is_blocked, role, email_validation  
* rubah profile jadi middlwware sendiri, jadi profile nanti seperti public dan admin agar middlw ware bisa di folder sendiri
* /admin/delete - post; puid  
* change my-profile to profile  
* /register - data input validation  
* /login - data input validation  
* /update - data input validation  
* /validate-email - data input validation  
* /delete - data input validation  
* /login - tambahakan expired dan auto refresh jika refresh token disertakan  
