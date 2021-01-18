const prefix = 'WINWIN_HEXO_EDITOR_'
const loginToken = prefix + 'LOGIN_TOKEN'
const refreshToken = prefix + 'REFRESH_TOKEN'

export function saveLoginToken (token) {
  try {
    localStorage.setItem(loginToken, token)
  } catch {
    var err = new Error('Storage Error')
    err.message = 'Web Storage APIエラーにより，データが正常に保存されませんでした'
    throw err
  }
}

export function loadLoginToken () {
  return localStorage.getItem(loginToken)
}

export function saveRefreshToken (token) {
  try {
    localStorage.setItem(refreshToken, token)
  } catch {
    var err = new Error('Storage Error')
    err.message = 'Web Storage APIエラーにより，データが正常に保存されませんでした'
    throw err
  }
}

export function loadRefreshToken () {
  return localStorage.getItem(refreshToken)
}
