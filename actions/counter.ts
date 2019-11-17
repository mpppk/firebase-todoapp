import actionCreatorFactory, { ActionCreator } from 'typescript-fsa';

export interface RequestAmountChangingPayload {
  amount: number;
}

const counterActionCreatorFactory = actionCreatorFactory('COUNTER');

type ClickActionName =
  | 'clickIncrementButton'
  | 'clickDecrementButton'
  | 'clickAsyncIncrementButton';

export type CounterActionCreators = Record<
  ClickActionName,
  ActionCreator<undefined>
> & {
  requestAmountChanging: ActionCreator<RequestAmountChangingPayload>;
};

export const counterActionCreators: CounterActionCreators = {
  clickAsyncIncrementButton: counterActionCreatorFactory<undefined>(
    'CLICK_ASYNC_INCREMENT_BUTTON'
  ),
  clickDecrementButton: counterActionCreatorFactory<undefined>(
    'CLICK_DECREMENT_BUTTON'
  ),
  clickIncrementButton: counterActionCreatorFactory<undefined>(
    'CLICK_INCREMENT_BUTTON'
  ),
  requestAmountChanging: counterActionCreatorFactory<
    RequestAmountChangingPayload
  >('REQUEST_AMOUNT_CHANGING')
};

export interface RequestAmountChangingWithSleepPayload
  extends RequestAmountChangingPayload {
  sleep: number;
}

export const counterAsyncActionCreators = {
  changeAmountWithSleep: counterActionCreatorFactory.async<
    RequestAmountChangingWithSleepPayload,
    RequestAmountChangingPayload,
    any
  >('REQUEST_AMOUNT_CHANGING_WITH_SLEEP')
};
