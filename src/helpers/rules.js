// using code from https://vuetifyjs.com/en/components/forms/#rules

export function required(value) {
  // copied from https://vuetifyjs.com/en/components/forms/#rules
  if (value) return true
  return 'This is required.'
}

export function noWhiteSpace(value) {
  if (value.search(/\s/) === -1) return true
  return 'Spaces are not allowed.'
}

export function emailFormat(value) {
  // below regex copied from https://regexr.com/2ri2c
  if (value.search(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/) === 0) return true
  return 'Email format is required.'
}
