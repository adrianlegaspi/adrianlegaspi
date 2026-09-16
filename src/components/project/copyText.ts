export async function copyText(
  value: string,
  clipboard: Clipboard | null | undefined = navigator.clipboard,
  documentRoot = document,
) {
  if (clipboard) {
    try {
      await clipboard.writeText(value)
      return true
    } catch {
      // Use the older browser path below.
    }
  }

  const field = documentRoot.createElement('textarea')
  field.value = value
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  documentRoot.body.append(field)
  field.select()

  try {
    return documentRoot.execCommand('copy')
  } catch {
    return false
  } finally {
    field.remove()
  }
}
