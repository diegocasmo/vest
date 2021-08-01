import type { TState } from 'vast';

import VestTest from 'VestTest';
import type { TDraftResult } from 'produceDraft';

export default function createStateRef(
  state: TState,
  { suiteId }: { suiteId: string }
) {
  return {
    carryOverTests: state.registerStateKey<VestTest[]>(() => []),
    lagging: state.registerStateKey<VestTest[]>(() => []),
    optionalFields: state.registerStateKey<Record<string, boolean>>(() => ({})),
    pending: state.registerStateKey<VestTest[]>(() => []),
    skippedTests: state.registerStateKey<VestTest[]>(() => []),
    suiteId: state.registerStateKey<string>(() => suiteId),
    testCallbacks: state.registerStateKey<{
      fieldCallbacks: Record<string, Array<(res: TDraftResult) => void>>;
      doneCallbacks: Array<(res: TDraftResult) => void>;
    }>(() => ({
      fieldCallbacks: {},
      doneCallbacks: [],
    })),
    testsOrdered: state.registerStateKey<VestTest[]>(() => []),
    testsOrderedCursor: state.registerStateKey<number>(() => 0),
  };
}

export type TStateRef = ReturnType<typeof createStateRef>;
