// Spoken/typed confirmation check for Neslihan's actions. Runs on the server
// against the user's own last message, so the model can't confirm by itself.
// Negatives are checked first ("gönderme" must not match "gönder").

const B = '(?=$|[\\s,.!?])' // word end, so "ok" doesn't match "okudun"
const NO_RE = new RegExp(`(^|[\\s,.!?])(hayır|hayir|iptal|vazgeç|vazgec|değiştir|degistir|yapma|gönderme|gonderme|istemiyorum|(dur|bekle|no)${B})`)
const YES_RE = new RegExp(`(^|[\\s,.!?])(evet|onayl|gönder|gonder|tamam|kabul|peki|yes|((ok|okey|olur|yap|yapın|yapabilirsin)${B}))`)

export function isYes(text: string) {
  const s = (text || '').toLocaleLowerCase('tr-TR')
  return !NO_RE.test(s) && YES_RE.test(s)
}
