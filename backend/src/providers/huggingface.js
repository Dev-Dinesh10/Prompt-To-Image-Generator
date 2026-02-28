import axios from "axios";

/**
 * Auto Model Selector — picks best model based on prompt & mode
 */
function selectBestModel(prompt, mode) {
  const p = prompt.toLowerCase();

  if (mode === "logo") {
    return {
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      reason: "Best for logos & flat vector designs",
    };
  }

  if (mode === "anime") {
    return {
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      reason: "Best for anime & illustration style",
    };
  }

  if (mode === "interior") {
    return {
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      reason: "Best for architecture & interior design",
    };
  }

  if (mode === "product") {
    return {
      model: "black-forest-labs/FLUX.1-schnell",
      reason: "Best for product photography",
    };
  }

  if (mode === "fashion") {
    return {
      model: "black-forest-labs/FLUX.1-schnell",
      reason: "Best for fashion & clothing",
    };
  }

  if (mode === "nature") {
    return {
      model: "black-forest-labs/FLUX.1-schnell",
      reason: "Best for nature & landscapes",
    };
  }

  if (mode === "portrait") {
    return {
      model: "black-forest-labs/FLUX.1-schnell",
      reason: "Best for portraits & people",
    };
  }

  if (mode === "fantasy") {
    return {
      model: "black-forest-labs/FLUX.1-schnell",
      reason: "Best for fantasy & sci-fi scenes",
    };
  }

  if (mode === "food") {
    return {
      model: "black-forest-labs/FLUX.1-schnell",
      reason: "Best for food photography",
    };
  }

  if (mode === "3d") {
    return {
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      reason: "Best for 3D renders & game assets",
    };
  }

  // Auto-detect from prompt keywords
  if (p.includes("anime") || p.includes("manga") || p.includes("cartoon")) {
    return { model: "stabilityai/stable-diffusion-xl-base-1.0", reason: "Anime & cartoon style" };
  }
  if (p.includes("interior") || p.includes("architecture") || p.includes("building")) {
    return { model: "stabilityai/stable-diffusion-xl-base-1.0", reason: "Architecture & interiors" };
  }

  // Default
  return {
    model: "black-forest-labs/FLUX.1-schnell",
    reason: "General purpose — fast & high quality",
  };
}

/**
 * Mode-specific prompt enhancers
 */
function enhancePrompt(prompt, mode) {
  const enhancers = {
    logo: ", minimalist vector logo, clean lines, flat design, modern branding, white background",
    anime: ", anime style, vibrant colors, detailed illustration, manga art, studio quality",
    interior: ", interior design, professional photography, elegant lighting, architectural visualization",
    product: ", product photography, studio lighting, clean background, commercial quality, sharp focus",
    fashion: ", fashion photography, editorial style, professional model, studio lighting, vogue magazine",
    nature: ", nature photography, golden hour, ultra detailed, 4K, cinematic, professional landscape",
    portrait: ", professional portrait, studio lighting, sharp focus, 4K, photorealistic, DSLR quality",
    fantasy: ", fantasy art, epic scale, magical atmosphere, ultra detailed, concept art, cinematic",
    food: ", food photography, professional lighting, bokeh background, appetizing, commercial quality",
    "3d": ", 3D render, octane render, high detail, game asset, studio lighting, CGI quality",
    image: "",
  };
  return prompt + (enhancers[mode] || "");
}

/**
 * ─── TEXT TO IMAGE ─────────────────────────────────────────────────
 */
export async function generateWithHuggingFace(prompt, negativePrompt, mode) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error("HUGGINGFACE_API_KEY is missing.");

  const fullPrompt = enhancePrompt(prompt, mode);
  const { model, reason } = selectBestModel(prompt, mode);

  console.log(`[HuggingFace] Mode: ${mode} | Model: ${model}`);
  console.log(`[HuggingFace] Reason: ${reason}`);
  console.log(`[HuggingFace] Prompt: "${fullPrompt}"`);

  try {
    const response = await axios.post(
      `https://router.huggingface.co/hf-inference/models/${model}`,
      {
        inputs: fullPrompt,
        parameters: {
          negative_prompt: negativePrompt || "blurry, low quality, distorted, ugly",
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
    console.log(`[HuggingFace] ✓ Image generated with ${model}`);

    return {
      success: true,
      provider: "huggingface",
      model,
      modelReason: reason,
      mode,
      image: `data:image/jpeg;base64,${base64Image}`,
    };
  } catch (error) {
    throw new Error(handleHFError(error));
  }
}

/**
 * ─── IMAGE TO IMAGE ────────────────────────────────────────────────
 */
export async function imageToImageHuggingFace(prompt, inputImageBase64, strength = 0.75) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error("HUGGINGFACE_API_KEY is missing.");

  const model = "stabilityai/stable-diffusion-xl-refiner-1.0";

  console.log(`[HuggingFace] Image-to-Image | Model: ${model}`);
  console.log(`[HuggingFace] Prompt: "${prompt}" | Strength: ${strength}`);

  // Strip base64 header if present
  const base64Data = inputImageBase64.replace(/^data:image\/\w+;base64,/, "");

  try {
    const response = await axios.post(
      `https://router.huggingface.co/hf-inference/models/${model}`,
      {
        inputs: base64Data,
        parameters: {
          prompt,
          strength,
          num_inference_steps: 30,
          guidance_scale: 7.5,
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
    console.log(`[HuggingFace] ✓ Image-to-Image completed`);

    return {
      success: true,
      provider: "huggingface",
      model,
      mode: "img2img",
      image: `data:image/jpeg;base64,${base64Image}`,
    };
  } catch (error) {
    throw new Error(handleHFError(error));
  }
}

/**
 * ─── BACKGROUND REMOVAL ───────────────────────────────────────────
 */
export async function removeBackgroundHuggingFace(inputImageBase64) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error("HUGGINGFACE_API_KEY is missing.");

  const model = "briaai/RMBG-1.4";

  console.log(`[HuggingFace] Background Removal | Model: ${model}`);

  const base64Data = inputImageBase64.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");

  try {
    const response = await axios.post(
      `https://router.huggingface.co/hf-inference/models/${model}`,
      imageBuffer,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "image/jpeg",
          Accept: "image/png",
        },
        responseType: "arraybuffer",
        timeout: 120000,
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    console.log(`[HuggingFace] ✓ Background removed successfully`);

    return {
      success: true,
      provider: "huggingface",
      model,
      mode: "background-remove",
      image: `data:image/png;base64,${base64Image}`,
    };
  } catch (error) {
    throw new Error(handleHFError(error));
  }
}

/**
 * ─── IMAGE UPSCALING ──────────────────────────────────────────────
 */
export async function upscaleImageHuggingFace(inputImageBase64) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error("HUGGINGFACE_API_KEY is missing.");

  const model = "caidas/swin2SR-realworld-sr-x4-64-bsrgan-psnr";

  console.log(`[HuggingFace] Image Upscaling | Model: ${model}`);

  const base64Data = inputImageBase64.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");

  try {
    const response = await axios.post(
      `https://router.huggingface.co/hf-inference/models/${model}`,
      imageBuffer,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "image/jpeg",
          Accept: "image/jpeg",
        },
        responseType: "arraybuffer",
        timeout: 120000,
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    console.log(`[HuggingFace] ✓ Image upscaled successfully`);

    return {
      success: true,
      provider: "huggingface",
      model,
      mode: "upscale",
      image: `data:image/jpeg;base64,${base64Image}`,
    };
  } catch (error) {
    throw new Error(handleHFError(error));
  }
}

/**
 * ─── ERROR HANDLER ────────────────────────────────────────────────
 */
function handleHFError(error) {
  if (error.response) {
    const status = error.response.status;
    let responseText = "";

    if (error.response.data instanceof Buffer) {
      responseText = error.response.data.toString("utf-8");
    }

    try {
      const jsonError = JSON.parse(responseText);
      if (status === 503) {
        return `Model is loading. Retry in ${
          jsonError.estimated_time ? Math.ceil(jsonError.estimated_time) + "s" : "20-30 seconds"
        }`;
      }
      if (status === 429) return "Rate limit reached. Please wait and try again.";
      if (status === 402) return "Free credits exhausted. Switch to PROVIDER=clipdrop in .env";
      if (status === 401 || status === 403) return "Invalid or insufficient HuggingFace API key permissions.";
      if (status === 410) return "This model is deprecated.";
      return `HuggingFace Error: ${jsonError.error || jsonError.message || responseText}`;
    } catch (e) {
      return `HuggingFace HTTP ${status}: ${responseText || error.message}`;
    }
  }

  if (error.code === "ECONNABORTED") return "Request timed out. Please try again.";
  return `HuggingFace Error: ${error.message}`;
}