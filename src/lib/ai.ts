/**
 * Interacts with the OpenRouter API to get a response from the DeepSeek R1 model.
 *
 * @param userContent The content/prompt from the user.
 * @returns A promise that resolves with the AI's response content or rejects with an error.
 */
export async function getOpenRouterCompletion(userContent: string): Promise<string> {
  // IMPORTANT: Hardcoding API keys is insecure. Use environment variables in production.
  const apiKey = "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";
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://solveuxq.vercel.app", // Optional. Your site URL
        "X-Title": "SolveUXQ", // Optional. Your site title
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1:free", // Specify the desired model
        "messages": [
          {
            "role": "user",
            "content": userContent // Use the dynamic user content
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API Error:", errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Extract the content from the first choice's message
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      console.error("Unexpected API response format:", data);
      throw new Error("Could not extract content from API response.");
    }

  } catch (error) {
    console.error("Error fetching from OpenRouter:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
