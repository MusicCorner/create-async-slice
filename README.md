# Create async slice

## Helper for creating async slices with redux toolkit to avoid boilerplates

### Usage

_src/ducks/users/users.slices.ts_

```javascript
import { combineReducers } from 'redux';
import { createAsyncSlice } from 'create-async-slice';

export const getUsersSlice = createAsyncSlice<RequestPayload, SuccessPayload, ErrorPayload>({
  name: 'getUsers',
});

/* RequestPayloadWithId, SuccessPayloadWithId, ErrorPayloadWithId:
these are optional since we always should pass an id of parent list by default
*/
export const getUserCompaniesSlice = createAsyncListSlice<RequestPayloadWithId, SuccessPayloadWithId, ErrorPayloadWithId>({ name: 'getCompaiesByUserId' })

export const usersReducer = combineReducers({
  getUsers: getUsersSlice.reducer,
  getUserCompanies: getUserCompaniesSlice.reducer
});
```

_src/store/reducers.ts_

```javascript
import { usersReducer } from '@ducks/users/users.slices';

export const reducers = {
  users: usersReducer,
};
```

_src/ducks/users/users.selectors.ts_

```javascript
import { isProcessing, isListItemProcessing } from 'create-async-slice';

export const selectGetUsers = (state: RootState) => state.users.getUsers;

export const selectGetUsersData = (state: RootState) =>
  selectGetUsers(state).value || [];

export const selectIsGetUsersProcessing = (state: RootState) =>
  isProcessing(selectGetUsers(state));

export const selectGetUserCompaniesById = (state: RootState, { id }) =>
  state.users.getUserCompanies[id];

export const selectIsGetUserCompanyProcessing = (state: RootState, { id }) =>
  isListItemProcessing(selectGetUserCompaniesById(state), { id });

export const selectGetUserCompaniesByIdData = (state: RootState, { id }) =>
  selectGetUserCompaniesById(state, { id }).value || [];
```

_src/components/Users.ts_

```javascript
import React, { useSelector, useDispatch, useEffect } from 'react';

import { getUsersSlice } from '@ducks/users/users.slice';
import { selectIsGetUsersProcessing, selectGetUsersData } from '@ducks/users/users.selectors';

export const Users = () => {
  const dispatch = useDispatch();

  const isProcessing = useSelector(selectIsGetUsersProcessing);

  const usersData = useSelector(selectGetUsersData)

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

_src/components/User.ts_

```javascript
import React, { useSelector, useDispatch, useEffect } from 'react';

import { getUserCompaniesSlice } from '@ducks/users/users.slice';
import { selectIsGetUserCompanyProcessing, selectGetUserCompaniesByIdData } from '@ducks/users/users.selectors';

export const User = ({ id, name }) => {
  const dispatch = useDispatch();

  const isProcessing = useSelector(state => selectIsGetUserCompanyProcessing(state, { id }));

  const companiesData = useSelector(state => selectGetUserCompaniesByIdData(state, { id }));

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
