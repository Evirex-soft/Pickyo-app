require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(hpp());

app.use(morgan('combined')); // logging middleware

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Pickyo API is running!',
        status: 'Scale Ready'
    })
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})