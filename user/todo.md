# basic login route dan data
* ~~/register - name, user, pass, email - uid, puid (public uid), block, role, email_valid~~
* ~~/login~~
* ~~/profile/:puid - public - name~~
* ~~/my-profile - private - name, user, pass, email, avatar, description, address~~
* /update/:uid - name, user, pass, email
* /delete/:uid
* /admin/profile/:uid - name, user, pass, email, avatar, description, address, uid, puid, block, role, email_valid
* /verify-email - email verifikasi

# expand login, tambahkan field dan fitur
* /update/:uid - avatar, description, address
* /public/profile/:puid - avatar, description, address
* /admin/profile/:puid - avatar, description, address
* /login - tambahakan salt yg di set lewat envar di jwt.sign, misal; username,uid,randomTextTanpaComa,email untuk menghindari brute force untuk mendapatkan salt jwt secret
