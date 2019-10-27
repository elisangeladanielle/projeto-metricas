<template>
  <div class="container">
  <div class="row align-items-center">
    <div class="col-sm">
      <div class="card-body">
        <div class="card-img-top">
          <a target='_blank' href="https://firebasestorage.googleapis.com/v0/b/projetomkt-a0624.appspot.com/o/Arquivos%20base%2FApresenta%C3%A7%C3%A3o%20de%20Resultados%202017.pdf?alt=media&token=71250d79-fcdd-42ba-ab9a-27781edbbbaa">
            <img class="rounded" src="https://firebasestorage.googleapis.com/v0/b/projetomkt-a0624.appspot.com/o/Arquivos%20base%2Fapresenta%C3%A7%C3%A3o-resultados.PNG?alt=media&token=59ccec4b-8767-4e84-b4bc-5667389aa439">
          </a>
          </div>
          <h5 class="card-title">Card title</h5>
        </div>
      </div>
    </div>
  </div>
  <!--<iframe src="https://www.luminpdf.com/viewer/5d9563d8ecc48d00193d0887"></iframe>
  <iframe src='https://drive.google.com/drive/folders/1R6R8p-2T_vzUJIqB-LgIBeFgJokVRE00.doc' width='623px' height='623px' frameborder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://drive.google.com'>Office Online</a>.</iframe> -->
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
.card-body {
  color: var(--light);
  background: var(--dark-low);
  padding: 15px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
img {
  padding: 15px;
  color: var(--featured);
  width: 100%;
  height: 100%;
}
.container {
  padding: 15px;
  color: var(--featured);
  width: 50%;
  height: 50%;
}
</style>
