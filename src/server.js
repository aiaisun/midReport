const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
var app = express();
const db = require(__dirname + '/db-connect');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {
    res.render('home')
});

app.get('/exhibition', function (req, res) {
    const output = {
        pageTitle: 'Exhibition',
        data: "",
        totalPages: "",
    };
    res.render('exhibition', output)
});

app.get('/expo/:page?/:place?', (req, res) => {
    const itemPerPage = 7;
    const output = {
        title: "Exhibition",
        itemPerPage: itemPerPage,
    };
    let page = req.params.page || 1;
    output.page = page;
    output.pageHead = 'exhibition';

    let place = req.query.place;
    output.place = place;
    console.log(place);

    let sqlExhibitionNum = "SELECT COUNT(1) num FROM exhibition";
    let sqlExhibition = `SELECT * FROM exhibition LIMIT ${(page - 1) * itemPerPage}, ${itemPerPage}`;
    let sqlExpoPlace = `SELECT * FROM exhibition where enPlace=?`

    if (!place) {
        db.query(sqlExhibitionNum, (error, results) => {

            output.totalNum = results[0].num;
            output.totalPages = Math.ceil(output.totalNum / itemPerPage);

            if (page < 1 || page > output.totalPages) {
                return res.redirect('/expo');
            }

            db.query(sqlExhibition, (error, results) => {
                output.data = results;
                // res.json(output);
                res.render('exhibition', output)
            });
        });
    } else if (place === 'huashan') {
        db.queryAsync(sqlExpoPlace, [place])
            .then(results => {
                //     output.expoNum = results[0].num;
                output.data = results;
                console.log(output.title);
                res.render('exhibition-try', output)
            });
    } else if (place === 'songshan') {
        db.queryAsync(sqlExpoPlace, [place])
            .then(results => {
                output.data = results;
                console.log(output.title);
                res.render('exhibition-try', output)
            });
    }
});

//首頁訂閱
app.post('/', (req, res) => {
    const sqlSubscribe = "INSERT into `subsciption` (`email`,`prefer1`,`prefer2`,`prefer3`,`prefer4`) VALUE(?,?,?,?,?)";
    // const sqlCheckUser = `SELECT * FROM subsciption where email=?`;
    let sqlCheckUser = `SELECT COUNT(1) num FROM subsciption where email=?`;

    db.queryAsync(sqlCheckUser, [
        req.body.email
    ]).
        then(result => {
            if (result[0].num === 0) {
                // console.log(req.body.place);
                // console.log(typeof(req.body.place));
                if (typeof(req.body.place) == 'string'){
                 db.queryAsync(sqlSubscribe, [
                    req.body.email,
                    req.body.place,
                    '',
                    '',
                    '',
                ]).
                    then(result => {
                        console.log('insert success');
                        return res.render('home');
                    })   
                }else{
                    db.queryAsync(sqlSubscribe, [
                        req.body.email,
                        req.body.place[0],
                        req.body.place[1],
                        req.body.place[2],
                        req.body.place[3],
                    ]).
                        then(result => {
                            console.log('insert success');
                            return res.render('home');
                        })   
                }
            } else {
                console.log('already recorded');
                return res.redirect('/');
            }
        })
})

// app.post('/', (req, res) => {
    //     const sqlSubscribe = "INSERT into `subsciption` (`email`,`prefer1`,`prefer2`,`prefer3`,`prefer4`) VALUE(?,?,?,?,?)";
    //     db.queryAsync(sqlSubscribe, [
    //         req.body.email,
    //         req.body.place[0],
    //         req.body.place[1],
    //         req.body.place[2],
    //         req.body.place[3],
    //     ]).
    //         then(result => {
    //             console.log('success');
    //             return
    //         })

    // })



app.listen(3000, function () {
    console.log('server start');
});





