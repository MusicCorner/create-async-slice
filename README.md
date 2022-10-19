# Create async slice

## Helper for creating async slices with redux toolkit to avoid boilerplates

### API

#### createAsyncSlice
Returns redux-toolit slice object with 4 actions:  
1. `request` - to dispatch request with payload for fetching data and set isProcessing: `true`
2. `success` - to fulfill your store with success data from API
3. `error` - to fulfill data with error from API response
4. `reset` - to reset store's state

#### createAsyncMappingSlice
_Stands for creating relations between async states or for making complicated async lists slices. Example: you're users are toggleable sections and when you toggle each section - you need to load company info for that certain user. So there's multiple loading companies for each opened user at the same time_

Returns redux-toolit slice object with 4 actions:  
1. `request` - to dispatch request with payload for fetching data and set isProcessing: `true`
Expects `{ id }` as default. `id` is id of item in list which needs to get additional data e.g. company user id.
1. `success` - to fulfill your store with success data from API. Expects `{ id, value }` as default. `value` is your data you want put into your redux store
2. `error` - to fulfill data with error from API response. Expects `{ id, error }` as default.
3. `reset` - to reset store's state. Expects `{ id }` as default.

#### How does async slice's state look like?
```javascript
// state.users
// createAsyncSlice:
{
  getUsers: {
    value: [{ name: 'Test user', id: 'user-id-1' }],
    isSuccess: true,
    isProcessing: false,
    error: null
  }
}

// createAsyncMappingSlice:
{
  getUserCompanies: {
    ['user-id-1']: {
      value: [{ name: 'Test Company', id: 'company-id-1' }],
      isSuccess: true,
      isProcessing: false,
      error: null
    }
  }
}
```
### Usage

#### src/ducks/users/users.slices.ts

```javascript
import { combineReducers } from 'redux';
import { createAsyncSlice } from 'create-async-slice';

export const getUsersSlice = createAsyncSlice<RequestPayload, SuccessPayload, ErrorPayload>({
  name: 'getUsers',
  selectorsStatePath: 'users'
});

/* RequestPayloadWithId, SuccessPayloadWithId, ErrorPayloadWithId:
these are optional since we always should pass an id of parent list by default
*/
export const getUserCompaniesSlice = createAsyncMappingSlice<RequestPayloadWithId, SuccessPayloadWithId, ErrorPayloadWithId>({ name: 'getCompaiesByUserId', selectorsStatePath: 'users' })

export const usersReducer = combineReducers({
  getUsers: getUsersSlice.reducer,
  getUserCompanies: getUserCompaniesSlice.reducer
});
```

#### src/ducks/users/users.sagas.ts

```javascript

function* getUserCompaniesSaga({ payload }) {
  // id - companyId
  const { id } = payload;

  try {
    const { data } = yield call(usersApi.getUserCompanies, id);

    yield put(getUserCompaniesSlice.actions.success(data));
  } catch (e) {
    yield put(getUserCompaniesSlice.actions.error(e.message));
  }
}

function* getUsersSaga() {
  try {
    const { data } = yield call(usersApi.getUsers);

    yield put(getUsersSlice.actions.success(data));
  } catch (e) {
    yield put(getUsersSlice.actions.error(e.message));
  }
}

export function* usersSagas() {
  yield takeAll(getUsersSlice.actions.request, getUsersSaga);

  yield takeAll(getUserCompaniesSlice.actions.request, getUserCompaniesSaga);
}
```

#### src/store/reducers.ts

```javascript
import { usersReducer } from '@ducks/users/users.slices';

export const reducers = {
  users: usersReducer,
};
```

#### src/components/Users.ts

```javascript
import React, { useSelector, useDispatch, useEffect } from 'react';

import { getUsersSlice } from '@ducks/users/users.slice';
import { selectIsGetUsersProcessing, selectGetUsersData } from '@ducks/users/users.selectors';

export const Users = () => {
  const dispatch = useDispatch();

  const isProcessing = useSelector(getUsersSlice.selectors?.isProcessing);

  const usersData = useSelector(getUsersSlice.selectors?.value)

  useEffect(() => {
    dispatch(getUsersSlice.actions.request());
  }, []);

  return (
    <div>
      {usersData.map(user => (
        <User {...user}>
      ))}
    </div>
  )
}
```

#### src/components/User.ts

```javascript
import React, { useSelector, useDispatch, useEffect } from 'react';

import { getUserCompaniesSlice } from '@ducks/users/users.slice';
import { selectIsGetUserCompanyProcessing, selectGetUserCompaniesByIdData } from '@ducks/users/users.selectors';

export const User = ({ id, name }) => {
  const dispatch = useDispatch();

  const isProcessing = useSelector(state => getUserCompaniesSlice.selectors?.isProcessing(state, { id }));

  const companiesData = useSelector(state => getUserCompaniesSlice.selectors?.value(state, { id }));

  useEffect(() => {
    dispatch(getUserCompaniesSlice.actions.request({ id }));
  }, [id]);

  return (
    <div>
      {companiesData.map(company => (
        <Company {...company}>
      ))}
    </div>
  )
}
```

### API
#### Async Slice Options:
`createAsyncSlice` accepts all `createSlice` options and following:

| Option key | Description | Default Value |
| ------------- | ------------- | ------------- |
| `selectorsStatePath`  | `string`, `optional`. Redux state key for selector. E.g: `selectorsStatePath`: `'users'` will make all selectors in this slice be `state => state.users[asyncSliceName]`  | `undefined` |

___
`createAsyncMappingsSlice` accepts all `createAsyncSlice` options and following:
| Option key | Description | Default Value |
| ------------- | ------------- | ------------- |
| `mappingsAmountLimit`  | `number`, `optional`. Limits max amount of items stored in slices state (to avoid memory leak)  | `undefined`  |