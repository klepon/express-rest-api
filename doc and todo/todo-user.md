# setup postgresql
* /register - name, user, pass, email - uid, puid (public uid), block, role, email_valid
* /login
* /update/:uid - name, user, pass, email
* /delete/:uid
* /public/profile/:puid - name
* /private/profile/:uid - name, user, pass, email, avatar, description, address
* /admin/profile/:uid - name, user, pass, email, avatar, description, address, uid, puid, block, role, email_valid

# expand, tambahkan field dan fitur
* /update/:uid - avatar, description, address
* /public/profile/:puid - avatar, description, address
* /admin/profile/:puid - avatar, description, address