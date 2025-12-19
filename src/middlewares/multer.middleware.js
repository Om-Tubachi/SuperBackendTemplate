import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")   // cb tells multer location in which file has to be saved in the ssd
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)   // this cb gives a name to the file that we are uploading in the hard drive
    }
  })
  
export const upload = multer({ 
    storage, 
})