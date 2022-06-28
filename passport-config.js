const LocalStrategy = require('passport-local').Strategy;
const {User} = require('./database');
exports.initilizePassport =(passport)=>{

    // passport.use(new LocalStrategy(async(username,password,done)=>{
    //     try {
    //             const user = await User.findOne({username});

    //             if(!user)return done(null,false);

    //             if(user.password!==password)return done(null,false);


    //             return done(null,user);
            
    //     } catch (error) {
            
    //     return done(error ,false);
    //     }

        passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if(user.password!==password)return done(null,false);
      return done(null, user);
    });
  }
));



  ///  }));


    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });
    passport.deserializeUser(async(id,done)=>{
        try{
            const user = await User.findById(id);
            done(null,user);
        }catch(error)
        {
            done(error,false);
        }
    });
}


exports.isAuthenticated = (req,res,done)=>{
 
    if(req.user)return done();
    res.redirect("/login");
}