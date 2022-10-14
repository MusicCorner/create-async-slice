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

export const getUserCompaniesSlice = createAsyncListSlice({ name: 'getCompaiesByUserIdSlice' })

/* RequestPayloadWithId, SuccessPayloadWithId, ErrorPayloadWithId:
these are optional since we always should pass an id of parent list by default
*/

export const usersReducer = combineReducers<RequestPayloadWithId, SuccessPayloadWithId, ErrorPayloadWithId>({
  getUsers: debtsSlice.reducer,
  getUserCompanies: createDebtSlice.reducer,
  payTheDebtOff: payTheDebtOffSlice.reducer,
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

export const selectUsersData = state: RootState => state.users.getUsers.value || []

export const selectIsGetUsersProcessing = isProcessing(state.users.getUsers)

export const selectUserCompanyById = (state, { id }) => state.users.getUserCompanies[id]

export const selectIsGetUserCompanyProcessing = (state, { id }) => isListItemProcessing(selectUserCompanyById(state), { id });
```

_src/components/Users.ts_

```javascript
import React, { useSelector, useDispatch, useEffect } from 'react';

import { getUsersSlice } from '@ducks/users/users.slice';
import { isGetUsersProcessing, selectUsersData } from '@ducks/users/users.selectors';

export const Users = () => {
  const dispatch = useDispatch();

  const isProcessing = useSelector(isGetUsersProcessing);

  const usersData = useSelector(selectUsersData)

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
import { isGetUserCompaniesProcessing } from '@ducks/users/users.selectors';

export const User = ({ id, name }) => {
  const dispatch = useDispatch();

  const isProcessing = useSelector(state => isGetUserCompanniesProcessing(state, { id }));

  const companiesData = useSelector(state => selectUserCompaniesData(state, { id }))

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
