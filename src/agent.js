import { TOOLS } from "./tools/tools-definition";
import { callLLMWithTools } from "./llm";

const maxAgentIterations = 5;

const runAgent = async (prompt, history = [], config = {}, onStatus) => {
    try {
        const messages = [
            ...history.slice(-10).map((m) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content,
            })),
            { role: "user", content: prompt },
        ];

        for (let i = 0; i < maxAgentIterations; i++) {
            onStatus?.("Thinking…");
            const message = await callLLMWithTools(messages, TOOLS, config);
            messages.push(message);
            console.log("LLM response:", message);

            if (!message.tool_calls || message.tool_calls.length === 0) {
                return {
                    type: "response",
                    content: message.content?.trim() || "No response.",
                };
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
        console.error("Error running agent:", error);
        return {
            type: "error",
            message: error.message,
        };
    }
};

export { runAgent };
