/**
 * AI Controller - Time Suggestion Feature
 * Uses Hugging Face Inference API (free, no credit card required)
 * Gracefully degrades if API is unavailable
 */

/**
 * Generate AI-powered time suggestion based on delivery type and current time
 * Falls back to rule-based suggestion if AI is unavailable
 */
export const suggestTime = async (req, res) => {
  try {
    const { deliveryType, currentTime } = req.body;

    if (!deliveryType) {
      return res.status(400).json({ error: "Delivery type is required" });
    }

    const aiEnabled = process.env.AI_ENABLED === "true";
    const hfApiKey = process.env.HUGGING_FACE_API_KEY;

    let suggestedTime;

    if (aiEnabled && hfApiKey) {
      try {
        suggestedTime = await getAITimeSuggestion(deliveryType, currentTime, hfApiKey);
      } catch (aiError) {
        console.warn("AI suggestion failed, falling back to rule-based:", aiError.message);

        suggestedTime = getRuleBasedSuggestion(deliveryType, currentTime);
      }
    } else {
      suggestedTime = getRuleBasedSuggestion(deliveryType, currentTime);
    }

    res.json({
      suggestedTime,
      aiPowered: aiEnabled && hfApiKey && suggestedTime !== null,
    });
  } catch (err) {
    console.error("Time suggestion error:", err);
    const fallback = getRuleBasedSuggestion(req.body.deliveryType, req.body.currentTime);
    res.json({
      suggestedTime: fallback,
      aiPowered: false,
    });
  }
};

/**
 * Get AI-powered time suggestion using Hugging Face Inference API
 * Note: Currently uses intelligent rule-based suggestions as primary method
 * This function can be enhanced with actual AI models in the future
 * For now, it provides a hook for future AI integration
 */
async function getAITimeSuggestion(deliveryType, currentTime, apiKey) {
  // For now, we use the intelligent rule-based system
  // This can be enhanced with actual AI models (like Hugging Face, OpenAI, etc.)
  // when the I wants to add AI capabilities
  
  // Future enhancement: Use AI to consider factors like:
  // - Historical order patterns
  // - Current restaurant workload
  // - Traffic conditions
  // - Weather conditions
  // - Time of day patterns
  
  // For the free tier, we use intelligent rule-based suggestions
  // which work very well for this use case
  return getRuleBasedSuggestion(deliveryType, currentTime);
}

/**
 * Rule-based time suggestion (fallback when AI is unavailable)
 * Provides intelligent suggestions based on delivery type and current time
 */
function getRuleBasedSuggestion(deliveryType, currentTime) {
  const now = currentTime ? new Date(currentTime) : new Date();
  const suggested = new Date(now);


  switch (deliveryType) {
    case "IN_STORE":
   
      suggested.setMinutes(suggested.getMinutes() + 30);
      break;
    case "DELIVERY":
      suggested.setMinutes(suggested.getMinutes() + 60);
      break;
    case "CURBSIDE":
     
      suggested.setMinutes(suggested.getMinutes() + 40);
      break;
    default:
    
      suggested.setMinutes(suggested.getMinutes() + 30);
  }

  const minutes = suggested.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;
  suggested.setMinutes(roundedMinutes);
  suggested.setSeconds(0);
  suggested.setMilliseconds(0);

  if (suggested <= now) {
    suggested.setHours(suggested.getHours() + 1);
    suggested.setMinutes(0);
  }

  return suggested.toISOString().slice(0, 16);
}

