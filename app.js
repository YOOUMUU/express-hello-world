import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const dataToMailchimp = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(dataToMailchimp);

  const url = "https://us14.api.mailchimp.com/3.0/lists/995fa99329";
  const options = {
    method: "POST",
    auth: "Irvin1:99e9b878ba14ad7a544f5a37a213d281-us14",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }

    response.on("data", (data) => console.log(JSON.parse(data)));
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.POST || port, () => {
  console.log(`Server is running on port ${port}`);
});

// API Key
// 99e9b878ba14ad7a544f5a37a213d281-us14

// List id
// 995fa99329
