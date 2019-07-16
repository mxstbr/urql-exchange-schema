// An urql exchange that does hit the network, but instead queries a locally defined GraphQL schema for testing
import { execute } from 'graphql/execution/execute';
import { filter, make, mergeMap, pipe, takeUntil } from 'wonka';
import { Exchange, OperationResult, CombinedError } from 'urql';
import { GraphQLSchema } from 'graphql';

export const schemaExchange = (
  schema: GraphQLSchema,
  {
    context,
    rootValue,
  }: {
    rootValue?: any;
    context?: Record<string, any>;
  } = {}
): Exchange => () => {
  return ops$ => {
    const fetchResults$ = pipe(
      ops$,
      mergeMap(operation => {
        const { key } = operation;
        const teardown$ = pipe(
          ops$,
          filter(op => op.operationName === 'teardown' && op.key === key)
        );

        return pipe(
          make<OperationResult>(([next, complete]) => {
            Promise.resolve(
              execute(
                schema,
                operation.query,
                rootValue,
                context,
                operation.variables
              )
            )
              .then(result => {
                if (result !== undefined) {
                  next({
                    operation,
                    data: result.data,
                    error: Array.isArray(result.errors)
                      ? new CombinedError({
                          graphQLErrors: result.errors,
                          response: result,
                        })
                      : undefined,
                  });
                }

                complete();
              })
              .catch(error => {
                next({
                  operation,
                  error: error,
                });
                complete();
              });

            return () => {};
          }),
          takeUntil(teardown$)
        );
      })
    );

    return fetchResults$;
  };
};
