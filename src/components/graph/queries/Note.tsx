import { gql } from "@apollo/client";

const noteDocument = gql`
  query Note($id: String!) {
    note(id: $id) {
      id
      authorId
      createdAt
      updatedAt
      title
      content
    }
  }
`;

export default noteDocument;
