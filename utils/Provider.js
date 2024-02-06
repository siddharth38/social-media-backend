const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const passport = require("passport");
const User = require("../database/User");

const GOOGLE_CLIENT_ID =
  "315394074642-hqtqagkhfe81mn4d98emjt43ve8im9mg.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_CALLBACK_URL = "https://besthealing.baavlibuch.com/auth/logIn";

const connectPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        const user = await User.findOne({
          googleId: profile.id,
        });

        if (!user) {
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
          });

          return done(null, newUser);
        } else {
          return done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};

module.exports = connectPassport;
