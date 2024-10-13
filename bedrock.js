const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

// Initialize the Bedrock Runtime client
const client = new BedrockRuntimeClient({ region: "us-east-2" });

// Prepare the request body
const requestBody = {
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "tell joke\n",
        },
      ],
    },
  ],
  anthropic_version: "bedrock-2023-05-31",
  max_tokens: 250,
  temperature: 1,
  top_k: 250,
  top_p: 0.999,
  stop_sequences: ["\n\nHuman:"],
};

// Function to invoke the model and return the output
async function invokeModel(prompt) {
  requestBody.messages[0].content[0].text = prompt;
  const command = new InvokeModelCommand({
    modelId:
      "arn:aws:bedrock:us-east-2:588738573992:inference-profile/us.anthropic.claude-3-haiku-20240307-v1:0",
    body: JSON.stringify(requestBody),
  });

  try {
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody;
  } catch (error) {
    console.error("Error invoking model:", error);
    throw error;
  }
}

// Invoke the model and log the result
invokeModel("capital of Poland please")
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch((error) => console.error("Error:", error));
