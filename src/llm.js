const DEFAULT_CONFIG = {
    baseUrl: "http://192.168.100.2:8080/v1", // Ollama default  (LM Studio: http://localhost:1234/v1)
    model: "qwen3.5-9b", // Model name as listed in your server
    apiKey: "ollama", // Ollama ignores this; LM Studio uses "lm-studio"
    contextWindow: 4096, // Max tokens your model supports
    chunkSize: 1800, // Characters per chunk of clinical notes
    chunkOverlap: 200, // Overlap between chunks to preserve context
};

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

const detectIntent = async (userMessage, history, config) => {
    const sys = `You are an intent parser. Reply ONLY with valid JSON, no markdown, no preamble.
Schema: {"action":"generate_document"|"chat"|"download","docType":"discharge"|"referral"|"clinical"|null,"patientId":string|null,"downloadFormat":"pdf"|"docx"|null}
Rules:
- discharge summary  → action:generate_document, docType:discharge
- referral letter    → action:generate_document, docType:referral
- clinical note      → action:generate_document, docType:clinical
- patient ID P001 etc → extract patientId
- download as pdf    → action:download, downloadFormat:pdf
- download as docx/word → action:download, downloadFormat:docx
- anything else      → action:chat`;

    const msgs = [
        ...history.slice(-4).map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
        })),
        { role: "user", content: userMessage },
    ];
    try {
        const raw = await callLLM(msgs, { ...config, max_tokens: 150 }, sys);
        return JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
        return {
            action: "chat",
            docType: null,
            patientId: null,
            downloadFormat: null,
        };
    }
};

const processByIntent = async (intent, prompt, history, config, onStatus) => {
    switch (intent.action) {
        case "chat":
            onStatus?.("Generating response…");
            const response = await callLLM(
                [{ role: "user", content: prompt }],
                config,
                "You are a helpful assistant that provides concise answers to user questions based on the provided clinical notes. If the notes do not contain relevant information, say you don't know. Your name is AutoMO and you are an AI assistant designed to help medical professionals quickly extract information from clinical notes. Always provide concise and accurate answers based on the notes, and never make up information that isn't present in the notes.",
            );
            return response;
        case "generate_document":
            // Placeholder: In a real app, you'd generate the document here
            return "Document generation is not yet implemented.";
    }
};

const processPrompt = async (prompt, history, config, onStatus) => {
    try {
        onStatus?.("Detecting intent…");
        const intent = await detectIntent(prompt, history, config);
        console.log("Detected intent:", intent);

        return processByIntent(intent, prompt, history, config, onStatus);
    } catch (error) {
        console.error("Error processing prompt:", error);
        return `Error: ${error.message}`;
    }
};

export { DEFAULT_CONFIG, processPrompt };
