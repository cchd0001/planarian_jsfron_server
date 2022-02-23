module.exports = {
  GENE_URL : {
    default_version : 'v202201', 
    select_conf : [
        { value: 'v202201' , label:'version 2022/01' },
        { value: 'v202202' , label:'version 2022/02' },
    ],
    v202201 : {
      url_model : 'http://49.235.68.146/cell_center/',
      url_umap  : 'http://49.235.68.146/cell_umap/',
      url_model_expression : 'http://49.235.68.146/newgenes/',
      url_umap_expression  : 'http://49.235.68.146/gene_umap/',
    },
    v202202 : {
      url_model : 'http://49.235.68.146/cell_center/',
      url_umap  : 'http://49.235.68.146/cell_umap/',
      url_model_expression : 'http://49.235.68.146/newgenes/v20220221/',
      url_umap_expression  : 'http://49.235.68.146/gene_umap/v20220221/',
    },
  },
};
