const {Router} = require ('express');
const path = require('path');

const router = Router(); 

router.get("/img/upload/:nom", function(req, rep){
    const nom = req.params.nom

    var options = { 
        root: path.join(path.dirname(''), 'upload'),
        //root: path.dirname(''),
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
    const chemin = nom 
    rep.sendFile(chemin , options);
})

module.exports = router;