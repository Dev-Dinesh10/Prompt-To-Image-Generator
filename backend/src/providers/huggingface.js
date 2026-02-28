import axios from "axios";

/**
 * HuggingFace Inference API Provider (FREE)
 * Model: FLUX.1-schnell — fast, high quality, free tier
 */

export async function generateWithHuggingFace(prompt, negativePrompt, mode) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "HUGGINGFACE_API_KEY is missing. Get your free key from: https://huggingface.co/settings/tokens"
    );
  }

  // Enhance prompt based on mode
  let fullPrompt = prompt;
  if (mode === "logo") {
    fullPrompt +=
      ", minimalist vector logo, clean lines, flat design, modern branding, simple professional logo, white background";
  }

  const model = "black-forest-labs/FLUX.1-schnell";

  console.log(`[HuggingFace] Generating ${mode} using model: ${model}`);
  console.log(`[HuggingFace] Prompt: "${fullPrompt}"`);

  try {
    const response = await axios.post(
      `https://router.huggingface.co/hf-inference/models/${model}`,  // ✅ NEW URL
      {
        inputs: fullPrompt,
        parameters: {
          negative_prompt: negativePrompt || "",
          num_inference_steps: 4,
          guidance_scale: 0,
          width: 1024,
          height: 1024,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
           "Accept": "image/jpeg", 

        },
        responseType: "arraybuffer",
        timeout: 120000,
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    console.log("[HuggingFace] ✓ Image generated successfully");

    return {
      success: true,
      provider: "huggingface",
      model: model,
      image: `data:image/jpeg;base64,${base64Image}`,
    };

  } catch (error) {
    let errorMessage = "Failed to generate image with HuggingFace";

    if (error.response) {
      const status = error.response.status;

      let responseText = "";
      if (error.response.data instanceof Buffer) {
        responseText = error.response.data.toString("utf-8");
      }

      try {
        const jsonError = JSON.parse(responseText);

        if (status === 503) {
          errorMessage = `Model is loading, please wait and try again. Estimated time: ${
            jsonError.estimated_time
              ? Math.ceil(jsonError.estimated_time) + "s"
              : "~20-30 seconds"
          }`;
        } else if (status === 429) {
          errorMessage = "Rate limit reached. Please wait a moment and try again.";
        } else if (status === 401) {
          errorMessage = "Invalid HuggingFace API key. Check your HUGGINGFACE_API_KEY in .env";
        } else {
          errorMessage += `: ${jsonError.error || jsonError.message || responseText}`;
        }
      } catch (e) {
        errorMessage += `: HTTP ${status} - ${responseText || error.message}`;
      }

      console.error(`[HuggingFace ERROR] Status: ${status}`, responseText);
    } else if (error.code === "ECONNABORTED") {
      errorMessage = "Request timed out. The model might be cold-starting. Please try again.";
    } else {
      errorMessage += `: ${error.message}`;
      console.error("[HuggingFace ERROR]:", error.message);
    }

    throw new Error(errorMessage);
  }
}