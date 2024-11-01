import { toast } from 'react-toastify'
import {
  onChangeWrapper,
  toastPromiseWrapper
} from '../../../utils/helpers/ui.helpers'

describe('onChangeWrapper', () => {
  const MOCK_EVENT = {
    target: {
      value: 'test',
      blur: jest.fn()
    }
  }
  it('calls the callback with the value of the event target', () => {
    const callback = jest.fn()
    onChangeWrapper(MOCK_EVENT, callback)
    expect(callback).toHaveBeenCalledWith('test')
  })

  it('blurs the event target', () => {
    onChangeWrapper(MOCK_EVENT)
    expect(MOCK_EVENT.target.blur).toHaveBeenCalled()
  })
})

describe('toastPromiseWrapper', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls toast.promise with the correct default parameters', () => {
    const promise = Promise.resolve()
    const toastSpy = jest.spyOn(toast, 'promise')
    const expectedDefaultParams = {
      pending: 'Processing...',
      success: 'Success!',
      error: expect.any(Object)
    }
    const expectedToastOptions = { toastId: expect.any(String) }
    toastPromiseWrapper(promise)
    expect(toastSpy).toHaveBeenCalledWith(
      promise,
      expectedDefaultParams,
      expectedToastOptions
    )
  })

  it('dismisses the toast if dismissError returns true', async () => {
    const toastSpy = jest.spyOn(toast, 'dismiss')
    const mockPromise = jest.fn().mockRejectedValue(new Error('Test error'))
    const dismissError = jest.fn().mockReturnValue(true)
    await toastPromiseWrapper(mockPromise, undefined, undefined, dismissError)
    expect(dismissError).toHaveBeenCalled()
    expect(toastSpy).toHaveBeenCalled()
  })
})
