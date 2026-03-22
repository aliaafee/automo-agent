const TOOLS = [
    {
        type: "function",
        function: {
            name: "get_patient",
            description:
                "Fetch demographic information for a patient from the EMR system, including name, date of birth, hospital number, NID, and address.",
            parameters: {
                type: "object",
                properties: {
                    patientId: {
                        type: "string",
                        description:
                            "The unique patient identifier, e.g. P001.",
                    },
                },
                required: ["patientId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_episodes",
            description:
                "Retrieve all hospital admission episodes for a patient, including episode IDs, admission dates, and discharge dates.",
            parameters: {
                type: "object",
                properties: {
                    patientId: {
                        type: "string",
                        description:
                            "The unique patient identifier, e.g. P001.",
                    },
                },
                required: ["patientId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_clinical_notes",
            description:
                "Fetch clinical notes for one or more hospital episodes. Returns a list of notes with their content.",
            parameters: {
                type: "object",
                properties: {
                    episodeIds: {
                        type: "array",
                        items: { type: "string" },
                        description:
                            'List of episode IDs to retrieve notes for, e.g. ["E001", "E002"].',
                    },
                },
                required: ["episodeIds"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "generate_discharge_summary",
            description:
                "Generate a structured clinical discharge summary for a patient using their EMR data and clinical notes. Returns a formatted narrative document.",
            parameters: {
                type: "object",
                properties: {
                    patientId: {
                        type: "string",
                        description:
                            "The unique patient identifier, e.g. P001.",
                    },
                },
                required: ["patientId"],
            },
        },
    },
];

export { TOOLS };
