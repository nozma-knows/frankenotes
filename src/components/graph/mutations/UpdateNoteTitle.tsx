import { gql } from "@apollo/client";

export const updateNoteTitleDocument = gql`
  mutation UpdateNoteTitle($id: String!, $title: String!) {
    updateNoteTitle(id: $id, title: $title) {
      id
      createdAt
      updatedAt
      authorId
      title
      content
    }
  }
`;

export default updateNoteTitleDocument;
