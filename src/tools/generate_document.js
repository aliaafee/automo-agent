import { getPatient, getEpisodes, getClinicalNotes } from "./emr-connector";

const DISCHARGE_SUMMARY_PROMPT = `You are a clinical documentation specialist. Using the patient information and clinical notes provided, write a structured discharge summary.
Be concise, professional, and clinically accurate. Use only the information provided. Format the summary as json with no other text but these fields with the following structure. Leave unknown fields as null or empty.:
{
    "patientInformation": {
        "name": "John Doe",
        "nid": "123456789",
        "hospitalNo": "H12345",
        "dob": "1980-01-01",
        "age": 44,
        "address": "Island, Atoll, Maldives or similar",
    },
    "admissionInformation": {
        "dateOfAdmission": "2024-01-01",
        "dateOfDischarge": "2024-01-10",
        "admittedWard": "General Medicine",
        "admittedBed": "Bed 5",
    },
    clinicalInformation: {
        "admissionDiagnosis": "Pneumonia",
        "finalDiagnosis": "Community-acquired pneumonia",
        "presentingComplaint": "Fever, cough, and shortness of breath for 3 days",
        "historyOfPresentingComplaint": "Patient reports onset of symptoms 3 days ago, with gradual worsening. No significant past medical history.",
        "examinationFindings": "On examination, patient was febrile, tachypneic, and had crackles in the right lower lung field.",
        "summaryOfInvestigations": "Chest X-ray showed right lower lobe consolidation. Blood tests revealed elevated white cell count.",
        "operativeProcedures": [
            {
                "procedureName": "None",
                "date": null,
                "startTime": null,
                "endTime": null,
                "surgeons": null,
                "assistants": null,
                "anesthetist": null,
                "nursingStaff": null,
                "technicians": null,
                "anesthesiaType": null,
                "summaryOfFindings": null,
            }
        ],
        "summaryOfHospitalCourse": "Patient was treated with intravenous antibiotics and supportive care. Clinical improvement was noted by day 5 of admission.",
        "medicationsOnDischarge": [
            {
                "name": "Amoxicillin",
                "dose": "500 mg",
                "route": "Oral",
                "frequency": "Three times a day",
                "duration": "7 days",
            }
        ],
        "dischargeAdvice": "Patient advised to complete the full course of antibiotics, maintain hydration, and monitor for any worsening symptoms such as increased shortness of breath or high fever.",
        "followUpPlan": "Patient to follow up with primary care physician in 1 week. Repeat chest X-ray in 4 weeks.",
}`;

async function generateDischargeSummary(
    patientId,
    episodeIds,
    callLLM,
    config,
    onStatus,
) {
    try {
        if (!patientId) {
            throw new Error("patientId is required");
        }

        onStatus?.("Fetching patient data…");
        const [patient, allEpisodes] = await Promise.all([
            getPatient(patientId),
            getEpisodes(patientId),
        ]);

        if (!patient) {
            throw new Error(`Patient ${patientId} not found`);
        }

        const episodes = episodeIds?.length
            ? allEpisodes.filter((ep) => episodeIds.includes(ep.episodeId))
            : allEpisodes;

        const resolvedEpisodeIds = episodes.map((ep) => ep.episodeId);

        onStatus?.("Fetching clinical notes…");
        const clinicalNotes = await getClinicalNotes(resolvedEpisodeIds);

        const context = `
Patient: ${patient.name}
Hospital No: ${patient.hospitalNo}
NID: ${patient.nid}
DOB: ${patient.dob}
Address: ${patient.address}

Episodes:
${episodes.map((ep) => `- Episode ${ep.episodeId}: Admitted ${ep.admissionDate}, Discharged ${ep.dischargeDate}, Ward: ${ep.admittedWard ?? "N/A"}, Bed: ${ep.admittedBed ?? "N/A"}`).join("\n")}

Clinical Notes:
${clinicalNotes.map((n) => `[${n.noteId}] (${n.type ?? "Note"}, ${n.date ?? ""}) ${n.content}`).join("\n\n")}
`.trim();

        console.log("Context for LLM:", context);

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
