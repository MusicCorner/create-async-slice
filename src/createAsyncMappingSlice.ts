import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Draft } from 'immer';

import {
  isListItemError,
  isListItemProcessing,
  isListItemSuccess,
  selectAsyncListStateValue,
  selectListItemError,
} from './helpers/selectors';
import { AsyncState, CreateAsyncSliceOptions } from './createAsyncSlice';

export type AsyncListState<S, E> = {
  [key: string]: AsyncState<S, E> | undefined;
};

export interface DefaultListPayload {
  id: string;
}

export interface DefaultListSuccessPayload<T> extends DefaultListPayload {
  value: T;
}

export interface DefaultListErrorPayload<T> extends DefaultListPayload {
  error: T;
}

export interface CreateAsyncMappingsOptions<S>
  extends CreateAsyncSliceOptions<S> {
  mappingsAmountLimit?: number;
}

export const createAsyncMappingSlice = <
  RequestPayload extends DefaultListPayload = DefaultListPayload,
  SuccessValue = unknown,
  ErrorValue = string,
  SuccessPayload extends DefaultListSuccessPayload<SuccessValue> = DefaultListSuccessPayload<SuccessValue>,
  ErrorPayload extends DefaultListErrorPayload<ErrorValue> = DefaultListErrorPayload<ErrorValue>
>({
  selectAsyncState = () => ({}),
  mappingsAmountLimit,
  ...options
}: CreateAsyncMappingsOptions<AsyncListState<SuccessValue, ErrorValue>>) => {
  const initialState: AsyncListState<SuccessValue, ErrorValue> = {
    // [id]: {
    // 	isProcessing: false,
    // 	isSuccess: false,
    // 	error: null,
    // 	value: null
    // }
  };

  const selectors = {
    asyncListState: (state: any) =>
      selectAsyncState(state) as AsyncListState<SuccessValue, ErrorValue>,
    asyncState: (state: any, payload: DefaultListPayload) =>
      (selectAsyncState(state) as AsyncListState<SuccessValue, ErrorValue>)[
        payload.id
      ],
    value: (state: any, payload: DefaultListPayload): SuccessValue =>
      selectAsyncListStateValue(
        selectAsyncState(state) as AsyncListState<SuccessValue, ErrorValue>,
        payload
      ) as SuccessValue,
    isProcessing: (state: any, payload: DefaultListPayload) =>
      isListItemProcessing(
        selectAsyncState(state) as AsyncListState<SuccessValue, ErrorValue>,
        payload
      ),
    error: (state: any, payload: DefaultListPayload): ErrorValue =>
      selectListItemError(
        selectAsyncState(state) as AsyncListState<SuccessValue, ErrorValue>,
        payload
      ) as ErrorValue,
    isSuccess: (state: any, payload: DefaultListPayload) =>
      isListItemSuccess(
        selectAsyncState(state) as AsyncListState<SuccessValue, ErrorValue>,
        payload
      ),
    isError: (state: any, payload: DefaultListPayload) =>
      isListItemError(
        selectAsyncState(state) as AsyncListState<SuccessValue, ErrorValue>,
        payload
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
        reset: (state, action: PayloadAction<Draft<DefaultListPayload>>) => {
          const { id } = action.payload;

          state[id] = {
            ...state[id],
            isProcessing: false,
            isSuccess: false,
            error: null,
            value: null,
          };
        },
        request: (state, action: PayloadAction<Draft<RequestPayload>>) => {
          const { id } = action.payload;
          const newMappingItem = {
            ...state[id],
            value: state[id]?.value || null,
            isProcessing: true,
            isSuccess: false,
            error: null,
          };

          const mappingsAmount = Object.keys(state).length;

          if (
            mappingsAmountLimit !== undefined &&
            mappingsAmountLimit === mappingsAmount
          ) {
            return {
              [id]: newMappingItem,
            };
          }

          state[id] = newMappingItem;

          return state;
        },
        success: (state, action: PayloadAction<Draft<SuccessPayload>>) => {
          const { id, value } = action.payload;

          state[id] = {
            ...state[id],
            value,
            isProcessing: false,
            isSuccess: true,
            error: null,
          };
        },
        error: (state, action: PayloadAction<Draft<ErrorPayload>>) => {
          const { id, error } = action.payload;

          state[id] = {
            ...state[id],
            value: state[id]?.value || null,
            error,
            isProcessing: false,
            isSuccess: false,
          };
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
