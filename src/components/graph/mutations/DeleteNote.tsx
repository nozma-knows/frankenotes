import { gql } from "@apollo/client";

const deleteNoteDocument = gql`
  mutation DeleteNote($id: String!) {
    deleteNote(id: $id) {
      id
      content
    }
  }
`;

export default deleteNoteDocument;
