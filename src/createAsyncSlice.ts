import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from '@reduxjs/toolkit';
import { Draft } from 'immer';

import {
  isError,
  isSuccess,
  selectAsyncStateError,
  selectAsyncStateValue,
} from '@helpers/selectors';

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
  selectorsStatePath?: string;
}

export const createAsyncSlice = <
  RequestPayload,
  SuccessPayload = undefined,
  ErrorPayload = undefined
>({
  selectorsStatePath,
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

  type SelectorsState = {
    [key: string]: {
      [key: string]: AsyncState<SuccessPayload, ErrorPayload> | any;
    };
  };

  const selectors = selectorsStatePath && {
    asyncState: (state: SelectorsState) =>
      state[selectorsStatePath][options.name] as AsyncState<
        SuccessPayload,
        ErrorPayload
      >,
    value: (state: SelectorsState): SuccessPayload | null =>
      selectAsyncStateValue(
        state[selectorsStatePath][options.name]
      ) as SuccessPayload | null,
    error: (state: SelectorsState): ErrorPayload | null =>
      selectAsyncStateError(
        state[selectorsStatePath][options.name]
      ) as ErrorPayload | null,
    isSuccess: (state: SelectorsState) =>
      isSuccess(state[selectorsStatePath][options.name]),
    isError: (state: SelectorsState) =>
      isError(state[selectorsStatePath][options.name]),
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
