import { gql } from "@apollo/client";

const deleteSessionDocument = gql`
  mutation logout {
    logout {
      id
      token
    }
  }
`;

export default deleteSessionDocument;
