# basic login route dan data
* ~~/register - name, user, pass, email - uid, puid (public uid), block, role, email_valid~~
* ~~/login~~
* ~~/profile/:puid - public - name~~
* ~~/my-profile - get - private - name, user, pass, email, avatar, description, address~~
* ~~/my-profile/- post - private - name, user~~
* /update-email - post - private - email
* /update-password - post - private - password
* /delete/:uid
* /admin/profile/:uid - name, user, pass, email, avatar, description, address, uid, puid, block, role, email_valid
* /verify-email - email verifikasi

# expand login, tambahkan field dan fitur
* /update/:uid - avatar_id, bio, address, latlng
* /public/profile/:puid - avatar, description, address
* /admin/profile/:puid - avatar, description, address
* /login - tambahakan expired dan auto refresh jika refresh token disertakan
* data input validation
