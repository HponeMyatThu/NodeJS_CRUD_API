module.exports = (req, res) => {
  let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
  let id = req.url.split("/")[3];
  const regexV4 = new RegExp(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
  );

  if (req.url === "/api/movies") {
    res.statusCode = 200;
    res.setHeader("Content-type", "application/json");
    res.write(JSON.stringify(req.movies));
    res.end();
  } else if (!regexV4.test(id)) {
    res.writeHeader(404, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({ title: "INVALID UUID", message: "UUID IS NOT VALID" })
    );
  } else if (baseUrl === "/api/movies/" && regexV4.test(id)) {
    res.statusCode = 200;
    res.setHeader("Content-type", "application.json");
    let filterMovie = req.movies.filter((movie) => {
      return movie.id === id;
    });

    if (filterMovie.length > 0) {
      res.statusCode = 200;
      res.write(JSON.stringify(filterMovie));
      res.end();
    } else {
      res.statusCode = 404;
      res.write(
        JSON.stringify({ title: "NOT FOUND", message: "MOVIES NOT FOUND" })
      );
    }
  } else {
    res.writeHeader(404, { "Content-type": "application/json" });
    res.end(JSON.stringify({ title: "NOT FOUND", message: "ROUTE NOT FOUND" }));
  }
};
