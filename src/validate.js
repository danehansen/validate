import { luhn } from '@danehansen/math'

const NON_DIGITS = /\D/g
const NON_DIGITS_AND_LETTERS = /[^A-Za-z0-9]/g

const AMEX = /^3[47]\d{13}$/
const VISA = /^4\d{15}$/
const MASTER_CARD = /^5[1-5]\d{14}$/
const DISCOVER = /^6((011)|(22(1(2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9([01][0-9]|2[0-5])))|(4[4-9])|(5))/
export function creditCard(str) {
  if (!str) {
    return false
  }
  str = str.replace(NON_DIGITS, '')

  if (!luhn(parseInt(str))) {
    return false
  }

  if (AMEX.test(str)) {
    return 'American Express'
  } else if (VISA.test(str)) {
    return 'VISA'
  } else if (MASTER_CARD.test(str)) {
    return 'MasterCard'
  } else if (DISCOVER.test(str)) {
    return 'Discover'
  }

  return false
}

const EMAIL = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/
export function email(str) {
  return !!str || EMAIL.test(str)
}

export function expiration(mmyy) {
  if (!mmyy) {
    return false
  }

  mmyy = mmyy.replace(NON_DIGITS, '')
  const { length } = mmyy
  if (length < 3 || length > 6) {
    return false
  }

  const divider = length % 2 ? 1 : 2
  const mm = parseInt(mmyy.substr(0, divider))
  if (mm > 12 || !mm) {
    return false
  }

  let yy = parseInt(mmyy.substr(divider))
  const now = new Date(Date.now())
  const year = now.getFullYear()
  if (length < 5) {
    const mod = Math.floor(year / 100) * 100
    yy = mod + yy
  }
  if (yy > year || (yy == year && mm > (now.getMonth()))) {
    return {
      month: mm,
      year: yy,
    }
  }

  return false
}

export function phoneNumber(str) {
  if (!str) {
    return false
  }

  str = str.replace(NON_DIGITS, '')

  const { length } = str
  if (length > 11 || length < 10) {
    return false
  }

  const prefix = str.slice(length - 11, length - 10)
  if (prefix && prefix !== '1') {
    return false
  }

  const number = parseInt(str.slice(length - 10))
  if (number < 2000000000) {
    return false
  } else if (number >= 9110000000 && number <= 9119999999) {
    return false
  }

  return true
}

const CA_ZIP = /^[abceghj-nprstvxy]\d[abceghj-nprstv-z]\d[abceghj-nprstv-z]\d$/i
export function zipCode(str, country) {
  if (!str) {
    return false
  }

  switch (country) {
    case 'ca':
      str = str.replace(NON_DIGITS_AND_LETTERS, '').toLowerCase()
      return CA_ZIP.test(str)
    default:
      str = str.replace(NON_DIGITS, '')
      const { length } = str
      return length === 9 || length === 5
  }
}
