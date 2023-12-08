function calculateDoctorRank(doctor) {
    const { PageRank, PPR, PL, PPL, TR, HI, nC, Y, logP, D, I, PP, X, A, C, CD, RA, PRA, DR, PR, CR, NR, } = doctor;

    const rank =
        ((PageRank + 2 * PPR + PL + 2 * PPL) *
            (TR + HI +  Math.log(nC) +  Y +  Math.log(logP) +  10 * D +  10 * I +  A +  RA +  2 * PRA +  PP +  CD) *
            (2 * DR + PR)) /
        (X * C * CR * NR);

    return rank;
}

const exampleDoctor = {
    PR: 1,
    PPR: 2,
    PL: 3,
    PPL: 4,
    TR: 5,
    HI: 6,
    nC: 7,
    Y: 8,
    logP: 9,
    D: 10,
    I: 11,
    PP: 12,
    X: 13,
    A: 14,
    C: 15,
    CD: 16,
    RA: 17,
    PRA: 18,
    DR: 19,
    patientReferral: 20,
    CR: 21,
    NR: 22,
};

const doctorRank = calculateDoctorRank(exampleDoctor);
console.log("Doctor Rank:", doctorRank);
