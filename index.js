//IMPORT----------------------------------------------------------------------------------------------------------------------
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



// FILEVIEWS----------------------------------------------------------------------------------------------------------------------

const image_cropper = {
  isEdit: true,
  setsDataURL: {
    get_filename: ({ id }) => (id ? `profilna${id}.png` : "profilna.png"),
    get_folder: ({ folder }) => folder,
  },

  // Polja za postavke
  configFields: async () => {
    return [
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

  // HTML i skripta za cropper
  run: (nm, file_name, attrs = {}, cls, reqd, field) => {
    const width = attrs.width ? `${attrs.width}px` : 'auto';
    const height = attrs.height ? `${attrs.height}px` : 'auto';

    return div(
      {
        id: `image-cropper-${nm}`,
        class: "cropme",
        style: `width: ${width}; height: ${height};`,
      },



      script(
        domReady(`
          
          // Inicijalizacija croppera
          $('.cropme').simpleCropper();
          // Pronalaženje forme i postavljanje submit događaja
          const form = $('form'); // Ovdje možeš precizirati selektor ako postoji više formi
      
          form.on('submit', async function(event) {
            
      
            console.log("OK");
           
const imgElement = document.querySelector('#image-cropper-slika img');
const imgSrc = imgElement.src;



  // HERE GOES SOME CODE???



      
            });
        
          
          
          `)
      )
      



    );
  },
};



//FIELDVIEWS----------------------------------------------------------------------------------------------------------------------
  const image_cropper_base64_img = {
    isEdit: true, // Indikator da li je widget u režimu uređivanja.
    type: "HTML", // Tip sadržaja, u ovom slučaju HTML.
    blockDisplay: true, // Da li treba prikazati element kao blok.
    handlesTextStyle: true, // Da li widget može da upravlja stilovima teksta.
    
    run: (nm, file_name, attrs, cls, reqd, field) => {
      
  
      // Validacija dimenzija
      const width = attrs?.width ? `${attrs.width}px` : 'auto';
      const height = attrs?.height ? `${attrs.height}px` : 'auto';
    },
  };
  



//EXPORT----------------------------------------------------------------------------------------------------------------------
module.exports = {
  sc_plugin_api_version: 1,
  plugin_name: "image-cropper",
  fileviews: { CROMPE: image_cropper },
  fieldviews: {image_cropper_base64_img},
  headers: [
    {
      script: "/plugins/public/image-cropper/jquery-1.10.2.min.js",
    },
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
