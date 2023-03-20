import { gql } from "@apollo/client";

export const createSessionDocument = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      id
      token
    }
  }
`;

export default createSessionDocument;
