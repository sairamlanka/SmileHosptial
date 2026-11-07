/* =========================================================
   DOCTORS: edit this list to update the Doctors section.

   For each doctor:
   - photo:       put the image in assets/doctors/ and write its path here,
                  e.g. "assets/doctors/dr-ravi.jpg". A portrait (taller than
                  wide, about 800x1000 px) looks best. Leave it "" to show a
                  clean placeholder instead.
   - department:  must be one of "Orthopedics", "General Medicine",
                  "General Surgery", "Gynecology & Obstetrics".
   - experience:  number of years (shown as "12+ years").
   - expertise:   short list shown as tags on the profile.

   Leave a field as "" (or [] for lists, null for experience) to hide it.
   To add a doctor, copy the template at the bottom of this file into the list.
   ========================================================= */
window.SMILE_DOCTORS = [
  {
    name: "Dr. Avinash",
    department: "Orthopedics",
    designation: "Orthopaedic Surgeon",
    qualifications: "MS (Ortho)",
    experience: null,
    photo: "assets/doctors/dr-avinash.jpg",
    languages: [],
    opd: "",
    about:
      "Dr. Avinash is an Orthopaedic Surgeon at Smile Multi Speciality Hospital, caring for patients with bone, joint and spine problems, from fractures and injuries to long-term joint pain.",
    expertise: [],
  },
  {
    name: "Dr. Anusha",
    department: "Gynecology & Obstetrics",
    designation: "Consultant Obstetrician & Gynaecologist",
    qualifications: "MS (OBG)",
    experience: null,
    photo: "assets/doctors/dr-anusha.jpg",
    languages: [],
    opd: "",
    about:
      "Dr. Anusha is a Consultant Obstetrician & Gynaecologist at Smile Multi Speciality Hospital, caring for women through pregnancy, childbirth and every stage of life.",
    expertise: [],
  },
];

/* Template for a new doctor (copy inside the list above):
  {
    name: "Dr. Full Name",
    department: "Orthopedics",            // or "General Medicine", "General Surgery", "Gynecology & Obstetrics"
    designation: "Consultant Orthopedic Surgeon",
    qualifications: "MBBS, MS (Orthopedics)",
    experience: 10,                         // years, or null to hide
    photo: "assets/doctors/dr-full-name.jpg",
    languages: ["English", "Telugu", "Hindi"],
    opd: "Mon – Sat, 10:00 AM – 2:00 PM",
    about: "Two or three sentences about the doctor.",
    expertise: ["Joint replacement", "Fracture care"],
  },
*/
