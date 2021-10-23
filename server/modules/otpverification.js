
module.exports = async function sendotp(req, res, next){
    console.log('middleware touched')
    next();
}

exports = function verifyotp(req, res, next){

}

exports = function generateOtp(){
    return 1234;
}