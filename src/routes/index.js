export default function ({ app, database, passport }) {
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/success");
    }
  );

  app.get("/protected", (req, res) => {
    if (req.isAuthenticated()) {
      res.send("Protected route accessed successfully");
    } else {
      res.redirect("/login");
    }
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  return app;
}
