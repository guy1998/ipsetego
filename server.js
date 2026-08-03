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