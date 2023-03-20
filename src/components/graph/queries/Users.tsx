import { gql } from "@apollo/client";

const usersDocument = gql`
  query Users {
    users {
      id
      firstName
      lastName
      email
    }
  }
`;

export default usersDocument;
