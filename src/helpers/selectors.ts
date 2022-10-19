import { DefaultListPayload, AsyncListState } from '@createAsyncMappingSlice';
import { AsyncState } from '@createAsyncSlice';

export const pure = <T>(state: T) => state;

export const selectAsyncStateValue = (
  asyncState: AsyncState<unknown, unknown>
) => asyncState.value;

export const isProcessing = (asyncState: AsyncState<unknown, unknown>) =>
  asyncState.isProcessing;

export const isSuccess = (asyncState: AsyncState<unknown, unknown>) =>
  !asyncState.isProcessing && asyncState.isSuccess;

export const selectAsyncStateError = (
  asyncState: AsyncState<unknown, unknown>
) => (!asyncState.isProcessing && asyncState.error) || null;

export const isError = (asyncState: AsyncState<unknown, unknown>) =>
  !asyncState.isProcessing && !!asyncState.error;

export const selectAsyncListStateValue = (
  listAsyncState?: AsyncListState<unknown, unknown>,
  payload?: DefaultListPayload
) =>
  (listAsyncState && payload?.id && listAsyncState[payload.id]?.value) || null;

export const isListItemProcessing = (
  listAsyncState?: AsyncListState<unknown, unknown>,
  payload?: DefaultListPayload
) =>
  !!(
    payload?.id &&
    listAsyncState &&
    listAsyncState[payload?.id] &&
    isProcessing(listAsyncState[payload.id] as AsyncState<unknown, unknown>)
  );

export const isListItemSuccess = (
  listAsyncState?: AsyncListState<unknown, unknown>,
  payload?: DefaultListPayload
) =>
  !!(
    payload?.id &&
    listAsyncState &&
    listAsyncState[payload?.id] &&
    isSuccess(listAsyncState[payload.id] as AsyncState<unknown, unknown>)
  );

export const selectListItemError = (
  listAsyncState?: AsyncListState<unknown, unknown>,
  payload?: DefaultListPayload
) =>
  payload?.id &&
  listAsyncState &&
  listAsyncState[payload?.id] &&
  selectAsyncStateError(
    listAsyncState[payload.id] as AsyncState<unknown, unknown>
  );

export const isListItemError = (
  listAsyncState?: AsyncListState<unknown, unknown>,
  payload?: DefaultListPayload
) =>
  !!(
    payload?.id &&
    listAsyncState &&
    listAsyncState[payload?.id] &&
    isError(listAsyncState[payload.id] as AsyncState<unknown, unknown>)
  );
