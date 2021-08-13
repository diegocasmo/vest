import createState from 'vast';

import asArray from 'asArray';
import createStateRef from 'createStateRef';
import context from 'ctx';
import genId from 'genId';
import isFunction from 'isFunction';
import produce from 'produce';
import { usePending, useTestObjects, useCarryOverTests } from 'stateHooks';
import throwError from 'throwError';
import withArgs from 'withArgs';
/**
 * Initializes a validation suite, creates a validation context.
 * @param {String} [name]     Identifier for validation suite.
 * @param {Function} tests  Validation suite body.
 * @returns {Function} validator function.
 */
const createSuite = withArgs(args => {
  const [tests, name] = args.reverse();

  if (!isFunction(tests)) {
    throwError(
      'Suite initialization error. Expected `tests` to be a function.'
    );
  }

  const handlers = [];

  const state = createState(() => {
    handlers.forEach(fn =>
      fn({
        suiteState: stateRef,
        type: 'suiteStateUpdate',
      })
    );
  });

  const stateRef = createStateRef(state, { suiteId: genId(), name });

  /*
    context.bind returns our `validate` function
    We then wrap it with defineProperties to add
    the `get`, and `reset` functions.

  */
  const suite = context.bind({ stateRef }, function () {
    const [previousTestObjects] = useTestObjects();
    const [, setCarryOverTests] = useCarryOverTests();
    const [{ pending }, setPending] = usePending();
    state.reset();
    setCarryOverTests(() => previousTestObjects);

    // Move all the active pending tests to the lagging array
    setPending({ lagging: pending, pending: [] });

    // Run the consumer's callback
    tests.apply(null, arguments);

    return produce();
  });
  suite.get = context.bind({ stateRef }, produce, /*isDraft:*/ true);
  suite.reset = state.reset;
  suite.remove = context.bind({ stateRef }, name => {
    const [testObjects] = useTestObjects();

    // We're mutating the array in `cancel`, so we have to first copy it.
    asArray(testObjects).forEach(testObject => {
      if (testObject.fieldName === name) {
        testObject.cancel();
      }
    });
  });

  suite.subscribe = function (handler) {
    if (!isFunction(handler)) return;

    handlers.push(handler);

    handler({
      type: 'suiteSubscribeInit',
      suiteState: stateRef,
    });
  };

  suite.hasErrors = (fieldName) => suite.get().hasErrors(fieldName);

  suite.hasWarnings = (fieldName) => suite.get().hasWarnings(fieldName);

  suite.getErrors = (fieldName) => suite.get().getErrors(fieldName);

  suite.getWarnings = (fieldName) => suite.get().getWarnings(fieldName);

  suite.hasErrorsByGroup = (groupName, fieldName) => suite.get().hasErrorsByGroup(groupName, fieldName);

  suite.hasWarningsByGroup = (groupName, fieldName) => suite.get().hasWarningsByGroup(groupName, fieldName);

  suite.getErrorsByGroup = (groupName, fieldName) => suite.get().getErrorsByGroup(groupName, fieldName);

  suite.getWarningsByGroup = (groupName, fieldName) => suite.get().getWarningsByGroup(groupName, fieldName);

  return suite;
});

export default createSuite;
