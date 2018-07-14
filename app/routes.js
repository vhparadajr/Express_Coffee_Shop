module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', (req, res) => {
      db.collection('orders').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('index.ejs', {orders: result})
      })
    })

    // PROFILES SECTION =========================
    // Cashier profile
    // app.get('/cashier', isLoggedIn, function(req, res) {
    //     db.collection('orders').find().toArray((err, result) => {
    //       if (err) return console.log(err)
    //       res.render('cashier.ejs', {
    //         user : req.user,
    //         orders: result
    //       })
    //     })
    // });
    // Barista profile
    app.get('/barista', isLoggedIn, function(req, res) {
        db.collection('orders').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('barista.ejs', {
            user : req.user,
            orders: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// order board routes ===============================================================

    app.post('/orders', (req, res) => {
      db.collection('orders').save({customerName: req.body.customerName, coffee: req.body.coffee, toma: req.body.toma, completed: false}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
      })
    })

    // app.put('/completed', (req, res) => {
    //   db.collection('orders')
    //   .findOneAndUpdate({customerName: req.body.customerName, coffee: req.body.coffee, toma: req.body.toma} {
    //     $set: {
    //       completed: true
    //     }
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    // app.put('/messagesDown', (req, res) => {
    //     db.collection('messages')
    //     .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //       $set: {
    //         thumbUp:req.body.thumbUp - 1
    //       }
    //     }, {
    //       sort: {_id: -1},
    //       upsert: true
    //     },
    //     (err, result) => {
    //       if (err) return res.send(err)
    //       res.send(result)
    //     })
    //   })

    app.delete('/erase', (req, res) => {
      db.collection('orders').findOneAndDelete({customerName: req.body.customerName, coffee: req.body.coffee, toma: req.body.toma}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        // login cashier
        app.get('/cashierLogin', function(req, res) {
            res.render('cashierLogin.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/cashier', passport.authenticate('local-login', {
            successRedirect : '/cashier', // redirect to the secure profile section
            failureRedirect : '/cashierLogin', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
        //login barista
        app.get('/baristaLogin', function(req, res) {
            res.render('baristaLogin.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/barista', passport.authenticate('local-login', {
            successRedirect : '/barista', // redirect to the secure profile section
            failureRedirect : '/baristaLogin', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        //update completed
      app.put('/completed', (req, res) => {
        db.collection('orders')
        .findOneAndUpdate({customerName: req.body.customerName, coffee: req.body.coffee, toma: req.body.toma, completed: false}, {
          $set: {
            completed: true
          }
        }, {
              sort: {_id: -1},
              upsert: true
            }, (err, result) => {
                if (err) return res.send(err)
                    res.send(result)
            })
      })


        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/cashier', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
