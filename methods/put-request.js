const bodyParser = require("../utils/body-parser");
const requestBodyParser = require("../utils/body-parser");
const writeToFile = require("../utils/write-to-file");

module.exports = async (req, res) => {
  let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
  let id = req.url.split("/")[3];
  const regexV4 = new RegExp(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
  );
  if (!regexV4.test(id)) {
    res.writeHeader(404, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({ title: "INVALID UUID", message: "UUID IS NOT VALID" })
    );
  } else if (baseUrl === "/api/movies/" && regexV4.test(id)) {
    try {
      let body = await bodyParser(req);
      const index = req.movies.findIndex((movie) => {
        return movie.id === id;
      });
      if (index === -1) {
        res.statusCode = 404;
        res.write(
          JSON.stringify({ title: "NOT FOUND", message: "MOVIES NOT FOUND" })
        );
      } else {
        req.movies[index] = { id, ...body };
        writeToFile(req.movies);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(req.movies[index]));
      }
    } catch (err) {
      console.log(err);
      res.writeHeader = (400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          title: "CREATE FAILED",
          message: "REQUEST BODY IS NOT VALID",
        })
      );
    }
  } else {
    res.writeHeader(404, { "Content-type": "application/json" });
    res.end(JSON.stringify({ title: "NOT FOUND", message: "ROUTE NOT FOUND" }));
  } 
};
