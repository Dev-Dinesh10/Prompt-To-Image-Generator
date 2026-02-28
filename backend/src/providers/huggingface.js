import axios from "axios";

/**
 * Auto Model Selector — picks best model based on prompt keywords
 * Only uses verified working models on HuggingFace router
 */
function selectBestModel(prompt, mode) {
  const p = prompt.toLowerCase();

  // Logo mode → SDXL
  if (mode === "logo") {
    return {
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      reason: "Best for logos & flat vector designs",
    };
  }

  // Anime / Cartoon / Illustration
  if (
    p.includes("anime") ||
    p.includes("manga") ||
    p.includes("cartoon") ||
    p.includes("illustration") ||
    p.includes("chibi") ||
    p.includes("2d art")
  ) {
    return {
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      reason: "Best for anime & illustration style",
    };
  }

  // Architecture / Interior / Real Estate
  if (
    p.includes("architecture") ||
    p.includes("interior") ||
    p.includes("building") ||
    p.includes("room") ||
    p.includes("house") ||
    p.includes("exterior") ||
    p.includes("real estate") ||
    p.includes("furniture") ||
    p.includes("office")
  ) {
    return {
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      reason: "Best for architecture & interior design",
    };
  }

  // Everything else → FLUX.1-schnell (fast, free, working ✅)
  return {
    model: "black-forest-labs/FLUX.1-schnell",
    reason: "General purpose — fast & high quality",
  };
}

/**
 * HuggingFace Inference API Provider (FREE)
 * Auto-selects best model based on prompt
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

  // 🤖 Auto-select best model
  const { model, reason } = selectBestModel(prompt, mode);

  console.log(`[HuggingFace] Generating ${mode} using model: ${model}`);
  console.log(`[HuggingFace] Reason: ${reason}`);
  console.log(`[HuggingFace] Prompt: "${fullPrompt}"`);

  try {
    const response = await axios.post(
      `https://router.huggingface.co/hf-inference/models/${model}`,
      {
        inputs: fullPrompt,
        parameters: {
          negative_prompt: negativePrompt || "",
          num_inference_steps: model.includes("schnell") ? 4 : 30,
          guidance_scale: model.includes("schnell") ? 0 : 7.5,
          width: 1024,
          height: 1024,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "image/jpeg",
        },
        responseType: "arraybuffer",
        timeout: 120000,
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    console.log(`[HuggingFace] ✓ Image generated successfully with ${model}`);

    return {
      success: true,
      provider: "huggingface",
      model: model,
      modelReason: reason,
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
          errorMessage = `Model is loading, please retry in ${
            jsonError.estimated_time
              ? Math.ceil(jsonError.estimated_time) + " seconds"
              : "20-30 seconds"
          }`;
        } else if (status === 429) {
          errorMessage = "Rate limit reached. Please wait and try again.";
        } else if (status === 402) {
          errorMessage = "Free credits exhausted. Switch PROVIDER=clipdrop in .env";
        } else if (status === 401 || status === 403) {
          errorMessage = "Invalid or insufficient HuggingFace API key permissions.";
        } else if (status === 410) {
          errorMessage = "This model is deprecated. Falling back to default model.";
        } else {
          errorMessage += `: ${jsonError.error || jsonError.message || responseText}`;
        }
      } catch (e) {
        errorMessage += `: HTTP ${status} - ${responseText || error.message}`;
      }

      console.error(`[HuggingFace ERROR] Status: ${status}`, responseText);
    } else if (error.code === "ECONNABORTED") {
      errorMessage = "Request timed out. Model is cold-starting. Please try again.";
    } else {
      errorMessage += `: ${error.message}`;
    }

    throw new Error(errorMessage);
  }
}