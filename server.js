const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let doctors = [
  { id: 1, name: "Dr. Sharma", location: "Delhi", fee: 500, rating: 4.5 },
  { id: 2, name: "Dr. Mehta", location: "Delhi", fee: 700, rating: 4.8 },
  { id: 3, name: "Dr. Rao", location: "Mumbai", fee: 400, rating: 4.2 }
];

let appointments = [];

// Show nearby doctors
app.post("/doctors", (req, res) => {
  const { location } = req.body;
  res.json(doctors.filter(d => d.location === location));
});

// Book appointment (payment before visit)
app.post("/book", (req, res) => {
  const { doctorId, amount } = req.body;
  appointments.push({
    doctorId,
    amount,
    time: Date.now(),
    status: "BOOKED"
  });
  res.json({ message: "Appointment booked successfully" });
});

// Cancel appointment
app.post("/cancel", (req, res) => {
  const appt = appointments.pop();
  const now = Date.now();
  if (now - appt.time < 3600000) {
    res.json({ refund: appt.amount * 0.5 });
  } else {
    res.json({ refund: 0 });
  }
});

// Complete appointment
app.post("/complete", (req, res) => {
  const appt = appointments.pop();
  res.json({ doctorPaid: appt.amount });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
