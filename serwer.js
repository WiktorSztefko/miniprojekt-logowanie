//zmienne, stałe

var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;

var path = require("path")


app.use(express.static('static'))

var users = [
  { id: 1, log: "AAA", pass: "aaa", wiek: 10, uczen: "checked", plec: "m" },
  { id: 2, log: "BBB", pass: "bbb", wiek: 12, uczen: "", plec: "k" },
  { id: 3, log: "CCC", pass: "ccc", wiek: 14, uczen: "", plec: "m" },
  { id: 4, log: "DDD", pass: "ddd", wiek: 16, uczen: "checked", plec: "k" },
]
var id = 4 //pomocnicza zmienna do przyszłych id

app.get("/", function (req, res) { //obsługa adresu
  res.sendFile(path.join(__dirname + "/static/main.html"))
})

app.get("/register", function (req, res) { //obsługa adresu
  res.sendFile(path.join(__dirname + "/static/register.html"))
})

app.get("/login", function (req, res) { //obsługa adresu
  res.sendFile(path.join(__dirname + "/static/login.html"))
})

app.get("/admin", function (req, res) { //obsługa adresu, w zależności czy ktoś się zalogowal

  if (zalogowany == true) {
    res.sendFile(path.join(__dirname + "/static/admin2.html"))
  }
  else {
    res.sendFile(path.join(__dirname + "/static/admin.html"))
  }
})
app.get("/adminlogout", function (req, res) { //jeśli wejdziemy w logout to zmieniamy wartość zmiennej
  zalogowany = false
  res.redirect("/") //przekierowanie do /

})

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", function (req, res) {
  //to co przyjdzie z formularza daje do zmiennych
  var login = req.body.login
  var password = req.body.password
  var age = parseInt(req.body.wiek) // stringa na inta
  var uczen = req.body.uczen
  var plec = req.body.plec
  id++

  if (uczen == undefined) {
    uczen = "" //aby zapis był ładny i lepiej się działało
  }

  var breaker
  for (i = 0; i < users.length; i++) { //sprawdzenia czy dane są w bazie
    if (login == users[i].log) {
      breaker = true
      break;
    }
  }

  if (breaker == true) { //jeśli dane są w bazie
    res.send(`Witaj ${login}, jesteś już zarejestrowany w bazie`)
  }
  else { //jeśli nie są w bazie
    res.send(`Witaj ${login}, zostałeś dodany do bazy`)

    users.push({ id: id, log: login, pass: password, wiek: age, uczen: uczen, plec: plec }) //dodanie usera do bazy
    //console.log(users)
  }
})

var zalogowany = false
app.post("/login", function (req, res) {
  //to co przyjdzie z formularza daje do zmiennych
  var login = req.body.login
  var password = req.body.password

  var breaker
  for (i = 0; i < users.length; i++) { //sprawdzenia czy dane są w bazie
    if (login == users[i].log && password == users[i].pass) {
      breaker = true
      break;
    }
  }

  if (breaker == true) {
   // console.log("logowanie ok")
    zalogowany = true
    res.sendFile(path.join(__dirname + "/static/admin2.html"))
  }
  else {
   // console.log("nie pyklo")
   res.send(`Błędny login lub hasło`)
  }


})
//////////////////////////////////////////////////////////////////////////
//---------------------------------SHOW---------------------------------//
//////////////////////////////////////////////////////////////////////////
app.get("/show", function (req, res) {
  if (zalogowany == true) { //wyświetli tylko jeśli ktoś się zalogował
    var body = []

    body.push("<body>")

    body.push("<nav><ul><li><a href=/show>show</a></li><li><a href=/gender>gender</a></li><li><a href=/sort>sort</a></li></ul></nav>")

    body.push("<table>")
    console.log(users)
    for (i = 1; i <= id; i++) {
      console.log(i)
      body.push(`<tr><td>id: ${i}</td><td>user: ${users[i - 1].log}---${users[i - 1].pass}</td>`)
      if (users[i - 1].uczen == "checked") {
        body.push(`<td>uczeń: <input type="checkbox" disabled checked></input></td>`)
      }
      else {
        body.push(`<td>uczeń: <input type="checkbox" disabled></input></td>`)
      }

      body.push(`<td>wiek: ${users[i - 1].wiek}</td><td>płeć: ${users[i - 1].plec}</td></tr>`)
    }
    body.push("</table></body>")

    body = body.join('')

    res.send(`
    <!DOCTYPE html>
    <html lang="pl">
    <head>
    <meta charset="UTF-8">
    <title>Gender</title>
    <link rel="stylesheet" href="/css/show.css" type="text/css">
    </head>
    ${body}
    </html>
    `
    )
  }
  else { //wyświetli stronę admina z blokadą, to wtedy jeśli ktoś wpisuje url
    res.sendFile(path.join(__dirname + "/static/admin.html"))
  }

})
//////////////////////////////////////////////////////////////////////////
//--------------------------------GENDER--------------------------------//
//////////////////////////////////////////////////////////////////////////
app.get("/gender", function (req, res) {
  if (zalogowany == true) {//wyświetli tylko jeśli ktoś się zalogował
    var body = []

    body.push("<body>")

    body.push("<nav><ul><li><a href=/show>show</a></li><li><a href=/gender>gender</a></li><li><a href=/sort>sort</a></li></ul></nav>")

    body.push("<table>")

    for (i = 1; i <= id; i++) {
      if (users[i - 1].plec == "k") {
        body.push(`<tr><td>id: ${users[i - 1].id}</td><td>płeć: ${users[i - 1].plec}</td></tr>`)
      }
    }
    body.push("</table>")

    body.push("<table>")


    for (i = 1; i <= id; i++) {
      if (users[i - 1].plec == "m") {
        body.push(`<tr><td>id: ${users[i - 1].id}</td><td>płeć: ${users[i - 1].plec}</td></tr>`)
      }
    }
    body.push("</table>", "</body>")

    body = body.join('')

    res.send(`
  <!DOCTYPE html>
  <html lang="pl">
  <head>
  <meta charset="UTF-8">
  <title>Gender</title>
  <link rel="stylesheet" href="/css/gender.css" type="text/css">
  </head>
  ${body}
  </html>
  `
    )
  }
  else { //wyświetli stronę admina z blokadą, to wtedy jeśli ktoś wpisuje url
    res.sendFile(path.join(__dirname + "/static/admin.html"))
  }

})


//////////////////////////////////////////////////////////////////////////
//--------------------------------SORT--------------------------------//
//////////////////////////////////////////////////////////////////////////

var kolejnosc = "rosnaco" //domyślnie 

function sort() {
  var body = []

  body.push("<body>")
  body.push("<nav><ul><li><a href=/show>show</a></li><li><a href=/gender>gender</a></li><li><a href=/sort>sort</a></li></ul></nav>")
  body.push('<form onchange="this.submit()" action="/sort" method="POST">')

  if (kolejnosc == "rosnaco") {
    body.push(
      '<input type="radio" name="kolejnosc" id="rosnaco" required value="rosnaco" checked><label for="rosnaco">rosnąco</label>',
      '<input type="radio" name="kolejnosc" id="malejaco" required value="malejaco"><label for="malejaco">malejąco</label>'
    )
  } else {
    body.push(
      '<input type="radio" name="kolejnosc" id="rosnaco" required value="rosnaco"><label for="rosnaco">rosnąco</label>',
      '<input type="radio" name="kolejnosc" id="malejaco" required value="malejaco" checked><label for="malejaco">malejąco</label>'
    )
  }

  body.push(
    '</form><table>'
  )

  users_sorted = [...users] // obiekt klon obiektu users, ale taki co ma te samą zawartość, ale jak tam coś sortuje to nie zmienia się to w oryginale 

  users_sorted.sort(function (a, b) {
    if (kolejnosc == 'rosnaco') { //mechanizm sortowania
      return a.wiek - b.wiek;
    } else {
      return b.wiek - a.wiek;
    }
  })

  for (user of users_sorted) {
    body.push(
      `<tr><td>${user.id}</td><td>${user.log}---${user.pass}</td><td>${user.wiek}</td></tr>` //dodanie wierszy z komórkami
    )
  }
  body.push(
    '</table></body>'
  )


  body = body.join('')
  return `
  <!DOCTYPE html>
  <html lang="pl">
  <head>
  <meta charset="UTF-8">
  <title>Gender</title>
  <link rel="stylesheet" href="/css/sort.css" type="text/css">
  </head>
  ${body}
  </html>
  ` //zwracamy zawartość bo nie mamy tutaj res
}

app.get('/sort', function (req, res) { //to odpowiada za wywolanie dynamiczne po pkliknieciu w panel admina
  if (zalogowany == true) {

    res.send(sort())
  } else {
    res.sendFile(path.join(__dirname + "/static/admin.html"))
  }
})

app.post('/sort', function (req, res) { //to odpowiada za zmiane sorowania
  if (zalogowany == true) {
    kolejnosc = req.body.kolejnosc
    res.send(sort())
  } else {
    res.sendFile(path.join(__dirname + "/static/admin.html"))
  }
})










//nasłuch na określonym porcie
app.listen(PORT, function () {
  console.log("to jest start serwera na porcie " + PORT)
})