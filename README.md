# Smile Multi Speciality Hospital

Static website for Smile Multi Speciality Hospital, covering four departments:
Orthopedics, General Medicine, General Surgery, and Gynecology & Obstetrics.

## Features
- 2-second branded logo splash on load
- Dark, premium theme in the logo blue (`#387DF0`)
- Animated hero (particle network, ECG line, floating cards), scroll reveals, 3D tilt cards, counters, marquee
- Department detail pop-ups with conditions treated and services offered
- Doctors section with photo cards, department filter and full profile pop-ups
- Appointment request form (front-end only for now) and contact section
- Responsive down to phone width; respects "reduce motion" settings

## Run locally
No build step. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Updating doctors
All doctor details live in `js/doctors.js`, one entry per doctor (name, department, designation,
qualifications, years of experience, OPD timings, languages, short bio, areas of expertise).

1. Put each photo in `assets/doctors/` (portrait, about 800×1000 px, e.g. `dr-ravi.jpg`).
2. Set that doctor's `photo` to `"assets/doctors/dr-ravi.jpg"`.
3. Add or remove entries to change how many doctors appear. If a photo is missing, a clean placeholder is shown.

## Before going live, update
- Phone number (`+91 00000 00000`) and address placeholders in `index.html`
- OPD hours in the contact section
- Hook the appointment form up to a backend, email service or WhatsApp link (it currently only shows a confirmation message)

## Structure
```
index.html
css/styles.css
js/doctors.js   (doctor list)
js/main.js
assets/logo.png, logo-white.png, favicon.png
assets/doctors/ (doctor photos)
```
