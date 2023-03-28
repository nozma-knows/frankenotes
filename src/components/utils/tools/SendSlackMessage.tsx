export default async function SendSlackMessage(message: string) {
  await fetch(`../api/slack-post`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });
}
