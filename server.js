const express = require("express");
const cors = require("cors");
const app = express();
const { sequelize } = require('./models/index');
const llmRouter = require('./routers/llm');
const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');
const experienceRouter = require('./routers/experience');
const projectRouter = require('./routers/project');
const fileRouter = require('./routers/file');
const certificationRouter = require('./routers/certification');
const newsletterRouter = require('./routers/newsletter');
const adminRouter = require('./routers/admin');
const { startDbKeepAlive } = require('./utils/db-keepalive');

const allowedOrigins = require('./common/allowed-origins');

const path = require("path");
const cookieParser = require("cookie-parser");
__dirname = path.resolve();

// In production there is exactly one proxy hop in front of this app (Caddy),
// which sets X-Forwarded-For. Without this, req.ip is Caddy's container IP for
// every request, so express-rate-limit puts the whole internet in one bucket —
// ten registrations per hour, globally. `1` rather than `true`: trusting the
// entire chain would let a client spoof its own address via the header.
app.set('trust proxy', 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(cookieParser());


app.use('/model', llmRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/experience', experienceRouter);
app.use('/certification', certificationRouter);
app.use('/uploads', fileRouter);
app.use('/newsletter', newsletterRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 1989;

async function startServer() {
  try {
    // await sequelize.sync({ force: true });
    // console.log('Database synced successfully');
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

    startDbKeepAlive();

  } catch (err) {
    console.error('Unable to connect to DB:', err);
  }
}

startServer();