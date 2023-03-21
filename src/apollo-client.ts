import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const uri = `${process.env.NEXT_PUBLIC_BACKEND_URI}/api`;
const httpLink = createHttpLink({
  uri,
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
