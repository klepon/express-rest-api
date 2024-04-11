## table media
* POST /media/upload - iid, uid, piid is_public, number_of_use, date_of_sero_use
* GET /media/delete/:piid
* GET /media/list - public if is_public
* GET /media/:piid - public if is_public
* middleware delete on user removed
* middleware delete for image more tha 3d with number_of_use === 0

## table album
* POST /album/create - aid, uid, paid, name, short_desc, is_public
* POST /album/update/:paid
* GET /album/delete/:paid
* GET /album/list - public if is_public
* GET /album/:paid - public if is_public

## table album_media
* POST /album/add - paid, piid
* GET /album/remove - paid, piid
* middleware delete row when media/album deleted