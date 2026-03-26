const getPatient = async (patientId) => {
    // Simulate fetching patient data from an EHR system
    const patients = {
        P001: {
            hospitalNo: "H-20248821",
            nid: "A012345",
            name: "Aminath Shazna",
            dob: "1985-06-14",
            address: "Maavehi, Fuvahmulah City, Gnaviyani Atoll, Maldives",
        },
    };

    try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return patients[patientId];
    } catch (err) {
        console.error("Error fetching patient data:", err);
        return null;
    }
};

const getEpisodes = async (patientId) => {
    // Simulate fetching episode data for a patient
    const episodes = {
        P001: [
            {
                episodeId: "E001",
                admissionDate: "2026-03-16",
                dischargeDate: "2026-03-24",
                admittedWard: "General Medicine",
                admittedBed: "Bed 7",
            },
        ],
    };

    try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return episodes[patientId] || [];
    } catch (err) {
        console.error("Error fetching episode data:", err);
        return [];
    }
};

const getClinicalNotes = async (episodeIds) => {
    // Simulate fetching clinical notes for given episode IDs
    const notes = {
        E001: [
            {
                noteId: "N001",
                type: "Admission Note",
                date: "2026-03-16",
                content:
                    "40-year-old female presented to A&E with a 4-day history of productive cough, high-grade fever (39.2°C), and progressive shortness of breath. No prior history of respiratory illness. Non-smoker. No known drug allergies. Admission diagnosis: Community-acquired pneumonia. Admitted to General Medicine Ward, Bed 7.",
            },
            {
                noteId: "N002",
                type: "Examination Findings",
                date: "2026-03-16",
                content:
                    "On examination: febrile (39.2°C), tachypneic (RR 24/min), SpO2 91% on room air. Chest auscultation revealed coarse crepitations over the right lower and middle zones. Heart sounds normal. Abdomen soft and non-tender. No peripheral oedema.",
            },
            {
                noteId: "N003",
                type: "Investigation Results",
                date: "2026-03-17",
                content:
                    "Chest X-ray (16/03/2026): right lower lobe consolidation consistent with pneumonia. FBC: WBC 15.8 × 10⁹/L (neutrophilia), Hb 12.4 g/dL, platelets 310 × 10⁹/L. CRP 148 mg/L. Blood cultures: no growth at 48 hours. Sputum culture: heavy growth of Streptococcus pneumoniae, sensitive to amoxicillin. Renal and liver function within normal limits.",
            },
            {
                noteId: "N004",
                type: "Operative / Procedure Note",
                date: "2026-03-17",
                content:
                    "No surgical or operative procedures performed during this admission.",
            },
            {
                noteId: "N005",
                type: "Progress Note",
                date: "2026-03-18",
                content:
                    "Patient commenced on IV Co-amoxiclav 1.2 g TDS and IV Azithromycin 500 mg OD on admission. Supplemental oxygen via nasal cannula at 2 L/min. Adequate hydration maintained with IV fluids. By day 3 (18/03/2026), fever subsided and respiratory rate improved to 18/min. SpO2 rose to 97% on room air; oxygen discontinued.",
            },
            {
                noteId: "N006",
                type: "Progress Note",
                date: "2026-03-21",
                content:
                    "Patient clinically improving. Tolerating oral intake well. Switched to oral Amoxicillin 500 mg TDS and oral Azithromycin 500 mg OD on day 5. Repeat CRP on 21/03/2026: 32 mg/L. Chest auscultation: significantly reduced crepitations.",
            },
            {
                noteId: "N007",
                type: "Discharge Note",
                date: "2026-03-24",
                content:
                    "Patient is afebrile, haemodynamically stable, and SpO2 98% on room air. Discharged home on 24/03/2026. Final diagnosis: Community-acquired pneumonia (right lower lobe), Streptococcus pneumoniae. Discharged on: Amoxicillin 500 mg orally three times daily for 5 days (to complete a total 10-day course); Azithromycin 500 mg orally once daily for 2 days. Patient advised to stay hydrated, rest adequately, and return immediately if fever recurs, dyspnoea worsens, or haemoptysis develops. Follow-up with primary care physician in 1 week. Repeat chest X-ray in 6 weeks to confirm resolution.",
            },
        ],
    };

    try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const noteList = episodeIds.flatMap((id) => notes[id] || []);
        return noteList;
    } catch (err) {
        console.error("Error fetching clinical notes:", err);
        return [];
    }
};

export { getPatient, getEpisodes, getClinicalNotes };
