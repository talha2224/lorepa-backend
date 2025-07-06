const mongoose = require("mongoose");

const trailerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    title: { type:String, required: true },
    category: { type: String, required: true },
    make:{type:String,required:true},
    model:{type:String,required:true},
    description:{type:String,required:true},
    year:{type:String,required:true},
    length:{type:String,required:true},
    sleeps:{type:String,required:true},
    address:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    zip:{type:String,required:true},
    dailyRate:{type:String,required:true},
    weeklyRate:{type:String,required:true},
    monthlyRate:{type:String,required:true},
    cleaningRate:{type:String,required:true},
    securityRate:{type:String,required:true},
    insuranceDeductible:{type:String,required:true},
    images:{type:Array,default:[]},
    status:{type:String,default:"Pending"},
    createdAt: { type: Date, default: Date.now }
});

const TrailerModel = mongoose.model("Trailer", trailerSchema, "Trailer");

module.exports = { TrailerModel };
