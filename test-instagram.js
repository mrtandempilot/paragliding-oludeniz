const token = 'EAANmIBNln7gBRbKZCnbmCRIsreFydeTZBu6AoIWEwfxkodMy9BszZAWHxG17crc1miP27j1leK7i7shO2kvdIyTwewFu9CLmrcxijIePFbBpJ1xF91BoOKIssYbdCqqzSP66PVmHRqZAc8tBAPDZBmbUuJFk1v9iDZBTIhVPF4bsVbmx9AhjTjK6VMQJvxFwZDZD'
const igId = '17841477275430202'
const imageUrl = 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1080&q=80'
const caption = '🪂 Soaring above Ölüdeniz — where the sky meets the sea! #paragliding #oludeniz #babadagmountain #turkey #adventure'

async function main() {
  console.log('Step 1: Creating media container...')

  const containerRes = await fetch('https://graph.facebook.com/v19.0/' + igId + '/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: token })
  })
  const container = await containerRes.json()
  console.log('Container response:', JSON.stringify(container, null, 2))

  if (container.error) {
    console.log('❌ Failed at container step')
    return
  }

  console.log('\nWaiting 10 seconds for Instagram to process the image...')
  await new Promise(resolve => setTimeout(resolve, 10000))

  console.log('\nStep 2: Publishing...')
  const publishRes = await fetch('https://graph.facebook.com/v19.0/' + igId + '/media_publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: container.id, access_token: token })
  })
  const published = await publishRes.json()
  console.log('Publish response:', JSON.stringify(published, null, 2))

  if (published.id) {
    console.log('\n✅ SUCCESS! Posted to Instagram. ID:', published.id)
  } else {
    console.log('\n❌ Failed at publish step')
  }
}

main().catch(console.error)
