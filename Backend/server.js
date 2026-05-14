import "dotenv/config";
import express from "express";
import cors from "cors";

import { clerkMiddleware } from '@clerk/express'
import { connectDB } from "./config/db.js";
import doctorRouter from "./routes/doctorRouter.js";
import serviceRouter from "./routes/serviceRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import serviceAppointmentRouter from "./routes/serviceAppointmentRouter.js";
const app = express();
 
const allowedOrigins = [
  "https://doctor-mern-admin.onrender.com", //admin frontend
  "https://doctor-mern-frontend.onrender.com", //user frontend
  "http://localhost:5175",
  "http://localhost:3000",
  "http://localhost:3001"
];
    
    //middleware   
 app.use(cors({
    origin: function (origin, callback) {
        if(!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
        // Remove trailing slash for comparison
        const originWithoutSlash = origin.replace(/\/$/, '');
        if(allowedOrigins.includes(originWithoutSlash)){
            return callback(null, true);
        }
        console.log(`CORS blocked origin: ${origin}`);
        return callback(new Error("CORS policy: This origin is not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
 }))   ;
app.use(express.json({limit: '20mb'}));
app.use(clerkMiddleware())
app.use(express.urlencoded({ extended: true }));

//DB
connectDB();

//Routes
app.use("/api/doctors",doctorRouter);
app.use("/api/services",serviceRouter);
app.use("/api/appointments",appointmentRouter);
app.use("/api/service-appointments",serviceAppointmentRouter);
//Routes
app.get("/",(req,res) => {
    res.send("Hello World");
});

//Start server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});