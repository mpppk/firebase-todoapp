import { delay, takeEvery } from 'redux-saga/effects';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import {
  counterActionCreators,
  counterAsyncActionCreators,
  RequestAmountChangingWithSleepPayload
} from '../actions/counter';

export const counterIncrementWorker = bindAsyncAction(
  counterAsyncActionCreators.changeAmountWithSleep
)(function*(payload: RequestAmountChangingWithSleepPayload) {
  yield delay(payload.sleep);
  return { amount: payload.amount };
} as any); // FIXME remove any

export const counterIncrementWorkerWrapper = () =>
  counterIncrementWorker({ amount: 1, sleep: 1000 });

export function* watchIncrementAsync() {
  yield takeEvery(
    counterActionCreators.clickAsyncIncrementButton.type,
    counterIncrementWorkerWrapper
  );
}