const express = require("express");
const cors = require("cors");
const app = express();
const { sequelize } = require('./models/index');
const llmRouter = require('./routers/llm');
const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');
const experienceRouter = require('./routers/experience');
const projectRouter = require('./routers/project');

const allowedOrigins = [
  "http://localhost:8080",
];

const path = require("path");
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

app.use('/model', llmRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/experience', experienceRouter);

const PORT = process.env.PORT || 1989;

async function startServer() {
  try {
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: true });
    } else {
      await sequelize.sync();
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Unable to connect to DB:', err);
  }
}

startServer();