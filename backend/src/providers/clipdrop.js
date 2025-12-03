import axios from "axios";
import FormData from "form-data";

/**
 * Clipdrop API Provider – WORKING VERSION (Based on working implementation)
 */

async function generateWithClipdrop(prompt, negativePrompt, mode) {
  const apiKey = process.env.CLIPDROP_API_KEY;

  if (!apiKey) {
    throw new Error(
      "CLIPDROP_API_KEY is missing. Get your FREE key from https://clipdrop.co/apis/pricing"
    );
  }

  // Build prompt based on mode
  let fullPrompt = prompt;
  if (mode === "logo") {
    fullPrompt += ", minimalist vector logo, clean lines, flat design, modern branding, simple professional logo";
  }

  // Add negative prompt to main prompt if provided
  if (negativePrompt && mode === "logo") {
    fullPrompt += `. Avoid: ${negativePrompt}, photorealistic, complex background, cluttered`;
  }

  try {
    console.log(`[Clipdrop] Generating ${mode} with prompt: "${fullPrompt}"`);

    // ✅ CORRECT URL from working example
    const url = "https://clipdrop-api.co/text-to-image/v1";

    // Prepare form data
    const formData = new FormData();
    formData.append("prompt", fullPrompt);

    // Make API request
    const response = await axios.post(url, formData, {
      headers: {
        "x-api-key": apiKey,
        ...formData.getHeaders(),
      },
      responseType: "arraybuffer",
      timeout: 60000, // 60 seconds
    });

    // Validate response
    if (!response.data || response.status !== 200) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Convert to base64
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    console.log(`[Clipdrop] ✓ Image generated successfully`);

    return {
      success: true,
      provider: "clipdrop",
      model: "clipdrop/text-to-image-v1",
      image: resultImage,
    };

  } catch (error) {
    // Enhanced error handling from working example
    let errorMessage = "Failed to generate image with Clipdrop";
    let errorDetails = {};

    if (error.response) {
      errorDetails.status = error.response.status;
      errorDetails.statusText = error.response.statusText;

      // Convert arraybuffer to readable format
      if (error.response.data instanceof Buffer) {
        errorDetails.data = error.response.data.toString("utf-8");
      } else {
        errorDetails.data = error.response.data;
      }

      // Extract meaningful message from API response
      try {
        const jsonResponse = JSON.parse(errorDetails.data);
        errorMessage += `: ${jsonResponse.error || jsonResponse.message}`;
      } catch (e) {
        errorMessage += `: ${errorDetails.statusText}`;
      }

      console.error("[Clipdrop ERROR Details]:", errorDetails);
    } else {
      errorMessage += `: ${error.message}`;
      console.error("[Clipdrop ERROR]:", error.message);
    }

    throw new Error(errorMessage);
  }
}

export { generateWithClipdrop };