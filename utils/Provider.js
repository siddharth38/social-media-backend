const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const passport = require("passport");
const User = require("../database/User");

const GOOGLE_CLIENT_ID =
  "1028441264640-pp9irv1kqt3o3smlp4p26l8d619vok8k.apps.googleusercontent.com";
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
