import { gql } from "@apollo/client";

export const updateNotesQueryDocument = gql`
  mutation UpdateNotesQuery($id: String!, $input: UpdateNotesQueryInput!) {
    updateNotesQuery(id: $id, input: $input) {
      id
      createdAt
      updatedAt
      authorId
      query
      response
      status
    }
  }
`;

export default updateNotesQueryDocument;
