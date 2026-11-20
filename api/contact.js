import { handleContact } from './_lib/contact.js'

export default async function handler(req, res) {
  await handleContact(req, res)
}
