// import { ApolloClient, InMemoryCache } from "@apollo/client";

// const client = new ApolloClient({
//   uri: `${process.env.NEXT_PUBLIC_BACKEND_URI}/api`,
//   cache: new InMemoryCache(),
// });

// export default client;

import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useCookies } from "react-cookie";

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_BACKEND_URI}/api`,
});

const sessionLink = setContext((request, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  link: sessionLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
