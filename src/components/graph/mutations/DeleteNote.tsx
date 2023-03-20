import { gql } from "@apollo/client";

const deleteNoteDocument = gql`
  mutation DeleteNote($id: String!) {
    deleteNote(id: $id) {
      id
    }
  }
`;

export default deleteNoteDocument;
