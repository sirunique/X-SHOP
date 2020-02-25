// module.exports = (req, res, next)=>{
//     if(req.isAuthenticated()){
//         return next()
//     }
//     res.redirect('/account/signin')
// }

exports.accountAuth = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    req.session.oldUrl = req.url
    res.redirect('/account/signin')
}
