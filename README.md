# `urql-exchange-schema`

Fetch data from a local GraphQL schema with [urql](https://github.com/FormidableLabs/urql). Useful for testing apps using urql.

```
npm install urql-exchange-schema
```

## Usage

```JS
import { createClient } from 'urql';
import { schemaExchange } from 'urql-exchange-schema';

const client = createClient({
  url: '', // note that this will not be used, but is required by createClient so just pass anything into here
  exchanges: [schemaExchange(schema)]
});
```

This is useful for testing your apps using urql. Instead of mocking `window.fetch`, you can mock your entire GraphQL schema and get sensible responses for any query with `graphql-tools`!

```JS
import { Provider, createClient } from 'urql';
import { schemaExchange } from 'urql-exchange-schema';
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";

// Create your schema and add mock functions to it
const schema = makeExecutableSchema({ typeDefs: yourTypeDefs });
addMockFunctionsToSchema({
  schema,
  mocks: yourMockFunctions,
});

// Pass the mock schema to the schemaExchange
const client = createClient({
  url: '',
  exchanges: [schemaExchange(schema)]
});

// Now you can test all your components that fetch data!
it('should fetch some data', () => {
  const bla = render(
    <Provider client={client}>
      <SomeComponentThatFetchesData />
    </Provider>
  )
})
```

## Contributing

This package uses [tsdx](https://github.com/palmerhq/tsdx) for development. Below is a list of commands you will probably find useful.

- `npm run dev`: Runs the project in development/watch mode.
- `npm run build`: Bundles the package to the `dist` folder.
- `npm run test`: Runs tests.
