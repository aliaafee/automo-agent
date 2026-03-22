import { getPatient, getEpisodes, getClinicalNotes } from "./emr-connector";

const DISCHARGE_SUMMARY_PROMPT = `You are a clinical documentation specialist. Using the patient information and clinical notes provided, write a structured discharge summary.

Include the following sections:
- Patient Information
- Admission & Discharge Dates (per episode)
- Presenting Complaint & History
- Diagnosis
- Treatment & Management
- Medications on Discharge
- Follow-up Plan

Be concise, professional, and clinically accurate. Use only the information provided.`;

async function generateDischargeSummary(patientId, callLLM, config, onStatus) {
    try {
        if (!patientId) {
            throw new Error("patientId is required");
        }

        onStatus?.("Fetching patient data…");
        const [patient, episodes] = await Promise.all([
            getPatient(patientId),
            getEpisodes(patientId),
        ]);

        if (!patient) {
            throw new Error(`Patient ${patientId} not found`);
        }

        onStatus?.("Fetching clinical notes…");
        const episodeIds = episodes.map((ep) => ep.episodeId);
        const clinicalNotes = await getClinicalNotes(episodeIds);

        const context = `
Patient: ${patient.name}
Hospital No: ${patient.hospitalNo}
NID: ${patient.nid}
DOB: ${patient.dob}
Address: ${patient.address}

Episodes:
${episodes.map((ep) => `- Episode ${ep.episodeId}: Admitted ${ep.admissionDate}, Discharged ${ep.dischargeDate}`).join("\n")}

Clinical Notes:
${clinicalNotes.map((n) => `[${n.noteId}] ${n.content}`).join("\n\n")}
`.trim();

        onStatus?.("Generating discharge summary…");
        const summaryText = await callLLM(
            [{ role: "user", content: context }],
            config,
            DISCHARGE_SUMMARY_PROMPT,
        );

        return {
            patientId,
            patientName: patient.name,
            dateGenerated: new Date().toISOString(),
            summary: summaryText,
        };
    } catch (error) {
        console.error("Error generating discharge summary:", error);
        throw error;
    }
}

export { generateDischargeSummary };
