const {
  a,
  img,
  script,
  domReady,
  select,
  input,
  div,
  text,
  text_attr,
  canvas,
  button,
} = require("@saltcorn/markup/tags");
const { link } = require("@saltcorn/markup");
const { isNode } = require("@saltcorn/data/utils");
const { select_options } = require("@saltcorn/markup/helpers");
const File = require("@saltcorn/data/models/file");
const db = require("@saltcorn/data/db");
const path = require("path");
const fs = require("fs");

//FILEVIEWS
const image_cropper = {
  isEdit: true,
  setsDataURL: {
    get_filename: ({ id }) => (id ? `croppedPhoto${id}.png` : "croppedPhoto.png"),
    get_folder: ({ folder }) => folder,
  },
  configFields: async () => {
    const dirs = await File.allDirectories();
    const images = await File.find({ mime_super: "image" });
    return [
      {
        name: "folder",
        label: "Folder",
        type: "String",
        attributes: { options: dirs.map((d) => d.path_to_serve) },
      },      
      {
        name: "height",
        label: "Height (px)",
        type: "Integer",
      },
      {
        name: "width",
        label: "Width (px)",
        type: "Integer",
      },
    ];
  },
  run: (nm, file_name, attrs, cls, reqd, field) => {
    //console.log("in run attrs.files_accept_filter", attrs.files_accept_filter);
    let existing = null;
    
    
    if (file_name)
      try {
        const tenant = db.getTenantSchema();
        const safeFile = File.normalise(file_name);
        const absPath = path.join(db.connectObj.file_store, tenant, safeFile);
        const contents = fs.readFileSync(absPath);
        const b64 = contents.toString("base64");
        existing = `data:image/png;base64,${b64}`;
      } catch (e) {
        //ignore
        console.error("image-cropper existing error", e);
      }
   
    // Vraćamo HTML strukturu sa `div` i `input` odvojenim
return div(
  [
    // `div` sa klasom `cropme` i slikom
    div(
      {
        id: `image-cropper-${nm}`,
    class: "cropme",
    style: {
      width: attrs?.width + "px" || 'auto',  
      height: attrs?.height + "px" || 'auto' 
    }
      },
      existing ? img({ src: existing }) : null
    ),
    
    // `input` element koji je sada van `div` elementa sa klasom `cropme`
    input({
      
      type: "hidden",
      "data-fieldname": field.form_name,
      name: text_attr(nm),
      id: `input${text_attr(nm)}`,
      value: existing
    }),

    // `script` element za izvršavanje JavaScript koda
    script(
      domReady(`
        // Inicijalizuj cropper
        $('.cropme').simpleCropper(); 
    
        // Dodaj event listener za dugme "ok"
        document.querySelector(".ok").addEventListener("click", () => {
          // Koristi setTimeout da sačekaš da slika bude spremna
          setTimeout(() => {
            const imgElement = document.querySelector(".cropme img");
    
            // Provera da li je slika dostupna i da li je cropovanje završeno
            if (imgElement && imgElement.complete && imgElement.naturalWidth !== 0) {
              document.querySelector("#inputslika").value = imgElement.src;
            } else {
              console.error("Slika još nije spremna.");
            }
          }, 500); // Čekaj 500ms pre nego što pristupiš src
        });
      `)
    )
    
    
  ]
);

  },
};

module.exports = {
 
  sc_plugin_api_version: 1,
  plugin_name: "image-cropper",
 fileviews: { "Image Cropper": image_cropper },
 headers: [
 
  {
    script: "/plugins/public/image-cropper/jquery.Jcrop.js",
  },
  {
    script: "/plugins/public/image-cropper/jquery.SimpleCropper.js",
  },
  {
    css: "/plugins/public/image-cropper/style.css",
  },
  {
    css: "/plugins/public/image-cropper/style-example.css",
  },
  {
    css: "/plugins/public/image-cropper/jquery.Jcrop.css",
  },
],
  
};
