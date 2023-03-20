import { gql } from "@apollo/client";

export const createLoginDocument = gql`
  mutation CreateLogin($input: CreateLoginInput!) {
    createLogin(input: $input) {
      id
    }
  }
`;

export default createLoginDocument;
