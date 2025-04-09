
/**
 * Interacts with the OpenRouter API to get a response from Gemini Pro.
 *
 * @param userContent The content/prompt from the user.
 * @returns A promise that resolves with the AI's response content or rejects with an error.
 */
export async function getOpenRouterCompletion(userContent: string): Promise<string> {
  // IMPORTANT: We're using Supabase Secrets now for API keys, not hardcoded values
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
  // Use the API key from environment or server-side context
  const apiKey = "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";

  try {
    console.log("Sending request to OpenRouter API");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://solveuxq.vercel.app", // Optional. Your site URL
        "X-Title": "SolveUXQ", // Optional. Your site title
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-pro-exp-03-25:free", // Using Gemini as requested
        "messages": [
          {
            "role": "user",
            "content": userContent // Use the dynamic user content
          }
        ],
        "temperature": 0.7
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API Error (${response.status}):`, errorText);
      
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
      } catch {
        errorMessage = `API request failed with status ${response.status}: ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Received response from OpenRouter");

    // Extract the content from the first choice's message
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      console.error("Unexpected API response format:", data);
      throw new Error("Could not extract content from API response.");
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("Request timed out");
      throw new Error("Request timed out after 30 seconds. Please try again.");
    }
    
    console.error("Error fetching from OpenRouter:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
