import formidable from "formidable";
import fsp from "node:fs/promises"
import path from "node:path";
import Joi from "joi"

/**
 * fonction middleware qui verifier que fichier est une image et qu'il fait moins de 1 Mo
 * @param {*} req 
 * @param {*} rep 
 * @param {*} next 
 */
export function isValidImg(req, rep, next){
    // attention mettre des vérifications notamment sur le type de fichiers / poids des fichiers avant l'import 
    const form = formidable();
    // récupération des données du formulaire dans req.body 
    // on utilise les name des input comme clefs de req.body
    form.parse(req, async (err, fields, files) =>  {

        //console.log(fields.description[0] , files.file[0].filepath);
        //rep.json("ok")
        //console.log(path.dirname(''))
        if(!files.file){
            return rep.status(400).json({msg : "fichier image obligatoire"});
        }
        const file = files.file[0];

        const typeMines = [
            "image/png",
            "image/jpeg" ,
            "image/gif" ,
            "image/webp"
        ];

        if(! typeMines.includes(file.mimetype)  ){
            return rep.status(400).json({msg : "uniquement des fichiers images"});
        }

        if(file.size > 1_000_000  ){ // max 1Mo
            return rep.status(400).json({msg : "fichier trop lourd - maximum 1Mo"});
        }

        const oldPath = file.filepath;
        const newPath = path.join( path.dirname('') , 'upload') + '/' + file.originalFilename
        req.oldPath = oldPath,
        req.newPath = newPath;
        req.fields = fields;
        next();
    })
}
/**
 * fonction middleware qui prend un fichier et le met dans le dossier upload
 * @param {*} req 
 * @param {*} rep 
 * @param {*} next 
 */
export async function downloadImg(req, rep, next){
    const {oldPath , newPath } = req;
    let rawData = await fsp.readFile(oldPath)
    try {
        await fsp.writeFile(newPath, rawData );
        next();
    }catch(err){
        console.log(err)
        rep.status(500).json({msg : "erreur est survenue"})
    }
}
/**
 * fonction middleware pour express permet de valider que l'article est valide via joi
 * @param {*} req 
 * @param {*} rep 
 * @param {*} next 
 * @returns 
 */
export function isValidArticle(req, rep, next){
    const { fields , newPath} = req

    /* const validArticle = Joi.object({
        description : Joi.string().min(2).max(255).required(),
        img : Joi.string().min(2).max(255).required()
    }) */

    const article = {
        titre : fields.titre[0] ,
        contenu : fields.contenu[0],
        commentaires : [], 
        categorie : fields.categorie[0]  ,
        auteur : fields.auteur[0] ,
        img : newPath
    }

    /* const {error} = validArticle.validate(article , {abortEarly : false})

    if(error){
        console.log(error);
        return rep.status(400).json({msg : "formulaire mal rempli"})
    } */
    req.article = article ; 
    next();
}