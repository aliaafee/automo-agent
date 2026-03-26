import { TOOLS, executeTool } from "./tools/tools-definition";
import { callLLMWithTools, callLLM } from "./llm";

const maxAgentIterations = 1000;

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
                        callLLM,
                        config,
                        onStatus,
                    );
                    console.log(
                        `Result from tool ${call.function.name}:`,
                        result,
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

        return {
            type: "error",
            message: "Max Iterations Reached.",
        };
    } catch (error) {
        console.error("Error running agent:", error);
        return {
            type: "error",
            message: error.message,
        };
    }
};

export { runAgent };
