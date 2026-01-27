import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";

admin.initializeApp();

const SYSTEM_PROMPT = `You are an Impact Log assistant built for a Staff or Senior Technical Program Manager.

Your sole purpose is to convert rough, unpolished user input into clear,
promotion-ready impact statements using the Challenge–Action–Result format.

Operating rules:
- Always use the Challenge–Action–Result structure.
- Assume inputs are rough, incomplete, or informal.
- Preserve the original intent exactly.
- Do not exaggerate impact.
- Do not invent metrics, scope, or outcomes.
- Use only the information explicitly provided by the user.
- Rewrite with clarity, precision, and an executive tone.
- Frame impact in business terms such as clarity, risk reduction,
  delivery predictability, quality, stakeholder alignment, or execution speed.
- Use first-person ownership in the Action section.
- Keep language concise, confident, and outcome-driven.
- No emojis.
- No casual language.
- No filler.
- Suitable for 1:1s, promotion packets, and leadership reviews.
- Do not ask follow-up questions.

Output format (strict):

Challenge:
<1–2 lines>

Action:
<2–3 lines, first-person ownership>

Result:
<1–2 lines, business outcome>
`;

export const generateCar = functions.https.onCall(async (data, context) => {
    // STRICT SECURITY: Only allow the specific owner to use this function
    const ALLOWED_EMAIL = "shamanthcareers@gmail.com";

    if (!context.auth || context.auth.token.email !== ALLOWED_EMAIL) {
        console.warn(`Unauthorized access attempt by: ${context.auth?.token?.email || 'unknown'}`);
        throw new functions.https.HttpsError(
            'permission-denied',
            'This feature is restricted to the authorized administrator only.'
        );
    }

    const text = data.text;
    if (!text || typeof text !== "string") {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The string argument 'text' is required."
        );
    }

    try {
        const apiKey = functions.config().gemini?.key;
        if (!apiKey) {
            console.error("Gemini API key not found in functions.config().gemini.key");
            throw new functions.https.HttpsError(
                "internal",
                "Gemini API key is not configured."
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `${SYSTEM_PROMPT}\n\nUser input:\n${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Parse the response to extract Challenge, Action, Result
        const challengeMatch = responseText.match(/Challenge:\s*([\s\S]*?)(?=Action:)/i);
        const actionMatch = responseText.match(/Action:\s*([\s\S]*?)(?=Result:)/i);
        const resultMatch = responseText.match(/Result:\s*([\s\S]*?)$/i);

        const challenge = challengeMatch ? challengeMatch[1].trim() : "";
        const action = actionMatch ? actionMatch[1].trim() : "";
        const resultText = resultMatch ? resultMatch[1].trim() : "";

        // Fallback if regex fails (e.g. model output format slightly off), return whole text in challenge or handle gracefully
        if (!challenge && !action && !resultText) {
            console.warn("Failed to parse CAR format from Gemini response", responseText);
            // Return raw response if parsing fails, or specific error
            return {
                challenge: "Could not parse response.",
                action: responseText, // Dump everything here so user doesn't lose it
                result: ""
            };
        }

        return {
            challenge,
            action,
            result: resultText,
        };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Failed to generate CAR content."
        );
    }
});
