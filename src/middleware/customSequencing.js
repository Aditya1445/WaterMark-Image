const mongoose = require('mongoose');
const counterSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    seq:{
        type:Number,
        required:true
    }
})

const counterModel = mongoose.model('Counter', counterSchema);

const getNextSequenceValue = async(seqName)=>{
    const countSeq = await counterModel.findByIdAndUpdate({"_id":seqName},{"$inc":{"seq":1}});
    if(countSeq){
        return countSeq.seq+1;
    }
    return null;
}

const insertCounter = async(seqName)=>{
    const newCounter = new counterModel({_id:seqName, seq:1000});
    await newCounter.save();
    return newCounter.seq;
}

module.exports = {
    counterModel,getNextSequenceValue,insertCounter
}