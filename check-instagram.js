const token = 'EAANmIBNln7gBRbKZCnbmCRIsreFydeTZBu6AoIWEwfxkodMy9BszZAWHxG17crc1miP27j1leK7i7shO2kvdIyTwewFu9CLmrcxijIePFbBpJ1xF91BoOKIssYbdCqqzSP66PVmHRqZAc8tBAPDZBmbUuJFk1v9iDZBTIhVPF4bsVbmx9AhjTjK6VMQJvxFwZDZD'
const postId = '17932888782085435'

fetch(`https://graph.facebook.com/v19.0/${postId}?fields=id,media_type,media_url,permalink,timestamp,caption&access_token=${token}`)
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
  .catch(e => console.error(e.message))
