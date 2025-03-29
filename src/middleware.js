import { fetchProfile } from './services/api/users'
import {
  deleteSessionLogin,
  getSessionLogin,
} from './storage-management/local-storage/session-login'
import { usersStore } from './stores/users'

export const middleware = async (path) => {
  const token = getSessionLogin()
  const userStore = usersStore()
  const { setProfile } = userStore

  let isValidAuth = false
  let message = ''
  let redirectPage = null

  if (token) {
    // check token session in profile
    const profile = await fetchProfile({ token })
    if (profile?.errJwt) {
      setProfile(null)
      // reset token in local storage
      if (path !== '/login') {
        redirectPage = '/login'
        message = 'Your session has expired, please log back in.'
      }
      deleteSessionLogin()
    } else if (profile?.data?._id) {
      setProfile(profile)
      isValidAuth = true
      if (path === '/login') {
        redirectPage = '/'
      }
    }
  } else if (path !== '/login') {
    setProfile(null)
    redirectPage = '/login'
  }

  return {
    isValidAuth,
    message,
    redirectPage,
  }
}
