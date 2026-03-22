const getPatient = async (patientId) => {
    // Simulate fetching patient data from an EHR system
    const patients = {
        P001: {
            hospitalNo: "ABC123456",
            nid: "A123456",
            name: "John Doe",
            dob: "1980-01-01",
            address: "123 Main St, Anytown, USA",
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
                admissionDate: "2023-12-01",
                dischargeDate: "2023-12-10",
            },
            {
                episodeId: "E002",
                admissionDate: "2024-03-15",
                dischargeDate: "2024-03-20",
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
                content:
                    "Patient admitted with chest pain. ECG and troponin levels suggest myocardial infarction. Started on aspirin and beta-blockers.",
            },
        ],
        E002: [
            {
                noteId: "N002",
                content:
                    "Patient admitted with shortness of breath. Chest X-ray shows pulmonary edema. Diagnosed with congestive heart failure. Started on diuretics.",
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
