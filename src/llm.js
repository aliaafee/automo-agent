import { generateDischargeSummary } from "./tools/generate_document";
import {
    getPatient,
    getEpisodes,
    getClinicalNotes,
} from "./tools/emr-connector";
import { TOOLS } from "./tools/tools-definition";

const DEFAULT_CONFIG = {
    baseUrl: "http://192.168.100.2:8080/v1", // Ollama default  (LM Studio: http://localhost:1234/v1)
    model: "qwen3-vl-8b-instruct", // Model name as listed in your server
    apiKey: "ollama", // Ollama ignores this; LM Studio uses "lm-studio"
    contextWindow: 4096, // Max tokens your model supports
    chunkSize: 1800, // Characters per chunk of clinical notes
    chunkOverlap: 200, // Overlap between chunks to preserve context
};

const SYSTEM_PROMPT = `You are AutoMO, an AI assistant designed to help medical professionals quickly extract information from clinical notes and generate clinical documents. Use the available tools to fetch patient data and generate documents when asked. Always provide concise and accurate answers based on the available data, and never make up information that isn't present.`;

// Used by generate_document.js internally — returns plain string
const callLLM = async (messages, config, systemPrompt = null) => {
    const body = {
        model: config.model,
        temperature: 0.3,
        max_tokens: 1024,
        messages: [
            ...(systemPrompt
                ? [{ role: "system", content: systemPrompt }]
                : []),
            ...messages,
        ],
    };

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`LLM error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "No response.";
};

// Agent call — sends tools and returns the full message object
const callLLMAgent = async (messages, config) => {
    const body = {
        model: config.model,
        temperature: 0.3,
        max_tokens: 1024,
        tools: TOOLS,
        tool_choice: "auto",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    };

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`LLM error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message;
};

const executeTool = async (name, args, config, onStatus) => {
    switch (name) {
        case "get_patient":
            onStatus?.(`Fetching patient ${args.patientId}…`);
            return await getPatient(args.patientId);
        case "get_episodes":
            onStatus?.(`Fetching episodes for ${args.patientId}…`);
            return await getEpisodes(args.patientId);
        case "get_clinical_notes":
            onStatus?.("Fetching clinical notes…");
            return await getClinicalNotes(args.episodeIds);
        case "generate_discharge_summary": {
            const result = await generateDischargeSummary(
                args.patientId,
                callLLM,
                config,
                onStatus,
            );
            return result;
        }
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
};

const processPrompt = async (prompt, history, config, onStatus) => {
    try {
        const messages = [
            ...history.slice(-10).map((m) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content,
            })),
            { role: "user", content: prompt },
        ];

        // Agentic loop — keep going until the model returns a plain text response
        while (true) {
            onStatus?.("Thinking…");
            const message = await callLLMAgent(messages, config);
            messages.push(message);

            console.log("LLM response:", message);

            if (!message.tool_calls || message.tool_calls.length === 0) {
                return message.content?.trim() || "No response.";
            }

            // Execute all tool calls in parallel
            onStatus?.(
                `Using ${message.tool_calls.map((c) => c.function.name).join(", ")}…`,
            );
            const toolResults = await Promise.all(
                message.tool_calls.map(async (call) => {
                    const args = JSON.parse(call.function.arguments);
                    const result = await executeTool(
                        call.function.name,
                        args,
                        config,
                        onStatus,
                    );
                    return {
                        role: "tool",
                        tool_call_id: call.id,
                        content: JSON.stringify(result),
                    };
                }),
            );

            messages.push(...toolResults);
        }
    } catch (error) {
        console.error("Error processing prompt:", error);
        return `Error: ${error.message}`;
    }
};

export { DEFAULT_CONFIG, processPrompt };
