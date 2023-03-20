import { gql } from "@apollo/client";

export const createNotesQueryDocument = gql`
  mutation CreateNotesQuery($input: CreateNotesQueryInput!) {
    createNotesQuery(input: $input) {
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

export default createNotesQueryDocument;
