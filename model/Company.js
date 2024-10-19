const mongoose = require('mongoose');
const { Schema } = mongoose;
const CompanySchema= new Schema({
    name:{
        type: 'string',
        required: true,
    },
    companyName:{
        type: 'string',
        required: true,
    },
    companyEmail:{
        type: 'string',
        required: true,
    },
    employeeSize:{
        type: 'string',
        required: true,
    },
    phone:{
        type: 'string',
        required: true,
    },
    otp:{
        type: 'number',
        required: true,
    }

})
const Company = mongoose.model('company',CompanySchema);
module.exports =Company;
