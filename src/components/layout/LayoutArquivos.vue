<template>
  <a target='_blank' href="https://www.luminpdf.com/viewer/5d9563d8ecc48d00193d0887">
    <img src="https://firebasestorage.googleapis.com/v0/b/projetomkt-a0624.appspot.com/o/Arquivos%20base%2Fapresenta%C3%A7%C3%A3o-resultados.PNG?alt=media&token=59ccec4b-8767-4e84-b4bc-5667389aa439" >
  </a>
  <!--<iframe src="https://www.luminpdf.com/viewer/5d9563d8ecc48d00193d0887"></iframe>!-->
  <!-- <iframe src='https://drive.google.com/drive/folders/1R6R8p-2T_vzUJIqB-LgIBeFgJokVRE00.doc' width='623px' height='623px' frameborder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://drive.google.com'>Office Online</a>.</iframe> -->
</template>

<script>
/* eslint-disable */
export default {
  name: 'WebViewer',
  props: {
    path: String,
    url: String
  },
  mounted: function () {
        WebViewer({
            path: this.path,
            initialDoc: this.url, // replace with your own PDF file
          }, this.$refs.viewer).then((instance) => {
            // call apis here
          });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
img {
  padding: 15px;
  color: var(--featured);
  width: 100%;
  height: 100vh;
}
</style>
