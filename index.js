// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors({
    origin: '*'
}));
// Server port
var HTTP_PORT = 5000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// Root endpoint
// Insert here other API endpoints
app.post("/api/newSubject/", (req, res, next) => {
    var errors=[]
    if (!req.body.subject){
        errors.push("No Field specified");
    }
    if (!req.body.path){
        errors.push("No Subject specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        subject: req.body.subject,
        path: req.body.path
    }
    var sql ='INSERT INTO subject (subject, path) VALUES (?,?)'
    var params =[data.subject, data.path]
    db.run(sql, params, function (err, result) {
        if (err){
            console.log(err)
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.post("/api/newAttempt/", (req, res, next) => {
    var errors=[]
    if (!req.body.subject){
        errors.push("No Field specified");
    }
    if (!req.body.student){
        errors.push("No Student specified");
    }
    if (!req.body.date){
        errors.push("No Date specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        subject: req.body.subject,
        student: req.body.student,
        date: req.body.date
    }
    var sql ='INSERT INTO attempt (subject, date, student) VALUES (?,?,?)'
    var params =[data.subject, data.date, data.student]
    db.run(sql, params, function (err, result) {
        if (err){
            console.log(err)
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.post("/api/newQuestion/", (req, res, next) => {
    var errors=[]
    if (!req.body.subject){
        errors.push("No Field specified");
    }
    if (!req.body.question){
        errors.push("No Question specified");
    }
    if (!req.body.marks){
        errors.push("No Mark specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    console.log('marks -'+ req.body.marks);
    var data = {
        subject: req.body.subject,
        question: req.body.question,
        marks: req.body.marks
    }
    var sql ='INSERT INTO quest (subject, question, marks) VALUES (?,?,?)'
    var params =[data.subject, data.question, data.marks]
    db.run(sql, params, function (err, result) {
        if (err){
            console.log(err)
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.post("/api/newQuestAttempt/", (req, res, next) => {
    var errors=[]
    if (!req.body.quest){
        errors.push("No Question specified");
    }
    if (!req.body.answer){
        errors.push("No Answer specified");
    }
    if (!req.body.attempt){
        errors.push("No Attempt specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        quest: req.body.quest,
        answer: req.body.answer,
        attempt: req.body.attempt,
        marks: null,
        questionId: req.body.questionId
    }
    console.log(data)
    var sql ='INSERT INTO marks (quest, answer, attempt, marks, questionId) VALUES (?,?,?,?,?)'
    var params =[data.quest, data.answer, data.attempt, data.marks, data.questionId]
    db.run(sql, params, function (err, result) {
        if (err){
            console.log(err)
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.put("/api/updateMarksInAttempt/:attempt/:id", (req, res, next) => {
    var data = {
        marks: req.body.marks
    }
        
    var sql = "UPDATE marks set marks = ? WHERE attempt = ? and questionId = ?"
    var params = [data.marks, req.params.attempt, req.params.id]

    // db.run(
    //     `UPDATE marks set 
    //        marks = ?
    //        WHERE attempt = ? and questionId = ?`,
    //     [data.marks, req.params.attempt, req.params.id],
    //     function (err, result) {
    //         if (err){
    //             console.log(err)
    //             res.status(400).json({"error": err})
    //             return;
    //         }
    //         res.json({
    //             message: "success - Marks added",
    //             data: data,
    //             changes: this.changes
    //         })
    // });

    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            message: "success - Marks added",
            data: data,
            changes: this.changes
        })
      });

})

// - retreive questions for subject
app.get("/api/getQuestions/:subject/:path", (req, res, next) => {
    var sql = "select quest.*, quest.marks as marks from quest INNER JOIN subject on subject.id = quest.subject where subject.subject = ? and subject.path = ?"
    var params = [req.params.subject, req.params.path]
    console.log("entered to method")
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            message:"success",
            data: rows
        })
      });
});

app.get("/api/getQuestions", (req, res, next) => {
    var sql = "select * from quest"
    
    db.all(sql, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            message:"success",
            data: rows
        })
      });
});

// - retreive attempt of a particular student for particular subject
app.get("/api/getAttempt/:student", (req, res, next) => {
    console.log('here we get by student');
    var sql = "select (subject.subject|| \" - \"||subject.path) as sub, marks.*, attempt.*, quest.question, quest.marks as decideMarks from marks INNER JOIN quest on quest.id = marks.quest INNER JOIN attempt on attempt.attemptid = marks.attempt INNER JOIN subject on subject.id = quest.subject where attempt.student = ? group by attemptid"
    var params = [req.params.student]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            message:"success",
            data: rows
        })
      });
});



// - retreive attempt of a particular student for particular subject
app.get("/api/getAttempt/:student/:subject/:attemptid/", (req, res, next) => {
    var sql = "select marks.*, attempt.*, quest.question, quest.marks as decideMarks from marks INNER JOIN quest on quest.id = marks.quest INNER JOIN attempt on attempt.attemptid = marks.attempt where attempt.student = ? and attempt.subject = ? and attempt.attemptid = ?"
    var params = [req.params.student, req.params.subject, req.params.attemptid]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            message:"success",
            data: rows
        })
      });
});

// - retreive attempt of a particular student for particular subject
app.get("/api/getAttempt/:student/:subject/:attemptid/", (req, res, next) => {
    var sql = "select marks.*, attempt.*, quest.question, quest.marks as decideMarks from marks INNER JOIN quest on quest.id = marks.quest INNER JOIN attempt on attempt.attemptid = marks.attempt where attempt.student = ? and attempt.subject = ? and attempt.attemptid = ?"
    var params = [req.params.student, req.params.subject, req.params.attemptid]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            message:"success",
            data: rows
        })
      });
});

// retreive all subjects
app.get("/api/subjects", (req, res, next) => {
    var sql = "select * from subject"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            message:"success",
            data: rows
        })
      });
});

app.get("/api/subject/:id", (req, res, next) => {
    var sql = "select * from subject where id=?"
    var params = [req.params.id]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            message:"success",
            data: rows
        })
      });
});

// retreive all attempts
app.get("/api/getAllAttempts", (req, res, next) => {
    var sql = "select DISTINCT attempt.student, attempt.date, attempt.subject , (subject.subject ||\"-\"|| subject.path) as sub, attempt.attemptid  from attempt INNER JOIN subject on subject.id = attempt.subject"
    var params = [req.params.student, req.params.subject]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            message:"success",
            data: rows
        })
      });
});

// remove a subject
app.delete("/api/subject/:id", (req, res, next) => {
    db.run(
        'DELETE FROM subject WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

app.get("/api/getSum/:attempt", (req, res, next) => {
    var sql = "select sum(marks.marks) as marks from marks where marks.attempt = ?"
    var params = [req.params.attempt]
    console.log('qqq'+req.params.attempt)
    db.all(sql, params, (err, rows) => {
        console.log(rows)
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            message:"success",
            data: rows
        })
      });
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

