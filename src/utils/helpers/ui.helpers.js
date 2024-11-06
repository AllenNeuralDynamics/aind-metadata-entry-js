import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'

/**
 * Wrapper function for onChange event handlers.
 * Calls the callback function with the value of the event target.
 * Blurs the event target to remove focus.
 *
 * @param {Event} event - event object
 * @param {func | null} callback - optional callback function
 */
export function onChangeWrapper (event, callback) {
  if (callback) {
    callback(event.target.value)
  }
  event.target.blur()
}

/**
 * Wraps a promise with a toast notification.
 * Toast promise is used to display pending, success, and error messages.
 * Optional dismissError function for specific error handling.
 *
 * @param {Promise} promise - promise to wrap
 * @param {string} pendingMsg - optional custom pending message
 * @param {string} successMsg - optional custom success message
 * @param {func} dismissError - optional dismiss error function. dismissError(error) must return true to dismiss the notification
 */
export async function toastPromiseWrapper (promise, pendingMsg, successMsg, dismissError) {
  const toastID = nanoid()
  toast.promise(
    promise,
    {
      pending: pendingMsg ?? 'Processing...',
      success: successMsg ?? 'Success!',
      error: {
        render ({ data }) {
          if (dismissError && dismissError(data)) {
            return 'Dismissed.'
          }
          return `${data.name}: ${data.message}`
        }
      }
    },
    { toastId: toastID }
  ).catch((error) => {
    if (dismissError && dismissError(error)) {
      toast.dismiss(toastID)
    }
  })
}
