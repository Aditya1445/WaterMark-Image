const handleErrors = function (error){

    let errors = {email:"", password:""};

    console.log('Error log',error.message)
    //Duplicate mail
    if(error.code === 11000){
        errors.email = 'Email is already in use'
    }
    // Incorrect email
    if(error.message === 'Incorrect Email'){
        errors.email = 'Could not find the email'
    }
    // Incorrect password
    if(error.message === 'Incorrect Password'){
        errors.password = 'Password does not match'
    }

    // user validation failed while signing up
    if(error.message.includes('User validation failed')){
        // console.log('Error here', Object.values(error.errors));
        Object.values(error.errors).forEach((properties)=>{
            errors[properties.path] = properties.message
        })
    }
    return errors
}
const imageErrors = function(err){
    let error = {}
    if(err.message.includes("image validation failed")){
        Object.values(err.errors).forEach((properties)=>{
            error[properties.path] = properties.message
        })
    }
    return error;
}
module.exports = {handleErrors, imageErrors}