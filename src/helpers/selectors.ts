import { DefaultListPayload, _AsyncListState } from '@createAsyncListSlice';
import { _AsyncState } from '@createAsyncSlice';

export const isProcessing = (asyncState: _AsyncState<unknown, unknown>) =>
  asyncState.isProcessing;

export const isSuccess = (asyncState: _AsyncState<unknown, unknown>) =>
  !asyncState.isProcessing && asyncState.isSuccess;

export const isError = (asyncState: _AsyncState<unknown, unknown>) =>
  !asyncState.isProcessing && !!asyncState.error;

export const pure = <T>(state: T) => state;

export const isListItemProcessing = (
  listAsyncState?: _AsyncListState<unknown, unknown>,
  payload?: DefaultListPayload
) =>
  !!(
    payload?.id &&
    listAsyncState &&
    listAsyncState[payload?.id] &&
    isProcessing(listAsyncState[payload.id] as _AsyncState<unknown, unknown>)
  );

export const isListItemSuccess = (
  listAsyncState?: _AsyncListState<unknown, unknown>,
  payload?: DefaultListPayload
) =>
  !!(
    payload?.id &&
    listAsyncState &&
    listAsyncState[payload?.id] &&
    isSuccess(listAsyncState[payload.id] as _AsyncState<unknown, unknown>)
  );

export const isListItemError = (
  listAsyncState?: _AsyncListState<unknown, unknown>,
  payload?: DefaultListPayload
) =>
  !!(
    payload?.id &&
    listAsyncState &&
    listAsyncState[payload?.id] &&
    isError(listAsyncState[payload.id] as _AsyncState<unknown, unknown>)
  );
