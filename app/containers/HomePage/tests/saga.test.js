/**
 * Tests for HomePage sagas
 */

import { put, takeLatest } from 'redux-saga/effects';

import { LOAD_STR } from 'containers/App/constants';
import { stringsLoaded, stringLoadingError } from 'containers/App/actions';
import stringListData, { getRepos } from '../../App/saga';

const username = 'mxstbr';

/* eslint-disable redux-saga/yield-effects */
describe('getRepos Saga', () => {
  let getReposGenerator;

  // We have to test twice, once for a successful load and once for an unsuccessful one
  // so we do all the stuff that happens beforehand automatically in the beforeEach
  beforeEach(() => {
    getReposGenerator = getRepos();

    const selectDescriptor = getReposGenerator.next().value;
    expect(selectDescriptor).toMatchSnapshot();

  });

  it('should dispatch the stringsLoaded action if it requests the data successfully', () => {
    const response = [
      {
        name: 'First repo',
      },
      {
        name: 'Second repo',
      },
    ];
    const putDescriptor = getReposGenerator.next(response).value;
    expect(putDescriptor).toEqual(put(stringsLoaded(response)));
  });

  it('should call the stringLoadingError action if the response errors', () => {
    const response = new Error('Some error');
    const putDescriptor = getReposGenerator.throw(response).value;
    expect(putDescriptor).toEqual(put(stringLoadingError(response)));
  });
});

describe('stringListDataSaga Saga', () => {
  const stringListDataSaga = stringListData();

  it('should start task to watch for LOAD_REPOS action', () => {
    const takeLatestDescriptor = stringListDataSaga.next().value;
    expect(takeLatestDescriptor).toEqual(takeLatest(LOAD_STR, getRepos));
  });
});
