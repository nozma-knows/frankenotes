interface DeleteVectorStoreType {
  authorId: string;
  docId: string;
  doc: string;
}

export async function deleteVectorStore({
  authorId,
  docId,
  doc,
}: DeleteVectorStoreType) {
  try {
    if (doc) {
      const response = await fetch(`../api/delete-from-vectore-store`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          docId,
          doc,
          authorId,
        }),
      });
    }
  } catch (error) {
    console.error("Error submitting prompt: ", error);
  }
}
