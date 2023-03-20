import { gql } from "@apollo/client";

export const updateNoteContentDocument = gql`
  mutation UpdateNoteContent($id: String!, $content: String!) {
    updateNoteContent(id: $id, content: $content) {
      id
      createdAt
      updatedAt
      authorId
      title
      content
    }
  }
`;

export default updateNoteContentDocument;
