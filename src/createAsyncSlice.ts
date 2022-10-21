import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from '@reduxjs/toolkit';
import { Draft } from 'immer';

import {
  isError,
  isProcessing,
  isSuccess,
  selectAsyncStateError,
  selectAsyncStateValue,
} from './helpers/selectors';

export interface AsyncState<SuccessPayload, ErrorPayload> {
  isProcessing: boolean;
  isSuccess: boolean;
  error: ErrorPayload | null;
  value: SuccessPayload | null;
  [key: string]: unknown;
}

export type PartialAsyncState<S, E> = Partial<AsyncState<S, E>>;

export interface CreateAsyncSliceOptions<State> {
  reducers?: ValidateSliceCaseReducers<State, SliceCaseReducers<State>>;
  initialState?: State;
  name: string;
  selectAsyncState?: (state: any) => State;
}

export const DEFAULT_ASYNC_STATE = {
  value: null,
  error: null,
  isProcessing: false,
  isSuccess: false,
};

export const createAsyncSlice = <
  RequestPayload,
  SuccessPayload = undefined,
  ErrorPayload = undefined
>({
  selectAsyncState = () => DEFAULT_ASYNC_STATE,
  ...options
}: CreateAsyncSliceOptions<
  PartialAsyncState<SuccessPayload, ErrorPayload>
>) => {
  const initialState: AsyncState<SuccessPayload, ErrorPayload> = {
    isProcessing: false,
    isSuccess: false,
    error: null,
    value: null,
  };

  const selectors = {
    asyncState: selectAsyncState,
    value: (state: any): SuccessPayload | null =>
      selectAsyncStateValue(
        selectAsyncState(state) as AsyncState<SuccessPayload, ErrorPayload>
      ) as SuccessPayload | null,
    isProcessing: (state: any) =>
      isProcessing(
        selectAsyncState(state) as AsyncState<SuccessPayload, ErrorPayload>
      ),
    error: (state: any): ErrorPayload | null =>
      selectAsyncStateError(
        selectAsyncState(state) as AsyncState<SuccessPayload, ErrorPayload>
      ) as ErrorPayload | null,
    isSuccess: (state: any) =>
      isSuccess(
        selectAsyncState(state) as AsyncState<SuccessPayload, ErrorPayload>
      ),
    isError: (state: any) =>
      isError(
        selectAsyncState(state) as AsyncState<SuccessPayload, ErrorPayload>
      ),
  };

  return {
    ...createSlice({
      ...options,
      initialState: {
        ...initialState,
        ...options.initialState,
      },
      name: `async/${options.name}`,
      reducers: {
        reset: (state) => {
          state.isProcessing = false;
          state.isSuccess = false;
          state.error = null;
          state.value = null;
        },
        request: (state, _action: PayloadAction<Draft<RequestPayload>>) => {
          state.isProcessing = true;
          state.isSuccess = false;
          state.error = null;
        },
        success: (state, action: PayloadAction<Draft<SuccessPayload>>) => {
          state.isProcessing = false;
          state.isSuccess = true;
          state.value = action.payload;
          state.error = null;
        },
        error: (state, action: PayloadAction<Draft<ErrorPayload>>) => {
          state.isProcessing = false;
          state.isSuccess = false;
          state.error = action.payload;
        },
        ...options.reducers,
      },
    }),
    actionNames: {
      request: `async/${options.name}/request`,
      success: `async/${options.name}/success`,
      error: `async/${options.name}/error`,
    },
    selectors,
  };
};
