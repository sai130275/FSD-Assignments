const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(`
        <h1>Student Details</h1>
        <form action="/student" method="POST">

        Name: <input name="name" required><br><br>
        Roll Number: <input name="roll" required><br><br>
        Branch: <input name="branch" required><br><br>
        Gender: <input name="gender" required><br><br>
        Mobile Number: <input name="mobile" required><br><br>
        Email: <input type="email" name="email" required><br><br>

        <button type="submit">Submit</button>
        </form>
    `);
});

app.post("/student", (req, res) => {
    res.send(`
        <h1>Student Details</h1>
        <p>Name: ${req.body.name}</p>
        <p>Roll Number: ${req.body.roll}</p>
        <p>Branch: ${req.body.branch}</p>
        <p>Gender: ${req.body.gender}</p>
        <p>Mobile: ${req.body.mobile}</p>
        <p>Email: ${req.body.email}</p>
        <a href="/">Add Another Student</a>
    `);
});

app.listen(3000, () =>
    console.log("http://localhost:3000")
);